import React, { useState } from 'react';

export default function Online({ online }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block text-left mr-2">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-full shadow transition duration-150"
      >
        <span className="font-medium">Live</span>
        <span className="bg-white text-green-600 font-semibold rounded-full px-2 text-xs">
          {online?.length || 0}
        </span>
      </button>

      {show && (
        <div className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-2 max-h-48 overflow-y-auto">
            {online && online.length > 0 ? (
              online.map((live, index) => (
                <div
                  key={index}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {live?.user?.name || `User ${index + 1}`}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400">No one online</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
