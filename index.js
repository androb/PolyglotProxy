const express = require('express');
const cors = require('cors');  // Import the cors package
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3002;
require('dotenv').config();
const openaiApiKey = process.env.OPENAI_API_KEY;

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// Use the cors middleware to allow cross-domain requests
app.use(cors(
  {
    origin: 'http://localhost:3002, https://polyglotproxy.andrewroberts24.repl.co, https://polyglotproxy.replit.app/',
  }
));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


// an endpoint to generate an image given a prompt passed to it. It should use the Dalle-2 API
app.get('/api/image', async (req, res) => {
  const { prompt } = req.query;
  const imageURL = await generateImage(prompt);
  //res.send(`<figure class="image"><img src="${imageURL}" alt="${prompt}" width="100%" style="height:400px;width:100%;object-fit: cover;" align="center" /><figcaption>"${prompt}" by DALL·E 2</figcaption></figure>`);
  res.send(imageURL);
});

async function generateImage(promptText, size) {
  const response = await openai.createImage({
    prompt: promptText,
    n: 1,
    size: "1024x1024",
  });
  const imageURL = response.data.data[0].url;
  return imageURL;
}

// this allows a direct call of the OpenAI API to generate text that will be inserted into the editor
app.post('/chatgpt', async (req, res) => {

  const { message } = req.body;
  const prompt = `${message}`;
  console.log('Prompt: ' + prompt);
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    res.send({ response: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error.response.data); // Log the error details
    res.status(500).send({ error: error.message });
  }
});

// this allows a direct call of the OpenAI API to generate text that will be inserted into the editor
app.post('/generate-content', async (req, res) => {

  const { topic, tokens } = req.body;
  const prompt = `${topic}`;
  console.log('Prompt: ' + prompt);
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: tokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    res.send({ content: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error.response.data); // Log the error details
    res.status(500).send({ error: error.message });
  }
});



app.post('/generate-poem', async (req, res) => {
  const { topic, style, wordCount } = req.body;

  const prompt = `Write a poem about ${topic} in the style of ${style} with approximately ${wordCount} words. Include a title. Return the content as styled HTML.`;
  console.log(prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    res.send({ poem: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error.response.data); // Log the error details
    res.status(500).send({ error: error.message });
  }
});

// Define a function that takes some text as input and returns a summary of that text
async function summarizeText(text) {
  // Define the prompt to provide the GPT-3 API
  const prompt = `Summarize the following text in 50 words and start the summary with "Summary:": ${text}`;

  // Call the GPT-3 API to generate a summary
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 200,
  });
  // Extract the summary from the API response and return it
  const summary = response.data.choices[0].text.trim();
  return summary;
}

app.post('/generate-summary', async (req, res) => {
  const { content } = req.body;
  console.log("Generate Summary ");
  const summary = await summarizeText(content);
  res.send({ summary: summary });
});


/*
app.post('/generate-summary', async (req, res) => {

  const { content } = req.body;

  // Slice the content string to only take the first 3000 characters
  const slicedContent = content.slice(0, 3000);

  const prompt = `Summarize this text:  ${slicedContent}`;
  //console.log(prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: prompt,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );
    console.log(response.data.choices[0].text.trim());
    res.send({ summary: response.data.choices[0].text.trim() });
  } catch (error) {
    console.error('Error:', error.response.data); // Log the error details
    res.status(500).send({ error: error.message });
  }
});
*/


app.get('/', (req, res) => {
  res.render('index', { apiKey: process.env.TINYMCE_API_KEY });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
