import express from "express";
import dotenv from "dotenv";
import {Configuration, OpenAIApi} from "openai";

dotenv.config();

const router = express.Router();
const config = new Configuration({
    apiKey: process.env.OPENAI_KEY
});
const openAI: OpenAIApi = new OpenAIApi(config);

// пока для теста
router.route('/').get((req, res) => {
    res.send("Hello from DALL-E");
});

// генерируем картинку
router.route('/').post(async(req, res) => {
    try {
        const { prompt }: { prompt: string } = req.body;
        const aiResponse = await openAI.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
        });
        const image = aiResponse.data.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

export default router;