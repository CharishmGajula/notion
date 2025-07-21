import React, { useState, useRef, useEffect } from "react";
import Block from "./Block";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../Context/useContext";
import ShareBar from "./ShareBar";
import socket from "../socket";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';


export default function BlockEditor2() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("UNTITLED");
  const [blocks, setBlocks] = useState([]);
  const [childPages, setChildPages] = useState([]);
  const [cursors, setCursors] = useState({});
  const user=useUser();

  const editorRefs = useRef({});
  const latestContent = useRef({});
  const savingRef = useRef(false);

  const { pageId } = useParams();
  const { setPages } = useUser();

  const ydocRef=useRef(new Y.Doc());
  const awarenessRef=useRef(new Awareness(ydocRef.current));

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);


  useEffect(() => {
  if (!user) return;
  awarenessRef.current.setLocalStateField("user", {
    name: user.name || user.email || "Anonymous",
    color: "#3B82F6",
  });
}, [user]);

useEffect(() => {
  const awareness = awarenessRef.current;

  const handleAwarenessEmit = ({ added, updated, removed }) => {
    const update = encodeAwarenessUpdate(
      awareness,
      added.concat(updated, removed)
    );
    socket.emit("awareness", update); // 🧠 match server-side!
  };

  const handleAwarenessReceive = (update) => {
    applyAwarenessUpdate(awareness, new Uint8Array(update));
  };

  awareness.on("update", handleAwarenessEmit);
  socket.on("awareness", handleAwarenessReceive);

  return () => {
    awareness.off("update", handleAwarenessEmit);
    socket.off("awareness", handleAwarenessReceive);
  };
}, []);


  useEffect(() => {
    socket.connect();
    socket.emit("join-room", `page-${pageId}`);

    return () => {
      socket.emit("leave-page", pageId);
    };
  }, [pageId]);

  useEffect(() => {
    socket.on("block-added", ({ blockId, afterId }) => {
      const index = blocks.findIndex((b) => b === afterId);
      if (index === -1) return;
      if (blocks.includes(blockId)) return;

      const updated = [...blocks];
      updated.splice(index + 1, 0, blockId);
      setBlocks(updated);
      latestContent.current[blockId] = { type: "doc", content: [] };
    });

    socket.on("block-deleted", ({ blockId }) => {
      if (!blocks.includes(blockId)) return;
      const updated = blocks.filter((b) => b !== blockId);
      setBlocks(updated);
      delete latestContent.current[blockId];
    });

    socket.on("cursor-update", ({ blockId, pos, userId }) => {
      setCursors((prev) => ({ ...prev, [userId]: { blockId, pos } }));
    });

    return () => {
      socket.off("block-added");
      socket.off("block-deleted");
      socket.off("cursor-update");
    };
  }, [blocks]);



  useEffect(() => {
    editorRefs.current = {};
    latestContent.current = {};
    setBlocks([]);
    setTitle("Untitled");
    savingRef.current = false;

    async function fetchPage() {
      try {
        const res = await fetch(`http://localhost:5005/api/pages/${pageId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });

        if (res.status === 401) return navigate("/");
        if (res.status === 403) return navigate("/not-allowed");

        const data = await res.json();
        const page = data.page;
        const children = data.children || [];
        setChildPages(children);
        setTitle(page.title || "Untitled");
        const savedContent = page.content || [];

        if (savedContent.length === 0) {
          const newId = generateId();
          setBlocks([newId]);
          setTimeout(() => {
            editorRefs.current[newId]?.commands.setContent("<p></p>");
            latestContent.current[newId] = { type: "doc", content: [] };
            savingRef.current = true;
          }, 50);
        } else {
          const ids = savedContent.map((block) => block.id);
          setBlocks(ids);
          setTimeout(() => {
            savedContent.forEach((block) => {
              const ref = editorRefs.current[block.id];
              if (ref && block.content) {
                ref.commands.setContent(block.content);
                latestContent.current[block.id] = block.content;
              }
            });
            savingRef.current = true;
          }, 50);
        }
      } catch (err) {
        console.error("Failed to load page:", err);
      }
    }

    fetchPage();
  }, [pageId]);

  useEffect(() => {
    if (!savingRef.current) return;
    const timeout = setTimeout(() => {
      saveContentToFirebase();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [blocks, title]);

  const saveContentToFirebase = async () => {
    const contentArray = Object.entries(latestContent.current).map(([id, content]) => ({
      id: Number(id),
      content,
    }));

    try {
      await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ content: contentArray }),
      });
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  const saveBlockContent = (id, content) => {
    latestContent.current[id] = content;
  };

  const handleTitleChange = async (newTitle) => {
    setPages((prev) => prev.map((p) => (p.pageId === pageId ? { ...p, title: newTitle } : p)));
    try {
      await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (err) {
      console.error("Title update failed:", err);
    }
  };

  const handleEnter = (id) => {
    const index = blocks.findIndex((b) => b === id);
    const newId = generateId();
    const updated = [...blocks];
    updated.splice(index + 1, 0, newId);
    setBlocks(updated);
    latestContent.current[newId] = { type: "doc", content: [] };
    socket.emit("add-block", { pageId, blockId: newId, afterId: id });
    setTimeout(() => {
      editorRefs.current[newId]?.commands.focus("start");
    }, 50);
  };

  const handleDelete = (id) => {
    if (blocks.length === 1) return;
    const index = blocks.findIndex((b) => b === id);
    const updated = blocks.filter((b) => b !== id);
    setBlocks(updated);
    delete latestContent.current[id];
    socket.emit("delete-block", { pageId, blockId: id });
    setTimeout(() => {
      const prevId = updated[index - 1] ?? updated[0];
      editorRefs.current[prevId]?.commands.focus("end");
    }, 50);
  };


  

  return (
    <>
      <div className="w-full flex justify-end px-4 pt-4">
        <ShareBar />
      </div>
      <div className="w-full px-4 pt-8 pb-10">
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={() => {
              if (title.trim() === "") setTitle("Untitled");
            }}
            placeholder="Untitled"
            className="text-4xl font-bold mb-6 outline-none border-none w-full bg-transparent text-gray-900"
          />

          {awarenessRef.current &&
              blocks.map((id) => (
    <Block
      key={id}
      id={id}
      pageId={pageId}
      onDelete={handleDelete}
      onEnter={handleEnter}
      editorRefs={editorRefs}
      saveBlockContent={saveBlockContent}
      awareness={awarenessRef.current}
      
    />
))}

          {childPages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm text-gray-500 font-semibold mb-2">Subpages:</h3>
              <ul className="space-y-1">
                {childPages.map((child) => (
                  <li key={child.pageId}>
                    <button
                      onClick={() => navigate(`/page/${child.pageId}`)}
                      className="w-230 flex flex-col items-start text-black-600 font-bold text-sm hover:bg-gray-300 rounded p-3"
                    >
                      ➕ {child.title || "Untitled"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
