// proses import dependency ke dalam index.js
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Inisialisasi Express
const app = express();
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const upload = multer();

// Inisialisasi Middleware

app.use(cors());
// app.use(multer());
app.use(express.json());

// Inisialisasi Endpoint
// [HTTP method : GET, POST , PUT , PATCH , DELETE]
// .get()    --> Utamanya mengani data / Search
// .post()   --> Utamanya menaruh (post) data baru ke dalam server
// .put()    --> utamanya menimpa data yang sudah ada di dalam server
// .patch()  --> utamanya "menambal" data yang sudah ada di dalam server 
// .delete() --> utamanya Menghapus data yang didalam server

app.post(
    '/chat', //http://localhost:[PORT]/chat
    async(req, res) => {
        const {body} = req;
        const {prompt} = body;
    
        // Guard Clause
        if(!prompt || typeof prompt !== 'string'){
            res.status(400).json({
                message: "Prompt harus diisi dan berupa string!",
                data: null,
                success: false
            });
            return;
        }
    
        try {
            // 3rd party API -- Google AI
            const aiResponse = await ai.models.generateContent({
                model : 'gemini-2.5-flash',
                contents: [
                    {
                        parts: [
                            {text: prompt}
                        ]
                    }
                ]
            });

            res.status(200).json({
                success: true,
                data: aiResponse.text,
                message: "Berhasil ditanggapi oleh google Gemini Flash!"
            })
        } catch (e) {
            console.log(e);
            res.status(500).json({
                success: false,
                data: null,
                message: e.message || "ada masalah di server!"
            })
        }
    }
);

app.listen(3000, () => {
    console.log("aishiteru!");
})


// const GEMINI_MODEL = "gemini";


// const PORT = proccess.env.PORT || 3000;
// app.listen(PORT, () =>console.log(`Server ready on http://localhost:${PORT}`));