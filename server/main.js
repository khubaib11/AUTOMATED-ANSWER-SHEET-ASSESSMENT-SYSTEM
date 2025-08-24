import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import auth from './routes/auth.route.js';
import cors from 'cors';
import userRoute from './routes/user.route.js';
import resultRoute from './routes/result.route.js';
import cookieParser from 'cookie-parser';
import rubricRoute from './routes/rubric.route.js';
import paperRoute from './routes/paper.route.js';
import bodyParser from 'body-parser';

const app=express();
app.use(cookieParser())
dotenv.config();


mongoose.connect(process.env.MONGO_STR).then(()=>{
    console.log('DB Connected');
}
).catch((err)=>{
    console.log(err);
});


app.use(bodyParser.json({ limit: "50mb" })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


//middleware
app.use(cors());
app.use('/api/auth',auth);
app.use('/api/user',userRoute);
app.use('/api/result',resultRoute)
app.use('/api/rubric',rubricRoute);
app.use('/api/paper',paperRoute);








app.listen(process.env.PORT || 3002,()=>{
    console.log('Server is running on port 3002');
});