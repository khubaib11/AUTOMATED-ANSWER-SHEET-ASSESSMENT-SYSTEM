import express from "express";
import {result,GenerateResults} from "../controllers/result.controller.js";
import {verifyToken} from "../utils/verifyUser.js"

const router = express.Router();

router.post("/file", verifyToken, result); // Now accepting body instead of query params
router.post('/generateResult', verifyToken, GenerateResults);

export default router;