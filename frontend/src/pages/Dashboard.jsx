import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import BlockEditor3 from '../Components/Block1.jsx';
import MainPage from './MainPage.jsx';

export default function Dashboard() {
  const [sidebarWidth, setSidebarWidth] = useState(200);
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
      if (newWidth > 150 && newWidth < 330) {
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
    <div className="flex h-screen w-full bg-black text-white">
      <aside
        className="bg-black h-full relative border-r border-gray-800"
        style={{ width: `${sidebarWidth}px` }}
      >
        <Sidebar />

        <div
          ref={resizerRef}
          onMouseDown={startResizing}
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-700 hover:bg-white transition-all"
        />
      </aside>

      <main className="flex-1 bg-white text-black overflow-y-auto  py-12 transition-all duration-300">
        <MainPage defaultTitle="Getting Started" />
      </main>
    </div>
  );
}
