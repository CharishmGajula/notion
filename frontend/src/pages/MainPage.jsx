import React, { useState,useMemo } from 'react'
import Block1 from '../Components/Block1';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../Context/useContext';
import { useEffect } from 'react';
import ShareBar from '../Components/ShareBar';
import Comment from '../Components/Comment';
import { useNavigate } from 'react-router-dom';
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import Online from '../Components/Online';


export default function MainPage() {
    const [title, setTitle] = useState("Untitled");
    const editorRef = useRef(null);
    const {page,setPages}=useUser();
    const { pageId } = useParams();
    const [editorContent, setEditorContent] = useState(null);
    const [startingData,setStartingData]=useState(null);
    const [childPages,setChildPages]=useState([]);
    const navigate=useNavigate();
    const [online,setOnline]=useState([]);
    
    const ydocRef = useRef(null);
    const providerRef = useRef(null);

    useEffect(() => {
        const ydoc = new Y.Doc();
        const provider = new WebrtcProvider(`document-${pageId}`, ydoc, {
        signaling: ["ws://localhost:4444"],
    });
    
    ydocRef.current = ydoc;
    providerRef.current = provider;

    console.log(`Connected to WebRTC room: document-${pageId}`);

    return () => {
        provider.destroy();
        ydoc.destroy();
        providerRef.current = null;
        ydocRef.current = null;
    };
    }, [pageId]);


    const ydoc = ydocRef.current;
    const provider = providerRef.current;
    // const awareness = provider?.awareness;

    const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

    useEffect(() => {
  if (!provider) return;

  const awareness = provider?.awareness;

  const updateOnlineUsers = () => {
    const states = Array.from(awareness.getStates().values());
    setOnline(states);
    console.log(states);
  };

  awareness.on("change", updateOnlineUsers);
  updateOnlineUsers(); 

  return () => {
    awareness.off("change", updateOnlineUsers);
  };
}, [provider]);


    useEffect(() => {
        if (provider) {
            provider.on('status', (event) => {
            console.log('WebRTC status:', event.status); 
        });
    }
    }, [provider]);

    useEffect(() => {
        if (provider) {
            provider.awareness.on("change", (changes) => {
            console.log("Awareness changed:", changes);
        });
    }
    }, [provider]);

    useEffect(() => {
        if (!provider) return;
        const onPeersChanged = () => {
        console.log('Connected peers:', provider?.webrtcConnections.size);
    };
        provider.on('peers', onPeersChanged);
        return () => provider.off('peers', onPeersChanged);
        }, [provider]);

        useEffect(()=>
        {
            async function fetchData()
            {
                try{
                    console.log("hey");
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
            setStartingData(page.content);
            console.log(data.content);
            console.log(data);
            }
            catch(err){
                console.log(`Unable to fetch Data ${err}`);
                
            }
        }
        fetchData();
    },[pageId])


    const handleTitleChange = async (newTitle) => {
    setTitle(newTitle)
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

   useEffect(() => {
  if (!editorContent) return;

  const timeoutId = setTimeout(async () => {
    try {
      console.log("Saving content to backend:", editorContent);
      await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ content: editorContent }),
        });
        } catch (err) {
        console.error("Content save failed:", err);
        }
        }, 1500); 

        return () => clearTimeout(timeoutId); 
    }, [editorContent]);


  const saveContentIntoBlock = async (json) => {
  try {
    await fetch(`http://localhost:5005/api/pages/${pageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ content: json }),
    });
    } catch (err) {
    console.error("Content save failed:", err);
    }
    };


  return (
    <>
    <div className="w-full flex justify-end px-4 pt-4">
        <Online online={online}/>
        <ShareBar />
         <Comment />
    </div>
    <div className="flex-1 relative" ref={editorRef}>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={() => {
              if (title.trim() === "") setTitle("Untitled");
            }}
            placeholder="Untitled"
            className="ml-10 mt-10 text-4xl font-bold mb-6 outline-none border-none w-full bg-transparent text-gray-900"
          />
          {startingData&&(
            <Block1
            ydoc={ydoc}
            provider={provider}
             pageId={pageId}
          editorRef={editorRef}
          setEditorContent={setEditorContent}
          startingData={startingData}  
          setStartingData={setStartingData} 
          />
          )
          }
         
    </div>
        {childPages.length > 0 && (
            <div className="pl-20">
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
    </>
  )
}