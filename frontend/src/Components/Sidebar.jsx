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


    
  async function HandleCreatePage() {
    try {
      const requestBody = { title: "Untitled" };
      if (pageId) requestBody.parentPageId = pageId;

      const res = await fetch("http://localhost:5005/api/pages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok) {
        setPages([data.page, ...pages]);
        navigate(`/page/${data.page.pageId}`);
      } else {
        console.error("Failed to create page:", data);
      }
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className=" bg-black text-white flex flex-col justify-between p-1 font-mono">
      <div>
        <div className="flex items-center justify-between mb-6 bg-blue-50 text-black">
          <h2 className="text-lg font-semibold font-sans">{user?.name || 'Guest'}</h2>
          <div className="relative">
            <img
              src='https://i.pinimg.com/236x/9e/fb/c0/9efbc0f6e77c62aa1ca64e02b05efcfe.jpg'
              alt='pro'
              onMouseDown={() => setShowDropdown(!showDropdown)}
              className="w-8 h-8 rounded-full"
              
            />
            {showDropdown && (
              <div className="absolute  right-0 left-8   mt-2 w-32  text-white bg-black shadow-lg rounded">
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
        <Search/>

        <InnerPages parentId="root" gPages={gPages} />

        <div className="mt-4">
          <CreatePage main="true"/>
        </div>
      </div>
    </div>
  );
}
