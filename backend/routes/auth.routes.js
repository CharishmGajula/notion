const express = require("express");
const {loginUser,registerUser,AuthenticateAndSendData,} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", AuthenticateAndSendData);

module.exports = router;
