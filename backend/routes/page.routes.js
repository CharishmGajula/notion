import express from "express";
import { createPage } from "../controllers/page.controller.js";
import { getPage } from "../controllers/page.controller.js";
import { updatePage } from "../controllers/page.controller.js";
import { deletePage } from "../controllers/page.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkPageAccess } from "../middlewares/authorizeMiddleware.js";
const pageRouter=express.Router();

pageRouter.post("/",authMiddleware,createPage);                    
pageRouter.get("/:pageId",authMiddleware,checkPageAccess(["admin","editor","viewer"]), getPage);                 
pageRouter.put("/:pageId",authMiddleware,checkPageAccess(["admin","editor"]), updatePage);               
pageRouter.delete("/:pageId",authMiddleware,checkPageAccess(["admin"]), deletePage);
             

export default pageRouter;