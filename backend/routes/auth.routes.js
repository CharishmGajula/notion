import express from "express";
import { AuthenticateAndSendData, loginUser } from "../controllers/auth.controller.js";
import {registerUser} from "../controllers/auth.controller.js"
const router=express.Router();

router.post('/login',loginUser);
router.post('/register',registerUser)
router.get("/me",AuthenticateAndSendData);
export default router;