# Gemini and Vertex AI with IntelliNode

`GoogleAIWrapper` (a superset of `GeminiAIWrapper`) covers the Gemini Developer API and Vertex AI / the Gemini
Enterprise Agent Platform with plain HTTP calls. Every method below exists on both classes except the Google Cloud
APIs at the end.

```js
const { GoogleAIWrapper } = require('intellinode');
const dev = new GoogleAIWrapper(process.env.GEMINI_API_KEY);                                   // Developer API
const vertex = new GoogleAIWrapper(process.env.VERTEX_API_KEY, { vertex: true });              // express mode
const project = new GoogleAIWrapper(process.env.VERTEX_API_KEY, { vertex: true, projectId });  // Veo, Live, Lyria 2
const adc = new GoogleAIWrapper(null, { projectId, location: 'global' });                      // gcloud ADC, Node only
const token = new GoogleAIWrapper(null, { projectId, accessToken: async () => getToken() });  // your OAuth token
```

Options: `vertex`, `projectId`, `location` (`global` by default in project mode; Veo, Live, Lyria and Agent Engine
go to `us-central1` unless you set one), `accessToken`, `credentials` (service account object or path),
`apiVersion`, `quotaProjectId`, `baseUrl`, `timeout`, `retries`, `WebSocket`.

## Capabilities

| Feature | Methods | Developer API | Vertex express | Vertex project |
| --- | --- | --- | --- | --- |
| Text, system instruction, thinking | `generateText`, `generateContent` | yes | yes | yes |
| Chat with history | `startChat()` -> `send`, `sendText`, `stream`, `sendFunctionResponse` | yes | yes | yes |
| Streaming | `streamText`, `streamGenerateContent` | yes | yes | yes |
| Structured JSON | `generateStructuredContent(parts, schema)` | yes | yes | yes |
| Function calling | `tools: [{ functionDeclarations }]`, `extractFunctionCalls` | yes | yes | yes |
| Google Search / URL context / code execution | `tools: [{ googleSearch: {} }]`, `[{ urlContext: {} }]`, `[{ codeExecution: {} }]` | yes | yes | yes |
| Images, audio, video, PDF understanding | `mediaToText`, `audioToText`, `videoToText`, `mediaPart` | yes | yes | yes |
| Image generation and editing | `generateImage`, `editImage`, `extractImages` | yes | yes | yes |
| Video (Veo) | `generateVideo`, `waitForVideoCompletion`, `extractVideos`, `downloadMedia` | yes | no | yes |
| Music (Lyria) | `generateMusic`, `extractAudio`, `audioToWav` | Lyria 3 | lyria-002 | lyria-002 |
| Speech (Gemini TTS) | `textToSpeech`, `generateGeminiSpeech`, `generateMultiSpeakerSpeech` | yes | yes | yes |
| Embeddings | `embedTexts`, `getEmbeddings`, `getBatchEmbeddings` | yes | yes | yes |
| Tokens | `countTokens`, `computeTokens` (Vertex) | yes | yes | yes |
| Files API | `uploadFile`, `waitForFileActive`, `getFile`, `listFiles`, `deleteFile` | yes | no | no |
| Context caching | `createCachedContent`, then `{ cachedContent: name }` | yes | no | OAuth |
| Live API (voice, websocket) | `liveConnect`, `liveGenerate` | yes | no | yes |
| Agent Engine | `listAgentEngines`, `queryAgentEngine`, `streamQueryAgentEngine` | no | no | yes |
| RAG grounding | `wrapper.ragTool(corpus)`, `GoogleAIWrapper.vertexAISearchTool(datastore)` | no | no | OAuth |

## Examples

