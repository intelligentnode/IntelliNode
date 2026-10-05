/*
Apache License
*/
const config = require('../config.json');
const connHelper = require('../utils/ConnHelper');
const FetchClient = require('../utils/FetchClient');
const GeminiAIWrapper = require('./GeminiAIWrapper');
const { GoogleAIError, GoogleAIChatSession, GoogleAILiveSession } = GeminiAIWrapper;

/**
 * One wrapper for Google AI.
 *
 * - Google Cloud APIs with a Cloud API key: Text-to-Speech (generateSpeech), Speech-to-Text, Vision,
 *   Natural Language and Translation.
 * - Gemini on the Gemini Developer API or on Vertex AI / the Gemini Enterprise Agent Platform: every method of
 *   GeminiAIWrapper (text, chat, streaming, tools, grounding, media understanding, image / video / music / speech
 *   generation, embeddings, Files API, caching, Agent Engine, Live API).
 *
 *   new GoogleAIWrapper(CLOUD_API_KEY).generateSpeech({ text, languageCode, name, ssmlGender })   // Cloud TTS
 *   new GoogleAIWrapper(GEMINI_API_KEY).generateText('Hello')                                    // Developer API
 *   new GoogleAIWrapper(VERTEX_API_KEY, { vertex: true }).generateText('Hello')                  // Vertex express
 *
 * `client` stays the Cloud Text-to-Speech client; Gemini calls use `genaiClient`.
 */
class GoogleAIWrapper extends GeminiAIWrapper {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    this.API_SPEECH_URL = config.url.google.base.replace(
      '{1}',
      config.url.google.speech.prefix
    );
    this.API_KEY = this.API_KEY || apiKey;

