import React, { useState, useEffect } from 'react';
import { useUser } from '../Context/useContext';
import { useParams } from 'react-router-dom';

export default function Comment() {
  const { user, pages } = useUser();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const {pageId}=useParams();

  const handleToggle = () => setShowCommentBox((prev) => !prev);

  useEffect(() => {
    const currentPage = pages?.find((p) => p.pageId === pageId);
    if (currentPage && currentPage.comments) {
      setComments(currentPage.comments);
    }
  }, [pages, pageId]);

  const handleAddComment = async () => {
    const trimmed = input.trim();
    if (trimmed === '') return;

    const newComment = {
      name: user?.name || "Anonymous",
      comment: trimmed,
    };

    setIsSaving(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5005/api/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({
          comments: [...comments, newComment],
        }),
      });

      if (response.ok) {
        setComments((prev) => [...prev, newComment]);
        setInput('');
      } else {
        setError('Failed to update comments.');
      }
    } catch (err) {
      console.error("Error updating comments:", err);
      setError('Something went wrong. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="ml-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        title="Toggle comments"
      >
        💬
      </button>

      {showCommentBox && (
        <div className="absolute top-10 right-0 w-72 bg-white border shadow-lg p-3 rounded z-50">
          <input
            type="text"
            placeholder="Write a comment..."
            value={input}
            maxLength={100}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border px-2 py-1 mb-2 rounded"
          />
          <button
            onClick={handleAddComment}
            disabled={isSaving}
            className={`w-full px-3 py-1 rounded text-white ${
              isSaving ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSaving ? 'Saving...' : 'Done'}
          </button>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <div className="mt-3 max-h-40 overflow-y-auto space-y-2">
            {comments.length === 0 && (
              <p className="text-sm text-gray-400 text-center">No comments yet</p>
            )}
            {comments.map((comment, idx) => (
              <div key={idx} className="text-sm text-gray-800 border-t pt-1">
                <p className="break-words">{comment.comment}</p>
                <p className="text-xs text-gray-400">
                  — {comment.name || 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
