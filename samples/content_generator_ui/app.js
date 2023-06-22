const { Gen } = require("intellinode");
const express = require('express');

const intelliCode = {
  async generateText(prompt) {
    // TODO: set the key value
    const apiKey = "";
    return await Gen.get_marketing_desc(prompt, apiKey);
  },

  async generateImage(prompt) {
    // TODO: set the key value
    const openaiKey = "";
    const stabilityKey = "";
    return await Gen.generate_image_from_desc(prompt, openaiKey, stabilityKey);
  },

  async generateAudio(text, base64 = true) {
    // TODO: set the key value
    const apiKey = "";
    const audioContent = await Gen.generate_speech_synthesis(text, apiKey);
    return base64 ? audioContent : Buffer.from(audioContent, "base64");
  },
};

const app = express();
app.use(express.json());
// serve static files
const path = require("path");
app.use(express.static(path.join(__dirname)));

app.post('/generate-content', async (req, res) => {
  let errroType = '';
  try {
    const { product, type } = req.body;
    errroType = type;

    if (type === 'text') {
      const textPrompt = `Write a marketing copy for ${product}`;
      const text = await intelliCode.generateText(textPrompt);
      res.send({ text: text });
    } else if (type === 'image') {
      const imageData = await intelliCode.generateImage(product);
      res.send({ imageData: imageData });
    } else if (type === 'audio') {
      const textPrompt = `Write a marketing copy for ${product}`;
      const text = await intelliCode.generateText(textPrompt);
      const audioData = await intelliCode.generateAudio(text);
      res.send({ audioData: audioData });
    } else {
      res.status(400).send({ error: 'Invalid request type' });
    }
  } catch (error) {
    console.error('Error in /generate-content:', error);
    res.status(500).send({ error: 'Internal server error', message: `An error occurred while generating ${errroType} content. Make sure the key is valid.` });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
