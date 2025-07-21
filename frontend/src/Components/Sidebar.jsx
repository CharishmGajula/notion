import React, { useState } from 'react';
import { useUser } from '../Context/useContext';
import { CreatePage } from './CreatePage';
import { useNavigate } from 'react-router-dom';
import { InnerPages } from './InNerPages';
import Search from './Search';

export default function Sidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, pages, logout } = useUser();
  const navigate = useNavigate();

  const gPages = pages.reduce((acc, page) => {
    const parentId = page.parentPageId || 'root';
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(page);
    return acc;
  }, {});

  return (
    <div className="bg-zinc-900 text-white flex flex-col justify-between h-full font-mono overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-base font-semibold font-sans truncate max-w-[140px]">
          {user?.name || 'Guest'}
        </h2>
        <div className="relative">
          <img
            src="https://i.pinimg.com/236x/9e/fb/c0/9efbc0f6e77c62aa1ca64e02b05efcfe.jpg"
            alt="pro"
            onMouseDown={() => setShowDropdown(!showDropdown)}
            className="w-8 h-8 rounded-full cursor-pointer border border-zinc-700 hover:ring-2 hover:ring-zinc-500"
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-zinc-800 text-white shadow-lg rounded z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <Search />
        <InnerPages parentId="root" gPages={gPages} />
        <div className="pt-2 border-t border-zinc-800">
          <CreatePage main="true" />
        </div>
      </div>
    </div>
  );
}
