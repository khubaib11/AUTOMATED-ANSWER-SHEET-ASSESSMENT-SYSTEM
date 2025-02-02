import  {paperAdd}  from "../controllers/paper.controller.js";
import {verifyToken} from "../utils/verifyUser.js";
import express from 'express';


const router = express.Router();

router.post('/add',verifyToken,paperAdd);

export default router;