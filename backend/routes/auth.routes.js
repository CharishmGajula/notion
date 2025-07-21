const express = require("express");
const {loginUser,registerUser,AuthenticateAndSendData,} = require("../controllers/auth.controller");



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokenId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token verified
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user info
 */

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", AuthenticateAndSendData);

module.exports = router;
