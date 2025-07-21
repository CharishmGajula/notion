import React, { useState } from 'react';
import { SlOptionsVertical } from "react-icons/sl";
import { useUser } from '../Context/useContext';
import { useNavigate } from 'react-router-dom';

export function CreatePage({ pageId, button, main }) {
  const { pages, setPages } = useUser();
  const navigate = useNavigate();
  const [showDeleteBox, setShowDeleteBox] = useState(false);

  async function handleDelete() {
    try {
      const res = await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      if (res.ok) {
        setPages(pages.filter((page) => page.pageId !== pageId));
      } else {
        console.error("Failed to delete page");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

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

  const isCustom = !!button;

  return (
    <div className="flex items-center gap-2 relative">
      {!main && (
        <>
          <button
            onClick={() => setShowDeleteBox((prev) => !prev)}
            className="text-white hover:text-gray-300"
          >
            <SlOptionsVertical />
          </button>

          {showDeleteBox && (
            <div className="absolute top-6 right-6 bg-white text-black shadow-md rounded-md px-4 py-2 z-20">
              <button
                onClick={handleDelete}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      {main ? (
        <button
          onClick={HandleCreatePage}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add New
        </button>
      ) : (
        <button
          onClick={HandleCreatePage}
          className={`text-sm font-medium ${
            isCustom
              ? "text-white hover:text-gray-300"
              : "text-blue-500 hover:underline"
          }`}
        >
          &#10133;
        </button>
      )}
    </div>
  );
}
