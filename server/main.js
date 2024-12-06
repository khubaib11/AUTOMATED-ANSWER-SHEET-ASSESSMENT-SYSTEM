import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './routes/auth.route.js';
import { json } from 'express';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import resultRoute from './routes/result.route.js';

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
app.use('/api/user',userRoute);
app.use('/api/result',resultRoute)







app.listen(3001,()=>{
    console.log('Server is running on port 3000');
});