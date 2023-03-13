import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect";
import postRoutes from "./routes/postRoutes";
import dalleRoutes from "./routes/dalleRoutes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello from SERVER");
})

let mongoDB_url: string;
if (process.env.MONGODB_URL) {
    mongoDB_url = process.env.MONGODB_URL;
} else {
    throw new Error("MONGODB_URL environment variable is not set");
}

const startServer = () => {
    try {
        connectDB(mongoDB_url).then(() => {
            app.listen(8080, () => console.log("Server running on http://127.0.0.1:8080"));
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();