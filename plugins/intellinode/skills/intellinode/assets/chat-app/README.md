# IntelliNode Chat (local app template)

A Gemini / ChatGPT-style chat app in two files, built on the IntelliNode `Assistant`:

- conversations saved as JSON files in `./data` (or in Google Cloud Firestore with `HISTORY=firestore`), with titles
- answers grounded on documents you add, with numbered sources
- long-term memory: earlier conversations are recalled when they are relevant
- attachments (images, PDFs, audio and video on Gemini; images and PDFs on Anthropic; images on OpenAI)
- a "Search the web" toggle with source links (Gemini and Vertex AI)
- `/image <prompt>` image generation (Gemini, Vertex AI or OpenAI)

## Run

```bash
npm install intellinode dotenv
node server.js
```

Set one key in the environment or in a `.env` file next to `server.js`:

| Variable | Provider |
| --- | --- |
| `VERTEX_API_KEY` | Gemini on Vertex AI (express mode); add `VERTEX_PROJECT_ID` for project mode |
| `GEMINI_API_KEY` | Gemini Developer API (AI Studio key) |
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic (documents and memory then need `OPENAI_API_KEY` for embeddings) |

Optional: `PROVIDER` (pick one when several keys are set), `MODEL`, `SYSTEM_MESSAGE`, `PORT` (default 3300),
`DATA_DIR`, `HISTORY=firestore` with `GOOGLE_CLOUD_PROJECT` (run `gcloud auth application-default login` first;
memory then uses Firestore vector search, which needs the index printed by `FirestoreVectorStore.indexCommand`).

The server listens on 127.0.0.1 because it holds your API key. Put authentication in front of it before you
expose it, and pass a `userId` per signed-in user to `assistant.stream` so conversations stay separate.
