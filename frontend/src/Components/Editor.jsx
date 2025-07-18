import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'

const extensions = [
  StarterKit.configure({
    bulletList: false,
    listItem: false,
    code: false,
    underline: false, // handled by external Underline extension
    strike: false,    // handled separately
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


export default function Editor({ id, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const editor = useEditor({
    extensions,
    content: '<p></p>',
  })

  return (
    <div
      className="relative my-4 flex items-start"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setShowToolbar(false)
      }}
    >
      {/* Editor wrapper with left margin for buttons */}
      <div className="flex items-start relative w-full pl-12">
        
        {/* + Button */}
        {hovered && (
          <button
            onClick={() => setShowToolbar((prev) => !prev)}
            className="absolute left-0 top-2 text-gray-500 hover:text-black z-10"
          >
            +
          </button>
        )}

        {/* Floating Toolbar aligned to left of block */}
        {showToolbar && editor && (
          <div className="absolute -left-20 top-2 bg-white shadow-md p-2 rounded border w-[130px] z-20 space-y-1">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="block text-sm">Bold</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="block text-sm">Italic</button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="block text-sm">Underline</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="block text-sm">• List</button>
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className="block text-sm">Highlight</button>
            <button onClick={() => editor.chain().focus().setColor('#e11d48').run()} className="block text-sm text-rose-600">Red</button>
            <button onClick={() => editor.chain().focus().setColor('#2563eb').run()} className="block text-sm text-blue-600">Blue</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="block text-sm">H1</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="block text-sm">H2</button>
          </div>
        )}

        {/* Editor Block */}
        <div className="flex-1 border rounded p-3 hover:bg-gray-50">
          <EditorContent
            editor={editor}
            onKeyDown={(e) => {
              if (
                e.key === 'Backspace' &&
                editor?.isEmpty &&
                typeof onDelete === 'function'
              ) {
                e.preventDefault()
                onDelete(id)
              }
            }}
            className="tiptap min-h-[50px] focus:outline-none"
          />
        </div>
      </div>
    </div>
  )
}
