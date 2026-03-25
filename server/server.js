import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import { generate } from "./chatbot.js";
import cors from "cors"


const app = express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Hello world !")
})

app.post ("/chat",async (req,res)=>{
    const {message } =  req.body;
    const result = await generate(message)
    res.json({message:result})
})
app.listen(process.env.PORT || 3001,()=>{
    console.log(`Server is listening on ${process.env.PORT}`);
    
})