import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import MainPage from './MainPage.jsx';

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(240); // Start with cleaner default
  const resizerRef = useRef(null);
  const isDragging = useRef(false);

  const startResizing = () => {
    isDragging.current = true;
  };

  const stopResizing = () => {
    isDragging.current = false;
  };

  const resize = (e) => {
    if (isDragging.current) {
      const newWidth = e.clientX;
      if (newWidth > 180 && newWidth < 360) {
        setSidebarWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-900 text-white overflow-hidden">
      <aside
        className="relative h-full border-r border-zinc-700 transition-all duration-300"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar />

        <div
          ref={resizerRef}
          onMouseDown={startResizing}
          className="absolute top-0 right-0 h-full w-[4px] cursor-col-resize bg-zinc-600 hover:bg-zinc-400 transition-colors"
        />
      </aside>

      <main className="flex-1 bg-white text-black overflow-y-auto px-6 py-8">
        <MainPage defaultTitle="Getting Started" />
      </main>
    </div>
  );
}
