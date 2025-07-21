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
/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               parentPageId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Page created
 */


/**
 * @swagger
 * /api/pages/{pageId}:
 *   get:
 *     summary: Get a page by ID along with its child pages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the page to retrieve
 *     responses:
 *       200:
 *         description: Page data with children
 *       404:
 *         description: Page not found
 */


/**
 * @swagger
 * /api/pages/{pageId}:
 *   put:
 *     summary: Update a page (title, content, visibility, etc.)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *               isPublic:
 *                 type: boolean
 *               sharedWith:
 *                 type: object
 *               comments:
 *                 type: array
 *               isTrashed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Page updated successfully
 *       400:
 *         description: Nothing to update
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/pages/{pageId}:
 *   delete:
 *     summary: Move a page to trash
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the page to delete
 *     responses:
 *       200:
 *         description: Page moved to trash
 *       404:
 *         description: Page not found
 */


/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Get all pages for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pages
 */



pageRouter.post("/", authMiddleware, createPage);                    
pageRouter.get("/:pageId", publicAccessMiddleware, authMiddleware, checkPageAccess(["Editor","Viewer"]), getPage);                 
pageRouter.put("/:pageId", authMiddleware, checkPageAccess(["Editor"]), updatePage);               
pageRouter.delete("/:pageId", authMiddleware, checkPageAccess(), deletePage);
pageRouter.get("/", authMiddleware, AllPages);

module.exports = pageRouter;
