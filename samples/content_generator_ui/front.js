document.getElementById('content-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const product = document.getElementById('product').value;

  // Show loading spinner
  document.getElementById('loading').classList.remove('d-none');

  async function generateText() {
    try {
      const response = await fetch('/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: product, type: 'text' }),
      });
      const { text } = await response.json();
      document.getElementById('generated-text').innerText = text;
      document.getElementById('text-title').classList.remove('d-none');
    } catch (error) {
      console.error('Error in generating text:', error);
    }
  }

  async function generateImage() {
    try {
      const response = await fetch('/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: product, type: 'image' }),
      });
      const { imageData } = await response.json();
      const imageDataUrl = `data:image/png;base64,${imageData}`;
      const imageElement = document.getElementById('generated-image');
      imageElement.src = imageDataUrl;
      imageElement.classList.remove('d-none');
      document.getElementById('image-title').classList.remove('d-none');
    } catch (error) {
      console.error('Error in generating image:', error);
    }
  }

  async function generateAudio() {
    try {
      const response = await fetch('/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: product, type: 'audio' }),
      });
      const { audioData } = await response.json();
      const audioDataUrl = `data:audio/mpeg;base64,${audioData}`;
      const audioElement = document.getElementById('generated-audio');
      audioElement.src = audioDataUrl;
      audioElement.classList.remove('d-none');
      document.getElementById('audio-title').classList.remove('d-none');
    } catch (error) {
      console.error('Error in generating audio:', error);
    }
  }

  // Call the generate functions separately without waiting for each one to finish
  Promise.all([
    generateText().catch((error) => {
      console.error('Error in generating text:', error);
    }),
    generateImage().catch((error) => {
      console.error('Error in generating image:', error);
    }),
    generateAudio().catch((error) => {
      console.error('Error in generating audio:', error);
    }),
  ]).finally(() => {
    // Hide loading spinner
    document.getElementById('loading').classList.add('d-none');
  });
});
