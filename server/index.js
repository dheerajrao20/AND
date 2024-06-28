import express from "express";
import cors from "cors"
import { adminRouter } from "./Routes/AdminRoute.js";
import dotenv from "dotenv";

const app = express();
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json());
app.use('/auth', adminRouter);

app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`server is running on port ${process.env.SERVER_PORT}`)
})