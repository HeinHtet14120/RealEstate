import express from "express";
import cookieParser from "cookie-parser";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";


import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin:process.env.CLIENT_URL, credentials:true}));
app.use(cors());

app.use('/api/post', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/test', testRoute);
app.use('/api/user', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

app.use('/', (req, res) => {
    res.send("Server is running")
});


app.listen(8000, () => {
    console.log("sever started")
})