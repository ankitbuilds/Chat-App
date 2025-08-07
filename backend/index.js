import express from 'express'
import dotenv from 'dotenv'
import dbconnect from './DB/dbconnect.js';
import authRouter from './route/authUser.js';
import messageRouter from './route/messageroute.js';
import cookieParser from 'cookie-parser';
import userRouter from './route/userRoute.js'

const app = express();
dotenv.config();

dbconnect();
app.get('/', (req, res) => {
    res.send('hello');
})

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter)
app.use('/api/message', messageRouter)
app.use('/api/user', userRouter)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`server is running at ${PORT}`);
})