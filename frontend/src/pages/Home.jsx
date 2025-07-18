import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
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
        setFirstPageId(data.pages[0].pageId); // pick first page
      }
    }

    fetchFirstPage();
  }, []);

  return (
    <>
      <div>Home</div>
      {firstPageId && (
        <Link to={`/page/${firstPageId}`}>
          <button>Get started</button>
        </Link>
      )}
    </>
  );
}
