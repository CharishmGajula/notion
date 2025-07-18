import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js"
import pageRouter from "./routes/page.routes.js";
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());

app.use("/api/auth",authRouter);
app.use("/api/pages",pageRouter);
const port=process.env.PORT|| 5005;

app.listen(port,()=>
{
    console.log(`Hurray your server running!! on the port ${port}`);
});