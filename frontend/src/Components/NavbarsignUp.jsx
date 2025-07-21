import React from 'react';
import img from "../assets/Notion_app_logo.png";
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';

export default function NavbarsignUp({ button,Home }) {


  const [firstPageId, setFirstPageId] = useState(null);
  
  
    useEffect(() => {
      async function fetchFirstPage() {
        const res = await fetch("http://localhost:5005/api/pages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        const data = await res.json();
        if (data.pages?.length > 0) {
          setFirstPageId(data.pages[0].pageId); 
        }
      }
      fetchFirstPage();
    }, []);


  let path = '/';
  if (button === "Log In") {
    path = "/login";
  }
  else if(button==="Get Started")
  {
    path=`/page/${firstPageId}`
  }

 
  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-6 py-4">

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link to="/"><img src={img} alt="Logo.png" className="h-10 w-10 object-contain" /></Link>
          <Link to="/"><h2 className="text-xl font-bold text-gray-800">Notion</h2></Link>
        </div>

            <Link to={path}>
                  <button className="bg-black text-white px-5 py-2 rounded-xl hover:bg-gray-900 transform hover:scale-105 transition duration-300 ease-in-out">
                  {button}
                  </button>
            </Link>
          
      </div>
    </nav>
  );
}
