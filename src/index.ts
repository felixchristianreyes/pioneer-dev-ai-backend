import express from "express";
import OpenAI from "openai";

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.get("/", async (req, res) => {
 
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
