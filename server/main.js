import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './routes/auth.route.js';
import { json } from 'express';
import cors from 'cors';

const app=express();
dotenv.config();


mongoose.connect(process.env.MONGO_STR).then(()=>{
    console.log('DB Connected');
}
).catch((err)=>{
    console.log(err);
});




//middleware
app.use(cors());
app.use(json());
app.use('/api/auth',auth);








app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});