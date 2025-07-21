import "./stles.css"
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect } from "react";
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { useUser } from "../Context/useContext.jsx";


export default function Block1({ editorRef, setEditorContent,startingData,ydoc,provider }) {
  const {user}=useUser();
  const {pages}=useUser();
  const [showSelectionBox, setShowSelectionBox] = useState(false);
  const {showShare}=useUser();
  
    const editor = useEditor(
      {
        extensions: [StarterKit, 
          Underline, 
          TextStyle, 
          Color,
         Collaboration.configure({ document: ydoc }),
        CollaborationCaret.configure({
        provider:provider,
        user: {
          name: user.name|| "Anonymous",
          color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
        },
      }),
      ],
      onUpdate: ({ editor }) => {
        const json = editor.getJSON();
        setEditorContent(json);
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
        },
      },
      }
    );

  useEffect(() => {
  if (startingData && editor) {
    const currentContent = editor.getJSON();
    if (JSON.stringify(currentContent) !== JSON.stringify(startingData)) {
      editor.commands.setContent(startingData);
    }
  }
}, [startingData, editor]);



  if (!editor) return <p className="text-center">Loading editor...</p>;

  return (
    <div className="relative w-full px-4 pt-4 pb-10 max-w-5xl mx-auto">

      <div className="mr-20border border-gray-300 rounded-xl p-4 min-h-[400px] overflow-x-auto">
        <EditorContent editor={editor} className="break-all whitespace-pre-wrap"/>
      </div>

      {editor&&!showShare && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-3 rounded-xl flex flex-col items-center gap-3 z-50 border">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={`font-bold p-2 border rounded w-8 h-8 flex items-center justify-center ${editor.isActive("bold") ? "bg-gray-200" : ""}`}>B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`italic p-2 border rounded w-8 h-8 flex items-center justify-center ${editor.isActive("italic") ? "bg-gray-200" : ""}`}>I</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`underline p-2 border rounded w-8 h-8 flex items-center justify-center ${editor.isActive("underline") ? "bg-gray-200" : ""}`}>U</button>
          <div className="flex flex-col gap-2 mt-2">
            {["#EF4444", "#10B981", "#3B82F6", "#000000"].map((color) => (
              <button
                key={color}
                onClick={() => editor.chain().focus().setColor(color).run()}
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}