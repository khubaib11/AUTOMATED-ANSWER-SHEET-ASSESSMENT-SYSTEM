import express from "express";
import {signUp,signIn,googleSignIn,sendOTP,verifyOTP,updatePassword} from "../controllers/auth.controller.js";


const router = express.Router();

router.post('/signup',signUp);
router.post('/signin',signIn);
router.post('/google',googleSignIn);
router.post('/sendotp',sendOTP);
router.post('/verifyotp',verifyOTP);
router.put('/updatepassword',updatePassword);

export default router;