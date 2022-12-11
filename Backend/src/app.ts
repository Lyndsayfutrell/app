import express from "express";
import * as dotenv from 'dotenv'
import { authRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser";

dotenv.config()

const port = process.env.PORT;
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/', authRouter)

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});