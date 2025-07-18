// src/Tiptap.jsx
import React from 'react'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

const extensions = [StarterKit]

const content = '<p>Hello World!</p>'

function TiptapInner() {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  return (
    <>
      <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
      </FloatingMenu>

      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleStrike().run()}>Strike</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      </BubbleMenu>
    </>
  )
}

export default function Tiptap() {
  return (
    <EditorProvider extensions={extensions} content={content}>
      <TiptapInner />
    </EditorProvider>
  )
}