```js
// text with a system instruction and low thinking
const text = await vertex.generateText('Explain RAG in one sentence.', {
  systemInstruction: 'Be brief.', generationConfig: { thinkingConfig: { thinkingLevel: 'low' } },
});

// chat that keeps history (store chat.history as JSON, resume with startChat({ history }))
const chat = vertex.startChat({ systemInstruction: 'You are a tutor.' });
await chat.sendText('My name is Sam.');
for await (const chunk of chat.stream('What is my name?')) process.stdout.write(chunk);

// Google Search grounding with sources
const response = await vertex.generateContent({ contents: 'Latest Node.js LTS?', tools: [{ googleSearch: {} }] });
GoogleAIWrapper.extractText(response);
GoogleAIWrapper.extractCitations(response);   // [{ title, uri, domain }]

// function calling in a chat (Gemini 3 needs the thought signatures, which the chat keeps)
const toolsChat = vertex.startChat({ tools: [{ functionDeclarations: [{ name: 'get_weather', description: 'Weather for a city',
  parameters: { type: 'OBJECT', properties: { city: { type: 'STRING' } }, required: ['city'] } }] }] });
let reply = await toolsChat.send('Weather in Paris?');
const calls = GoogleAIWrapper.extractFunctionCalls(reply);          // [{ name, args, id }]
reply = await toolsChat.send(null, null, { parts: calls.map((c) => ({ functionResponse: { name: c.name, id: c.id, response: { tempC: 21 } } })) });

// media understanding: paths (Node), { data, mimeType }, gs:// / https / YouTube URIs
await vertex.mediaToText('What is in this photo?', ['photo.png']);
await dev.videoToText('https://www.youtube.com/watch?v=VIDEO_ID', 'List the scenes.');

// image generation and editing
const image = GoogleAIWrapper.extractImages(await vertex.generateImage('A watercolor fox', { imageConfig: { aspectRatio: '16:9' } }))[0];
require('fs').writeFileSync('fox.png', Buffer.from(image.data, 'base64'));
await vertex.editImage('Make it night time.', ['fox.png']);

// speech (WAV Buffer) and music
require('fs').writeFileSync('hello.wav', await vertex.textToSpeech('Say cheerfully: welcome!', { voice: 'Puck' }));
const track = GoogleAIWrapper.extractAudio(await project.generateMusic('Calm piano with soft rain'))[0];
require('fs').writeFileSync('music.wav', GoogleAIWrapper.audioToWav(track));

// video (project mode, billed per second, takes minutes)
const operation = await project.generateVideo('Drone shot over a misty forest', { durationSeconds: 4, resolution: '720p' });
const done = await project.waitForVideoCompletion(operation, { maxWaitMs: 900000 });
const [video] = GoogleAIWrapper.extractVideos(done);  // { data (base64) | uri }

// embeddings (taskType RETRIEVAL_DOCUMENT for documents, RETRIEVAL_QUERY for questions)
const vectors = await vertex.embedTexts(['first', 'second'], null, { taskType: 'RETRIEVAL_DOCUMENT', outputDimensionality: 768 });

// Files API for large files on the Developer API
const file = await dev.uploadFile('lecture.mp4');
const ready = await dev.waitForFileActive(file.name);
await dev.mediaToText('Summarize the lecture.', [{ uri: ready.uri, mimeType: ready.mimeType }]);

// Live API: one spoken turn (24 kHz PCM back), or a session with tools
const turn = await project.liveGenerate('Tell me a short joke.');
require('fs').writeFileSync('joke.wav', GoogleAIWrapper.pcmToWav(turn.audio));
const session = await dev.liveConnect({ config: { outputAudioTranscription: {}, tools: [...] } });
session.sendText('What time is it?');
let liveTurn = await session.receiveTurn();             // { text, transcription, audio, toolCalls, usage }
session.sendToolResponse(liveTurn.toolCalls.map((c) => ({ id: c.id, name: c.name, response: { time: '10:30' } })));
liveTurn = await session.receiveTurn();
session.close();
```

Notes:

- The Live API needs a WebSocket: Node 22+, `node --experimental-websocket` on Node 20, or
  `new GoogleAIWrapper(key, { WebSocket: require('ws') })`. Live models run in us-central1 on Vertex AI.
- Veo video, Lyria music and image generation are billed per call; Veo also takes minutes. Ask before running them.
- Web citations: `uri` is a Google redirect link and `title` is often the domain.
- `extractImages(response)` gives `{ mimeType, data }`; the size follows the model and `imageConfig.aspectRatio`.

## Through Chatbot, Gen and the controllers

```js
const { Chatbot, Gen, RemoteImageModel, RemoteSpeechModel, RemoteEmbedModel, ImageModelInput, Text2SpeechInput, EmbedInput } = require('intellinode');
const bot = new Chatbot(process.env.VERTEX_API_KEY, 'vertex', null, { projectId, location: 'global' });  // projectId optional
const input = Chatbot.createInput('vertex', 'You are concise.', { systemInstruction: true, generationConfig: { thinkingConfig: { thinkingLevel: 'low' } } });
input.addUserMessage('What is in the image?', [{ data: base64Png, mimeType: 'image/png' }]);
const [answer] = await bot.chat(input);
for await (const chunk of bot.stream(input)) process.stdout.write(chunk);
await Gen.generate_text('Write a haiku', process.env.VERTEX_API_KEY, 'vertex');
await new RemoteImageModel(key, 'vertex').generateImages(new ImageModelInput({ prompt: 'leaf icon', width: 1024, height: 1024 })); // base64[]
await new RemoteSpeechModel(key, 'gemini').generateSpeech(new Text2SpeechInput({ text: 'hello', gender: 'MALE' }));            // base64 WAV
await new RemoteEmbedModel(key, 'vertex').getEmbeddings(new EmbedInput({ texts: ['a', 'b'] }));                                 // [{ embedding }]
```

## Errors

Gemini methods throw `GoogleAIError` with `status`, `details` and `body`; keys and tokens are removed from the
message. Hints are added for the common cases: a Vertex key on the Developer API, an OAuth-only endpoint called with
a key, and a missing project. Timeouts and cancellation keep `code: 'ETIMEDOUT'` and `name: 'AbortError'`.

## Google Cloud APIs (GoogleAIWrapper only, Cloud API key)

`generateSpeech({ text, languageCode, name, ssmlGender })` (Cloud Text-to-Speech, base64 MP3), `generateSpeechWithSSML`,
`transcribeAudio`, `transcribeAudioLongRunning`, `analyzeImage`, `extractDocumentText`, `analyzeText`,
`analyzeSentiment`, `classifyText`, `translateText`, `detectLanguage`, `getSupportedLanguages`.

## Default models (config.json)

| Kind | Developer API | Vertex AI |
| --- | --- | --- |
| chat / vision | gemini-3.6-flash | gemini-3.8-flash |
| image | gemini-3.1-flash-image | gemini-3.1-flash-image |
| tts | gemini-3.8-flash-tts | gemini-2.5-flash-tts |
| embed | gemini-embedding-001 | gemini-embedding-001 |
| video | veo-3.1-fast-generate-preview | veo-3.1-fast-generate-001 |
| music | lyria-3.5 | lyria-002 |
| live | gemini-3.8-live | gemini-3.8-live |

`GoogleAIWrapper.modelCatalog()` lists more Vertex model ids by capability. Imagen was retired by Google
(2026-06-30); use the Gemini image models.
