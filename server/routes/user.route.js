import express from "express";
import {signOut} from "../controllers/user.controller.js";
import {updatePassword,sendOTP,verifyOTP,verifyUsers} from "../controllers/user.controller.js";
import {verifyToken} from "../utils/verifyUser.js";
const router = express.Router();


router.post('/signout',signOut);
router.put('/updatepassword',updatePassword);

router.post('/sendotp',sendOTP);
router.post('/verifyotp',verifyOTP);
router.get('/verifyuser',verifyToken,verifyUsers);

export default router;