    this.client = new FetchClient({
      baseURL: this.API_SPEECH_URL,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...(this.API_KEY && { 'X-Goog-Api-Key': this.API_KEY })
      },
      timeout: options.timeout,
      retries: options.retries,
      retryDelay: options.retryDelay
    });
  }

  // ------------------------------------------------------------------
  // Google Cloud Text-to-Speech
  // ------------------------------------------------------------------

  /** Cloud Text-to-Speech: params { text, languageCode, name, ssmlGender }. Returns { audioContent (base64 MP3) }. */
  async generateSpeech(params) {
    const url = this.API_SPEECH_URL + config.url.google.speech.synthesize.postfix;

    const json = this.getSynthesizeInput(params);
    try {
      return await this.client.post(url, JSON.parse(json));
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  getSynthesizeInput(params) {
    const text = params.text;
    const languageCode = params.languageCode;
    const name = params.name;
    const ssmlGender = params.ssmlGender;

    const modelInput = {
      input: {
        text: text
      },
      voice: {
        languageCode: languageCode,
        name: name,
        ssmlGender: ssmlGender
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };

    return JSON.stringify(modelInput);
  }

  /** Cloud Text-to-Speech from SSML. voiceParams { languageCode, name, ssmlGender }. Returns { audioContent }. */
  async generateSpeechWithSSML(ssml, voiceParams, audioConfig = { audioEncoding: 'MP3' }) {
    const url = this.API_SPEECH_URL + config.url.google.speech.synthesize.postfix;
    return this._cloudPost(url, { input: { ssml }, voice: voiceParams, audioConfig });
  }

  // ------------------------------------------------------------------
  // Speech-to-Text, Vision, Natural Language and Translation (Cloud API key)
  // ------------------------------------------------------------------

  _cloudUrl(service, postfix) {
    return config.url.google.base.replace('{1}', config.url.google[service].prefix) + postfix;
  }

  async _cloudPost(url, body) {
    try {
      return await this.client.post(url, body);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  async _cloudGet(url) {
    try {
      return await this.client.get(url);
    } catch (error) {
      throw connHelper.wrapError(error);
    }
  }

  static _base64(content) {
    if (typeof content === 'string') return content;
    return Buffer.from(content).toString('base64');
  }

  /**
   * Cloud Speech-to-Text (short audio, up to one minute).
   * @param {Buffer|string} audio - bytes or base64.
   * @param {object} recognitionConfig - default { languageCode: 'en-US', enableAutomaticPunctuation: true }.
   */
  async transcribeAudio(audio, recognitionConfig = null) {
    return this._cloudPost(this._cloudUrl('speechtotext', config.url.google.speechtotext.recognize.postfix), {
      config: recognitionConfig || { languageCode: 'en-US', enableAutomaticPunctuation: true },
      audio: { content: GoogleAIWrapper._base64(audio) },
    });
  }

  /** Cloud Speech-to-Text for long audio in Cloud Storage (gs://); returns the long-running operation. */
  async transcribeAudioLongRunning(audioUri, recognitionConfig = null) {
    return this._cloudPost(this._cloudUrl('speechtotext', config.url.google.speechtotext.longrunning.postfix), {
      config: recognitionConfig || { languageCode: 'en-US', enableAutomaticPunctuation: true, enableWordTimeOffsets: true },
      audio: { uri: audioUri },
    });
  }

  /**
   * Cloud Vision annotate for one image (bytes, base64 or a gs:// / https URI).
   * @param {Array} features - default labels, text, faces and landmarks.
   */
  async analyzeImage(image, features = null) {
    const source = typeof image === 'string' && /^(gs|https?):\/\//i.test(image)
      ? { source: { imageUri: image } }
      : { content: GoogleAIWrapper._base64(image) };
    return this._cloudPost(this._cloudUrl('vision', config.url.google.vision.annotate.postfix), {
      requests: [{
        image: source,
        features: features || [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'TEXT_DETECTION' },
          { type: 'FACE_DETECTION' },
          { type: 'LANDMARK_DETECTION' },
        ],
      }],
    });
  }

  /** OCR with layout (DOCUMENT_TEXT_DETECTION): { text, pages }. */
  async extractDocumentText(image) {
    const result = await this.analyzeImage(image, [{ type: 'DOCUMENT_TEXT_DETECTION' }]);
    const response = (result.responses && result.responses[0]) || {};
    const annotation = response.fullTextAnnotation || {};
    return { text: annotation.text || '', pages: annotation.pages || [] };
  }

  /** Cloud Natural Language: sentiment, entities, syntax and categories of a text (annotateText). */
  async analyzeText(text, features = null) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.annotate.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
      features: features || { extractSyntax: false, extractEntities: true, extractDocumentSentiment: true, classifyText: false },
      encodingType: 'UTF8',
    });
  }

  /** Cloud Natural Language document sentiment. */
  async analyzeSentiment(text) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.sentiment.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
      encodingType: 'UTF8',
    });
  }

  /** Cloud Natural Language content categories. */
  async classifyText(text) {
    return this._cloudPost(this._cloudUrl('language', config.url.google.language.classify.postfix), {
      document: { type: 'PLAIN_TEXT', content: text },
    });
  }

  /** Cloud Translation (Basic): returns { data: { translations: [{ translatedText, detectedSourceLanguage }] } }. */
  async translateText(text, targetLanguage, sourceLanguage = null, format = 'text') {
    return this._cloudPost(config.url.google.translation.base, {
      q: text,
      target: targetLanguage,
      format,
      ...(sourceLanguage && { source: sourceLanguage }),
    });
  }

  /** Cloud Translation (Basic) language detection. */
  async detectLanguage(text) {
    return this._cloudPost(`${config.url.google.translation.base}/detect`, { q: text });
  }

  /** Languages supported by Cloud Translation, with names in targetLanguage. */
  async getSupportedLanguages(targetLanguage = 'en') {
    return this._cloudGet(`${config.url.google.translation.base}/languages?target=${encodeURIComponent(targetLanguage)}`);
  }
}

module.exports = GoogleAIWrapper;
module.exports.GoogleAIWrapper = GoogleAIWrapper;
module.exports.GoogleAIError = GoogleAIError;
module.exports.GoogleAIChatSession = GoogleAIChatSession;
module.exports.GoogleAILiveSession = GoogleAILiveSession;
