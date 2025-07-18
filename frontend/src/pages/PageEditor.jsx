import React, { useState } from "react";
import EditableBlock from "../Components/EditableBlock";

export default function PageEditor() {
  const [title, setTitle] = useState("Untitled");
  const [blocks, setBlocks] = useState(Array(5).fill("<p></p>"));

  const handleBlockUpdate = (index, newContent) => {
    const updated = [...blocks];
    updated[index] = newContent;
    setBlocks(updated);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const updated = [...blocks];
      updated.splice(index + 1, 0, "<p></p>");
      setBlocks(updated);
    }
  };

  return (
    <div className="px-20 py-10">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-bold mb-6 outline-none border-none w-full bg-transparent"
        placeholder="Untitled"
      />

      {blocks.map((block, index) => (
        <div key={index} onKeyDown={(e) => handleKeyDown(e, index)}>
          <EditableBlock
            content={block}
            onUpdate={(html) => handleBlockUpdate(index, html)}
          />
        </div>
      ))}
    </div>
  );
}
