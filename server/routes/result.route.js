import express from "express";
import {result} from "../controllers/result.controller.js";

const router = express.Router();

router.get('/file.docx',result);

export default router;