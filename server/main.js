import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './routes/auth.route.js';
import { json } from 'express';
import cors from 'cors';

const app=express();
app.use(cors());
app.use(json());
dotenv.config();


mongoose.connect(process.env.MONGO_STR).then(()=>{
    console.log('DB Connected');
}
).catch((err)=>{
    console.log(err);
});

app.use('/api/auth',auth);

app.listen(3010,()=>{
    console.log('Server is running on port 3000');
});