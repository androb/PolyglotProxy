const express = require("express");
const cors = require("cors"); // Import the cors package
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const app = express();
const port = 3002;
require("dotenv").config();
const openaiApiKey = process.env.OPENAI_API_KEY;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Use the cors middleware to allow cross-domain requests
app.use(
  cors({
    origin:
      "http://localhost:3002, https://polyglotproxy.andrewroberts24.repl.co, https://polyglotproxy.replit.app/",
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// an endpoint to generate an image given a prompt passed to it. It should use the Dalle-2 API
app.get("/api/image", async (req, res) => {
  const { prompt } = req.query;
  const imageURL = await generateImage(prompt);
  res.send(imageURL);
});

async function generateImage(promptText, size) {
  const response = await openai.createImage({
    prompt: promptText,
    n: 1,
    size: "512x512",
  });
  const imageURL = response.data.data[0].url;
  return imageURL;
}

// this allows a direct call of the OpenAI API to generate text that will be inserted into the editor
app.post('/chatgpt', async (req, res) => {
  const { message } = req.body;
  const prompt = `${message}`;
  console.log(`Prompt: ${prompt}`);
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that helps write content. Return the answers to questions in HTML format with the appropriate heading, paragraph, and line break tags when needed.' },
        { role: 'user', content: `${prompt}` }
      ],
    });
    console.log(completion.data.choices[0].message);
    res.send({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message); // Log the error details
    res.status(500).send({ error: error.message });
  }
});


// this allows a direct call of the OpenAI API to generate text that will be inserted into the editor
app.post("/generate-content", async (req, res) => {
  const { topic, tokens } = req.body;
  const prompt = `${topic}`;
  console.log("Prompt: " + prompt);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful AI writing assistant. Return the answers to questions in HTML format with the appropriate heading, paragraph, and line break (<br>) tags when needed. Only return the HTML between the <body> tags.' },
        { role: 'user', content: `${prompt}` }
      ],
    });
    console.log(completion.data.choices[0].message);
    res.send({ content: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message); // Log the error details
    res.status(500).send({ error: error.message });
  }

});

app.post("/generate-poem", async (req, res) => {
  const { topic, style, wordCount } = req.body;

  const prompt = `Write a poem about ${topic} in the style of ${style} with approximately ${wordCount} words. Include a title as a <h2> element. Return the content as styled HTML with line breaks as <br> tags.`;
  console.log(prompt);
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a poet. Return the answers to questions in HTML format with the appropriate heading, paragraph, and line break (<br>) tags when needed.' },
        { role: 'user', content: `${prompt}` }
      ],
    });
    console.log(completion.data.choices[0].message);
    res.send({ poem: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error.message); // Log the error details
    res.status(500).send({ error: error.message });
  }

});

// Define a function that takes some text as input and returns a summary of that text
async function summarizeText(text) {
  // Define the prompt to provide the GPT-3 API
  const prompt = `Summarize the following text in 50 words and start the summary with "Summary:": ${text}`;

  // Call the GPT-3 API to generate a summary
  const response = await openai.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: prompt,
    max_tokens: 200,
  });
  // Extract the summary from the API response and return it
  const summary = response.data.choices[0].text.trim();
  return summary;
}

app.post("/generate-summary", async (req, res) => {
  const { content } = req.body;
  console.log("Generate Summary ");
  const summary = await summarizeText(content);
  res.send({ summary: summary });
});


app.get("/", (req, res) => {
  res.render("index", { apiKey: process.env.TINYMCE_API_KEY });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
