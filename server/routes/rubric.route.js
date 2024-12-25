import {rubricAdd} from "../controllers/rubric.controller.js";
import {verifyToken} from "../utils/verifyUser.js";

import express from "express";

const router = express.Router();


router.post('/addrubric',verifyToken,rubricAdd);

export default router;
