// Live checks for Gemini on the Developer API and Vertex AI. Each part runs only when its key is set:
//   VERTEX_API_KEY (Agent Platform key, express mode), VERTEX_PROJECT_ID (project mode: Lyria 2, Live API),
//   GEMINI_API_KEY (AI Studio key), INTELLI_RUN_VEO=1 (slow, billed Veo video).
// The Live API needs a WebSocket: Node 22+, or `node --experimental-websocket` on Node 20.
require('dotenv').config();
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { GoogleAIWrapper, Chatbot, Gen, Assistant, MemoryVectorStore, FileChatHistory, RemoteImageModel, ImageModelInput } = require('../../index');

const { VERTEX_API_KEY, VERTEX_PROJECT_ID, GEMINI_API_KEY } = process.env;
const LOW_THINKING = { thinkingConfig: { thinkingLevel: 'low' } };
const results = [];

async function run(name, needs, fn) {
  if (needs.some((value) => !value)) {
    console.log(`- ${name}: skipped (key not set)`);
    return;
  }
  const started = Date.now();
  try {
    const detail = await fn();
    console.log(`✓ ${name} (${Date.now() - started} ms)${detail ? `: ${detail}` : ''}`);
    results.push(true);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message.slice(0, 400)}`);
    results.push(false);
  }
}

(async () => {
  const vertex = VERTEX_API_KEY && new GoogleAIWrapper(VERTEX_API_KEY, { vertex: true });
  const project = VERTEX_API_KEY && VERTEX_PROJECT_ID && new GoogleAIWrapper(VERTEX_API_KEY, { vertex: true, projectId: VERTEX_PROJECT_ID });
  const dev = GEMINI_API_KEY && new GoogleAIWrapper(GEMINI_API_KEY);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'intellinode-google-'));

  await run('vertex text, stream and chat history', [VERTEX_API_KEY], async () => {
    const text = await vertex.generateText('Reply with the word ready.', { generationConfig: LOW_THINKING });
    assert.match(text, /ready/i);
    let streamed = '';
    for await (const chunk of vertex.streamText('Count from 1 to 5, comma separated.')) streamed += chunk;
    assert.match(streamed, /1,\s*2,\s*3/);
    const chat = vertex.startChat({ systemInstruction: 'Be brief.' });
    await chat.sendText('My name is Sam.');
    assert.match(await chat.sendText('What is my name?'), /sam/i);
    return JSON.stringify(text);
  });

  await run('vertex function calling with thought signatures', [VERTEX_API_KEY], async () => {
    const chat = vertex.startChat({ tools: [{ functionDeclarations: [{ name: 'get_weather', description: 'Weather for a city', parameters: { type: 'OBJECT', properties: { city: { type: 'STRING' } }, required: ['city'] } }] }] });
    const response = await chat.send('What is the weather in Paris?');
    const calls = GoogleAIWrapper.extractFunctionCalls(response);
    assert.strictEqual(calls[0].name, 'get_weather');
    const answer = await chat.send(null, null, { parts: calls.map((call) => ({ functionResponse: { name: call.name, ...(call.id && { id: call.id }), response: { tempC: 21 } } })) });
    assert.match(GoogleAIWrapper.extractText(answer), /21/);
  });

  await run('vertex Google Search grounding', [VERTEX_API_KEY], async () => {
    const response = await vertex.generateContent({ contents: 'What is the latest Node.js LTS major version? One sentence.', tools: [{ googleSearch: {} }] });
    const citations = GoogleAIWrapper.extractCitations(response);
    assert.ok(citations.length > 0, 'grounded answers have sources');
    return `${citations.length} sources`;
  });

  await run('vertex structured output, tokens and embeddings', [VERTEX_API_KEY], async () => {
    const response = await vertex.generateStructuredContent('Largest city in Japan?', { type: 'OBJECT', properties: { city: { type: 'STRING' } }, required: ['city'] });
    assert.strictEqual(JSON.parse(GoogleAIWrapper.extractText(response)).city, 'Tokyo');
    assert.ok((await vertex.countTokens('How many tokens is this?')).totalTokens > 0);
    const vectors = await vertex.embedTexts(['hello', 'world'], null, { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: 256 });
    assert.deepStrictEqual(vectors.map((vector) => vector.length), [256, 256]);
  });

  await run('vertex image generation, editing and understanding', [VERTEX_API_KEY], async () => {
    const [image] = GoogleAIWrapper.extractImages(await vertex.generateImage('A flat red apple icon on white', { imageConfig: { aspectRatio: '1:1' } }));
    const file = path.join(temp, 'apple.png');
    fs.writeFileSync(file, Buffer.from(image.data, 'base64'));
    assert.match(await vertex.mediaToText('What fruit is this? One word.', [file]), /apple/i);
    assert.strictEqual(GoogleAIWrapper.extractImages(await vertex.editImage('Make the apple green.', [file])).length, 1);
    return `${fs.statSync(file).size} bytes`;
  });

  await run('vertex speech (WAV)', [VERTEX_API_KEY], async () => {
    const wav = await vertex.textToSpeech('Hello from IntelliNode.', { voice: 'Puck' });
    assert.strictEqual(wav.slice(0, 4).toString(), 'RIFF');
    return `${wav.length} bytes`;
  });

  await run('vertex Chatbot, Gen and image controller', [VERTEX_API_KEY], async () => {
    const bot = new Chatbot(VERTEX_API_KEY, 'vertex');
    const input = Chatbot.createInput('vertex', 'You are concise.', { systemInstruction: true, generationConfig: LOW_THINKING });
    input.addUserMessage('Capital of France? One word.');
    assert.match((await bot.chat(input))[0], /paris/i);
    assert.ok(bot.lastResponse.usageMetadata.totalTokenCount > 0);
    let streamed = '';
    for await (const chunk of bot.stream(input)) streamed += chunk;
    assert.match(streamed, /paris/i);
    assert.match(await Gen.generate_text('Reply with the word ok.', VERTEX_API_KEY, 'vertex'), /ok/i);
    const [image] = await new RemoteImageModel(VERTEX_API_KEY, 'vertex').generateImages(new ImageModelInput({ prompt: 'a small leaf icon', width: 1024, height: 768 }));
    assert.ok(image.length > 1000);
  });

  await run('vertex Assistant with documents, history and memory', [VERTEX_API_KEY], async () => {
    const embedder = { provider: 'vertex', apiKey: VERTEX_API_KEY, dimensions: 768 };
    const assistant = new Assistant({
      provider: 'vertex', apiKey: VERTEX_API_KEY,
      history: new FileChatHistory({ dir: path.join(temp, 'conversations') }),
      knowledge: new MemoryVectorStore({ embedder }),
      memory: new MemoryVectorStore({ embedder }),
      inputOptions: { generationConfig: LOW_THINKING },
    });
    await assistant.addDocuments([{ id: 'handbook', text: 'The on-call rotation changes every Tuesday at 10:00 UTC. Pages must be acknowledged within 15 minutes.' }]);
    const first = await assistant.chat('How fast must pages be acknowledged?', { userId: 'u1' });
    assert.match(first.text, /15/);
    assert.strictEqual(first.references[0].id, 'handbook#0');
    const second = await assistant.chat('And when does the rotation change?', { conversationId: first.conversationId, userId: 'u1' });
    assert.match(second.text, /tuesday/i);
    const recall = await assistant.chat('What did I ask you about pages before?', { userId: 'u1' });
    assert.ok(recall.memories.length > 0);
    assert.strictEqual((await assistant.getMessages(first.conversationId)).length, 4);
  });

  await run('project mode text and Lyria music', [VERTEX_API_KEY, VERTEX_PROJECT_ID], async () => {
    assert.match(await project.generateText('Reply with ok.'), /ok/i);
    const [track] = GoogleAIWrapper.extractAudio(await project.generateMusic('Calm piano, a few seconds'));
    return `${GoogleAIWrapper.audioToWav(track).length} bytes of music`;
  });

  const hasWebSocket = typeof globalThis.WebSocket === 'function';
  await run('Live API (Developer API and Vertex project)', [GEMINI_API_KEY, VERTEX_API_KEY, VERTEX_PROJECT_ID, hasWebSocket], async () => {
    const devTurn = await dev.liveGenerate('Say hello in five words.');
    const projectTurn = await project.liveGenerate('Say hello in five words.');
    assert.ok(devTurn.audio.length > 0 && projectTurn.audio.length > 0);
    const session = await dev.liveConnect({ config: { outputAudioTranscription: {}, tools: [{ functionDeclarations: [{ name: 'get_time', description: 'Current time' }] }] } });
    try {
      session.sendText('What time is it? Use the tool.');
      let turn = await session.receiveTurn();
      assert.strictEqual(turn.toolCalls[0].name, 'get_time');
      session.sendToolResponse(turn.toolCalls.map((call) => ({ id: call.id, name: call.name, response: { time: '10:30' } })));
      turn = await session.receiveTurn();
      assert.match(turn.transcription + turn.text, /10[:.]?30|ten thirty/i);
    } finally {
      session.close();
    }
    return JSON.stringify(devTurn.transcription);
  });

  await run('Developer API text, embeddings and Files API', [GEMINI_API_KEY], async () => {
    assert.match(await dev.generateText('Reply with the word ok.'), /ok/i);
    assert.strictEqual((await dev.embedTexts(['a', 'b'])).length, 2);
    const file = path.join(temp, 'note.txt');
    fs.writeFileSync(file, 'The secret word is pineapple.');
    const uploaded = await dev.uploadFile(file);
    const ready = await dev.waitForFileActive(uploaded.name);
    assert.match(await dev.mediaToText('What is the secret word? One word.', [{ uri: ready.uri, mimeType: ready.mimeType }]), /pineapple/i);
    await dev.deleteFile(uploaded.name);
  });

  await run('a Vertex key on the Developer API explains the fix', [VERTEX_API_KEY], async () => {
    await assert.rejects(new GoogleAIWrapper(VERTEX_API_KEY).generateText('hi'), (error) => /vertex: true/.test(error.message) && !error.message.includes(VERTEX_API_KEY));
  });

  await run('Veo video (INTELLI_RUN_VEO=1)', [VERTEX_API_KEY, VERTEX_PROJECT_ID, process.env.INTELLI_RUN_VEO], async () => {
    const operation = await project.generateVideo('A slow drone shot over a misty pine forest', { durationSeconds: 4, resolution: '720p', generateAudio: false });
    const done = await project.waitForVideoCompletion(operation, { maxWaitMs: 900000, pollMs: 10000 });
    const [video] = GoogleAIWrapper.extractVideos(done);
    assert.ok(video && (video.data || video.uri));
  });

  fs.rmSync(temp, { recursive: true, force: true });
  const failed = results.filter((ok) => !ok).length;
  console.log(`\nGoogle live tests: ${results.length - failed}/${results.length} passed`);
  if (failed) process.exitCode = 1;
})();
