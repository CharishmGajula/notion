import { useState } from 'react';
import { useEffect } from "react";
import { CiSquareChevDown } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useUser } from '../Context/useContext';

export default function ShareBar() {
  const {showShare, setShowShare} = useUser();
  const [email, setEmail] = useState('');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [globalAccess, setGlobalAccess] = useState('');
  const { pageId } = useParams();
  
  
useEffect(() => {

    const fetchSharingData = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !pageId) return;

    try {
      const res = await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      

      if (!res.ok) throw new Error("Failed to fetch page");
      const data = await res.json();
      const page = data.page;
      const sharedWithData = page.sharedWith ?? {};
      const people = Object.entries(sharedWithData).map(([email, role]) => ({
            email,
            role,
      }));

      setSharedUsers(people);
      setGlobalAccess(page.isPublic ? "everyone" : "my-people");
    } catch (err) {
      console.error("Failed to fetch sharing data", err);
    }
  };

  fetchSharingData();
}, [showShare,pageId]);

  
  const handleAddUser = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    const alreadyExists = sharedUsers.some(user => user.email === trimmedEmail);
    if (alreadyExists) {
      alert("Email already added!");
      return;
    }

    setSharedUsers([...sharedUsers, { email: trimmedEmail, role: 'Viewer' }]);
    setEmail('');
  };

  const handleChangeRole = (index, role) => {
    const updated = [...sharedUsers];
    updated[index].role = role;
    setSharedUsers(updated);
  };

  const handleRemoveUser = (index) => {
    const updated = [...sharedUsers];
    updated.splice(index, 1);
    setSharedUsers(updated);
  };

  const handleCopyUrl = () => {
    const url = `http://localhost:5173/page/${pageId}`;
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link"));
  };

  const handleShare = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token || !pageId) return;

    try {
      const body = globalAccess === "everyone"
        ? { isPublic: true }
        : {
            isPublic: false,
            sharedWith: sharedUsers.reduce((acc, { email, role }) => {
              acc[email] = role;
              return acc;
            }, {}),
          };

          console.log(body);

      const res = await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      console.log(res);

      if (!res.ok) throw new Error("Failed to update");
      alert("Sharing settings updated!");
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => (setShowShare(prev => !prev) )}
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
            <div key={index} className="flex gap-2 justify-between items-center">
              <span className="truncate w-1/2">{user.email}</span>
              <select
                value={user.role}
                onChange={(e) => handleChangeRole(index, e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <button
                onClick={() => handleRemoveUser(index)}
                className="text-red-500 hover:text-red-700"
              >
                <MdDelete size={20} />
              </button>
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
              <option value="my-people">Share with specific people</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleCopyUrl}
              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              COPY SHARE LINK
            </button>

            <button
              onClick={handleShare}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              SAVE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
