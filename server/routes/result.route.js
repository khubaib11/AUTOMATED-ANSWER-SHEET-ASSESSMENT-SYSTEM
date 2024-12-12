import express from "express";
import {result} from "../controllers/result.controller.js";
import {verifyToken} from "../utils/verifyUser.js"

const router = express.Router();

router.get('/file.docx',verifyToken,result);

export default router;