const express = require("express");
const { AllPages, createPage } = require("../controllers/page.controller");
const { getPage } = require("../controllers/page.controller");
const { updatePage } = require("../controllers/page.controller");
const { deletePage } = require("../controllers/page.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkPageAccess } = require("../middlewares/authorizeMiddleware");
const { getPublicPage } = require("../controllers/auth.controller");
const { publicAccessMiddleware } = require("../middlewares/authMiddleware");

const pageRouter = express.Router();

pageRouter.post("/", authMiddleware, createPage);                    
pageRouter.get("/:pageId", publicAccessMiddleware, authMiddleware, checkPageAccess(["Editor","Viewer"]), getPage);                 
pageRouter.put("/:pageId", authMiddleware, checkPageAccess(["Editor"]), updatePage);               
pageRouter.delete("/:pageId", authMiddleware, checkPageAccess(), deletePage);
pageRouter.get("/", authMiddleware, AllPages);

module.exports = pageRouter;
