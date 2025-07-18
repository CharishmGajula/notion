import React, { useState, useRef, useEffect } from "react";
import Block from "./Block";
import { useParams } from "react-router-dom";
import { useUser } from "../Context/useContext";
import { useNavigate } from "react-router-dom";
import ShareBar from "./ShareBar";
export default function BlockEditor2({ defaultTitle = "Untitled" }) {
const navigate=useNavigate()
  const [title, setTitle] = useState(defaultTitle);
  const [blocks, setBlocks] = useState([]);
  const [childPages, setChildPages] = useState([]);
  const editorRefs = useRef({});
  const latestContent = useRef({}); // ✅ Store latest block content
  const savingRef = useRef(false);
  const { pageId } = useParams();
  const { setPages } = useUser();

  const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

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

    const data = await res.json();
    const page = data.page;
    const children = data.children || []; 

    setTitle(page.title || "Untitled");

    const savedContent = page.content || [];

    if (savedContent.length === 0) {
      const newId = generateId();
      setBlocks([newId]);

      setTimeout(() => {
        const ref = editorRefs.current[newId];
        if (ref) {
          ref.commands.setContent("<p></p>");
        }
        savingRef.current = true;
      }, 50);
    } else {
      const newBlockIds = savedContent.map((block) => block.id);
      setBlocks(newBlockIds);

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

    setChildPages(children); 

    } catch (err) {
    console.error("Failed to load page content:", err);
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
    const contentArray = Object.entries(latestContent.current).map(
      ([id, content]) => ({
        id: Number(id),
        content,
      })
    );

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
      console.error("Failed to save content:", err);
    }
  };

  const saveBlockContent = (id, content) => {
    latestContent.current[id] = content;
  };

  const handleTitleChange = async (newTitle) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.pageId === pageId ? { ...page, title: newTitle } : page
      )
    );

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
      console.error("Failed to update title:", err);
    }
  };

  const handleEnter = (id) => {
    const index = blocks.indexOf(id);
    const newId = generateId();
    const allllBlocks = [...blocks];
    allllBlocks.splice(index + 1, 0, newId);
    setBlocks(allllBlocks);

    setTimeout(() => {
      editorRefs.current[newId]?.commands.focus("start");
    }, 50);
  };

  const handleDelete = (id) => {
    if (blocks.length === 1) return;

    const index = blocks.indexOf(id);
    const newBlocks = blocks.filter((b) => b !== id);
    setBlocks(newBlocks);
    delete latestContent.current[id];

    setTimeout(() => {
      const prevId = newBlocks[index - 1] ?? newBlocks[0];
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
          onChange={(e) => {
            const newTitle = e.target.value;
            setTitle(newTitle);
            handleTitleChange(newTitle);
          }}
          onBlur={() => {
            if (title.trim() === "") setTitle("Untitled");
          }}
          placeholder="Untitled"
          className="text-4xl font-bold mb-6 outline-none border-none w-full bg-transparent text-gray-900"
        />

        

        {blocks.map((id) => (
          <Block
            key={id}
            id={id}
            onDelete={handleDelete}
            onEnter={handleEnter}
            editorRefs={editorRefs}
            saveBlockContent={saveBlockContent} 
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
