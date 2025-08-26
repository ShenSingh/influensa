import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import rootRouter from "./router";
import {errorHandler} from "./middlwares /errorHandler";
import {connectDB} from "./db/mongoDb";

dotenv.config()
const app = express()

const corsOptions = {
    origin: process.env.CLIENT_ORGIN,
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.set('trust proxy', true);

const PORT = process.env.PORT;

app.use("/api",rootRouter)

app.use(errorHandler)

connectDB().then(r => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})

