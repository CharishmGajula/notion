import React from 'react';
import { Link } from 'react-router-dom';

export default function Forbiden() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">SORRY TO SAY YOU ARE FORBIDDEN!!</h1>
      <h2 className="text-2xl text-gray-700 mb-6">SIGN IN AND TRY AGAIN</h2>
      <Link to="/login">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          SIGN IN!
        </button>
      </Link>
    </div>
  );
}
