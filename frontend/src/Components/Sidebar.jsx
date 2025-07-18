import React, { useState } from 'react';
import { useUser } from '../Context/useContext';
import { CreatePage } from './CreatePage';
import { useNavigate } from 'react-router-dom';
import { InnerPages } from './InNerPages';
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
    <div className=" bg-black text-white flex flex-col justify-between p-1">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{user?.name || 'Guest'}</h2>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 bg-gray-400 rounded-full"
              title="Profile"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white text-black shadow-lg rounded">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <InnerPages parentId="root" gPages={gPages} />

        <div className="mt-4">
          <CreatePage />
        </div>
      </div>
    </div>
  );
}
