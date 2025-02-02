import express from "express";
import {result,GenerateResults} from "../controllers/result.controller.js";
import {verifyToken} from "../utils/verifyUser.js"

const router = express.Router();

router.get('/file.docx',verifyToken,result);
router.post('/generateResult',verifyToken,GenerateResults)

export default router;