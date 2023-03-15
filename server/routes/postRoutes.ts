import express from "express";
import dotenv from "dotenv";
import {UploadApiResponse, v2 as cloudinary } from "cloudinary";

import Post, { IPost } from "../mongodb/models/post";
import { HydratedDocument } from "mongoose";

const router = express.Router();
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// получаем все посты
router.route("/").get(async (req, res) => {
    try {
        const posts: Array<HydratedDocument<IPost>> = await Post.find({});
        res.status(200).json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err });
    }
})

// создаём пост
router.route("/").post(async (req, res) => {
    try {
        // получаем данные с фронта
        const { name, prompt, photo }: { name: string, prompt: string, photo: string } = req.body;

        // сохраняем картинку в облаке
        const photoUrl = await cloudinary.uploader.upload(photo);

        // передаём в БД URL картинки из облака и остальные данные
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (err: any) {
        res.status(501).json({ success: false, message: "error in postRoutes.ts: " + err.message });
    }
})

export default router;