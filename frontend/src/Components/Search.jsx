import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searching from "../assets/search.png";
import { useUser } from '../Context/useContext';

export default function Search() {
  const [search, setSearch] = useState('');
  const [filteredPages, setFilteredPages] = useState([]);
  const navigate = useNavigate();
  const { pages } = useUser();

  function handleSearch() {
    console.log(pages);
    const trimmedSearch = search.trim().toLowerCase();
    if (!trimmedSearch) {
      setFilteredPages([]);
      return;
    }

    const matches = pages.filter(page =>
    !page.isTrashed &&
    page.title.toLowerCase().includes(trimmedSearch)
  );



    setFilteredPages(matches);
  }

  function handlePageClick(pageId) {
    navigate(`/page/${pageId}`);
    setFilteredPages([]); 
    setSearch('');        
  }

  return (
    <div className="w-full mt-4 px-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm bg-white text-black"
        />
        <img
          src={searching}
          alt="search"
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer opacity-70 hover:opacity-100"
        />
      </div>

      {search && filteredPages.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100">
          {filteredPages.map((page, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 text-gray-800 text-sm cursor-pointer"
              onClick={() => handlePageClick(page.pageId)}
            >
              {page.title}
            </div>
          ))}
        </div>
      )}

      {search && filteredPages.length === 0 && (
        <div className="mt-2 text-center text-sm text-gray-500">
          No matching pages found.
        </div>
      )}
    </div>
  );
}
