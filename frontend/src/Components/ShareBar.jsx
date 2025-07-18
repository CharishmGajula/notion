import React, { useState } from 'react';
import { CiSquareChevDown } from "react-icons/ci";

export default function ShareBar() {
  const [showShare, setShowShare] = useState(false);
  const [email, setEmail] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [globalAccess, setGlobalAccess] = useState('');

  const handleAddUser = () => {
    if (!email.trim()) return;

    setSharedUsers([...sharedUsers, { email, role: 'Viewer' }]);
    setEmail('');
  };

  const handleChangeRole = (index, role) => {
    const updated = [...sharedUsers];
    updated[index].role = role;
    setSharedUsers(updated);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowShare((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        SHARE <CiSquareChevDown size={20} />
      </button>

      {showShare && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded p-4 z-20 space-y-4 text-sm">
          <h2 className="font-semibold text-base">Want to share your doc?</h2>
          <div>
            <p className="mb-1 font-medium">People</p>
            <div className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddUser}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Share
              </button>
            </div>
          </div>

          {sharedUsers.map((user, index) => (
            <div key={index}  className="flex gap-2 justify-between items-center">
              <span >{user.email}</span>
              <select
                value={user.role}
                onChange={(e) => handleChangeRole(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          ))}

          <div>
            <p className="mt-4 font-medium">Share settings:</p>
            <select
              value={globalAccess}
              onChange={(e) => setGlobalAccess(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
            >
              <option value="everyone">Share with everyone</option>
              <option value="my-people">Share with my people</option>
            </select>
          </div>
          <div className='"bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'>
            COPY LINK
          </div>
        </div>
      )}
    </div>
  );
}
