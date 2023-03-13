import express from "express";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const router = express.Router();

let openAIKey: string;
if (process.env.OPENAI_KEY) {
    openAIKey = process.env.OPENAI_KEY;
} else {
    throw new Error("OPENAI_KEY environment variable is not set");
}
const config = new Configuration({
    apiKey: openAIKey
});
const openAI = new OpenAIApi(config);

router.route('/').get((req, res) => {
    res.send("Hello from DALL-E");
});

router.route('/').post(async(req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await openAI.createImage({
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
        });
        const image = aiResponse.data.data[0].b64_json;
        res.status(200).json({ photo: image });
    } catch (err) {
        console.log(err);
        // res.status(500).send(err?.response.data.error.message);
    }
});

export default router;