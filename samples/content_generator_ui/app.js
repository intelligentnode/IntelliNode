const { Gen } = require("intellinode");
const express = require('express');

const intelliCode = {
  async generateText(prompt) {
    const apiKey = "<openai-key>";
    return await Gen.get_marketing_desc(prompt, apiKey);
  },

  async generateImage(prompt) {
    const openaiKey = "<openai-key>";
    const stabilityKey = "<stability.ai-key>";
    return await Gen.generate_image_from_desc(prompt, openaiKey, stabilityKey);
  },

  async generateAudio(text, base64 = true) {
    const apiKey = "<google-cloud-key>";
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
  const { product, type } = req.body;

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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
