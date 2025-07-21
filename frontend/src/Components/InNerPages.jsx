import { useNavigate } from "react-router-dom";
import { CreatePage } from "./CreatePage";
import { FaRegFileAlt } from "react-icons/fa";
import { useState } from "react";
export function InnerPages({ parentId = 'root', gPages }) {
  const children = gPages[parentId] || [];
  const navigate = useNavigate();

  return (
    <div className="ml-2 mb-1">
    {children.map((page) => (
    <div key={page.pageId}>
      {!page.isTrashed && (
        <div className="flex items-center justify-between text-sm py-1">
          <div 
            onClick={() => navigate(`/page/${page.pageId}`)}
            title={page.title}
            className="flex items-center gap-2 text-md cursor-pointer hover:underline truncate"
          >
            <FaRegFileAlt className="relative"/>
            <span>{page.title }</span>
          </div>
          <CreatePage pageId={page.pageId} button="true" />
        </div>
      )}
      <InnerPages parentId={page.pageId} gPages={gPages} />
    </div>
  ))}
</div>

  );
}
