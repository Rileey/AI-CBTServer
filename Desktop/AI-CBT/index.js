import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import express from "express";
// import mongoose from 'mongoose';
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    parameterLimit: 1000000,
    extended: false,
  })
);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", async (req, res) => {
  const grade = "middle school";
  const subject = "english";
  const prompt = `create a set of 15 ${grade} ${subject} multiple choice interview questions with their respective options and highlight the correct answers, present them in a Json file format, The Question number, Questions, an options object properly formatted in a pair of keys and value, and the correct answer so that it can be properly placed in a collection on Firebase.`;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    });
    const result = response?.data?.choices[0].text;
    res.send(JSON.parse(result));
    req.end()
    console.log(JSON.parse(result));
  } catch (err) {
    res.status(500).json(err);
  }
});

const port = 8800;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
