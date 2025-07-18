import React, { useRef, useState, useEffect } from "react";

export default function BlockEditor() {
  const [title, setTitle] = useState("Untitled");
  const [blocks, setBlocks] = useState(Array(10).fill(""));
  const blockRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, "");
      setBlocks(newBlocks);

      // Wait for DOM update to focus new block
      setTimeout(() => {
        blockRefs.current[index + 1]?.focus();
      }, 0);
    }

    if (e.key === "Backspace") {
    if (blocks[index] === "" && blocks.length > 1) {
    e.preventDefault(); // Prevent default deletion

    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1); 
    setBlocks(updatedBlocks);

    setTimeout(() => {
      const prevIndex = Math.max(0, index - 1);
      const prevBlock = blockRefs.current[prevIndex];
      if (prevBlock) {
        prevBlock.focus();

        // Move cursor to end of previous block
        const len = prevBlock.value.length;
        prevBlock.setSelectionRange(len, len);
      }
    }, 0);
  }
}

  };

  const handleChange = (e, index) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = e.target.value;
    setBlocks(updatedBlocks);
    autoResize(e.target); 
  };

  const autoResize = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  useEffect(() => {
    blockRefs.current.forEach((el) => {
      if (el) autoResize(el);
    });
  }, [blocks]);

  return (
    <div className="px-20 py-10">

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => {
            if (title.trim() === "") {
            setTitle("Untitled");
        }
    }}
    placeholder="Untitled"
    className="text-4xl font-bold mb-6 outline-none border-none w-full bg-transparent"
    />

      {blocks.map((block, index) => (
        <textarea
          key={index}
          value={block}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (blockRefs.current[index] = el)}
          rows={1}
          className="block w-full resize-none overflow-hidden py-2 outline-none border-none bg-transparent text-lg 
                     placeholder-transparent focus:placeholder-gray-400 transition duration-150"
          placeholder="Type '/' for commands"
        />
      ))}
    </div>
  );
}
