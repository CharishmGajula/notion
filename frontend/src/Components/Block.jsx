import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import { AiOutlinePlus } from "react-icons/ai";

const extensions = [
  StarterKit.configure({
    bulletList: false,
    listItem: false,
    underline: false,
    strike: false,
    code: false,
  }),
  BulletList,
  ListItem,
  Underline,
  Strike,
  Code,
  TextStyle,
  Color,
  Highlight,
  Placeholder.configure({
    placeholder: "Type here...",
    showOnlyCurrent: true,
  }),
];

function Block({ id, onDelete, onEnter, editorRefs, saveBlockContent }) {
  const [hovered, setHovered] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showColorBox, setShowColorBox] = useState(false);

  const editor = useEditor({
    extensions,
    content: "<p></p>",
    editorProps: {
      handleKeyDown(view, event) {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onEnter(id);
          return true;
        }
        if (event.key === "Backspace" && view.state.doc.textContent === "") {
          event.preventDefault();
          onDelete(id);
          return true;
        }
        return false;
      },
    },
  });

  // Update refs and save on every change
  useEffect(() => {
    if (editor) {
      editorRefs.current[id] = editor;

      const updateHandler = () => {
        const json = editor.getJSON();
        saveBlockContent(id, json); // 👈 Save updated content
      };

      editor.on('update', updateHandler);

      return () => {
        editor.off('update', updateHandler); // Clean up
      };
    }
  }, [editor]);

  return (
    <div
      className="relative group py-2 flex items-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowToolbar(false);
      }}
    >
      <div className="flex items-start relative w-full max-w-3xl mx-auto pl-10">
        {hovered && (
          <button
            onClick={() => setShowToolbar((prev) => !prev)}
            className="absolute left-0 top-1 text-gray-400 hover:text-black z-10 transition"
          >
            <AiOutlinePlus size={18} />
          </button>
        )}

        {showToolbar && editor && (
          <div className="absolute -left-40 top-3 bg-white shadow-lg p-2 rounded border w-[200px] z-20 space-y-1 max-h-60 overflow-y-auto">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="block text-sm hover:font-medium">Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="block text-sm hover:font-medium">Italic</button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="block text-sm hover:font-medium">Underline</button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className="block text-sm hover:font-medium">Strike</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="block text-sm hover:font-medium">• List</button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className="block text-sm hover:font-medium">Code</button>
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className="block text-sm hover:font-medium">Highlight</button>
            <button onClick={() => setShowColorBox(!showColorBox)} className="block text-sm">🎨 Color</button>

            {showColorBox && (
              <div className="grid grid-cols-5 gap-1 mt-1">
                {['#000000', '#EF4444', '#F97316', '#EAB308', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'].map((color) => (
                  <button
                    key={color}
                    className="w-5 h-5 rounded-full border hover:scale-110 transition"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      editor.chain().focus().setColor(color).run();
                      setShowColorBox(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 rounded transition">
          <EditorContent
            editor={editor}
            className="text-lg min-h-[32px] border-none"
          />
        </div>
      </div>
    </div>
  );
}

export default Block;
