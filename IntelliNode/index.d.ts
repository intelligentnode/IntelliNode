// Type definitions for intellinode
// Project: https://github.com/intelligentnode/IntelliNode

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------

/** A JSON Schema object (draft 2020-12 or older). */
export type JsonSchema = Record<string, any>;

/** Chat providers accepted by Chatbot and Gen. */
export type ChatProvider =
  | 'openai' | 'replicate' | 'sagemaker' | 'cohere' | 'mistral' | 'gemini' | 'anthropic' | 'nvidia' | 'vllm'
  | 'openai_compatible' | 'openrouter' | 'groq' | 'deepseek' | 'xai' | 'together' | 'ollama' | 'lmstudio';

export type CompatiblePreset = 'openrouter' | 'groq' | 'deepseek' | 'xai' | 'together' | 'ollama' | 'lmstudio';

export type EmbedProvider = 'openai' | 'cohere' | 'replicate' | 'gemini' | 'nvidia' | 'vllm'
  | 'openai_compatible' | 'openrouter' | 'together' | 'ollama' | 'lmstudio';

/** A function tool in chat-completions format. */
export interface ChatToolFunction {
  name: string;
  description?: string;
  parameters?: JsonSchema;
  strict?: boolean;
}
export interface ChatTool {
  type: 'function';
  function: ChatToolFunction;
}
/** Tool definitions accepted by every input: chat-completions, Responses ({ type, name, parameters }), plain or Anthropic ({ name, input_schema }). */
export type ToolDefinition = ChatTool | (ChatToolFunction & { type?: 'function'; input_schema?: JsonSchema }) | Record<string, any>;
export type ToolChoice = 'auto' | 'none' | 'required' | 'any' | { type: 'function'; function: { name: string } } | { type: 'function'; name: string } | Record<string, any>;

/** A tool call returned by a model (chat-completions format on every provider). */
export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
  /** Gemini 3 thought signature, echoed back by addToolCalls */
  thoughtSignature?: string;
}
/** A tool result to feed back with addToolResults. */
export interface ToolResult {
  id: string;
  name?: string;
  content: any;
  isError?: boolean;
}

/** One chat reply: plain text, or an object when the model requested tools. */
export type ChatReply = string | { content: string | null; tool_calls: ToolCall[] } | { content: string | null; function_call: { name: string; arguments: string } };
export type ChatResponse = ChatReply[] | { result: ChatReply[]; references: Record<string, { pages: any[] }> };

/** Timeouts (ms), retries with backoff and cancellation for the HTTP layer. */
export interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

// ---------------------------------------------------------------------
// Chat inputs
// ---------------------------------------------------------------------

export interface ChatModelOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  /** semantic search context (IntelliNode one key) */
  searchK?: number;
  attachReference?: boolean;
  /** JSON Schema the reply must match (native structured output where the provider supports it). */
  responseSchema?: JsonSchema;
  /** 'json' asks for free-form JSON. Implied by responseSchema. */
  responseFormat?: 'json' | null;
  /** OpenAI strict mode: closes every object in the schema. */
  strictSchema?: boolean;
  tools?: ToolDefinition[];
  toolChoice?: ToolChoice;
}

export class ChatGPTMessage {
  constructor(content: any, role: 'system' | 'user' | 'assistant' | 'tool' | string, name?: string | null);
  content: any;
  role: string;
  name: string | null;
  isSystemRole(): boolean;
}

export class ChatModelInput {
  constructor(options?: ChatModelOptions);
  searchK: number;
  attachReference: boolean;
  responseSchema: JsonSchema | null;
  responseFormat: 'json' | null;
  strictSchema: boolean;
  model?: string | null;
  tools?: ToolDefinition[] | null;
  toolChoice?: ToolChoice | null;
  getChatInput(): any;
  addUserMessage(text: any): void;
  addAssistantMessage(text: string): void;
  cleanMessages(): void;
  deleteLastMessage?(message: any): boolean;
  /** Record an assistant turn that requested tools. */
  addToolCalls(toolCalls: ToolCall[], content?: string | null): void;
  /** Record the tool results for the last tool calls. */
  addToolResults(results: ToolResult[]): void;
}

export interface ChatGPTOptions extends ChatModelOptions {
  /** gpt-5+ reasoning effort: none, low, medium, high, xhigh */
  effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | string;
  reasoningEffort?: string;
  /** gpt-5+ answer length */
  verbosity?: 'low' | 'medium' | 'high';
}

export class ChatGPTInput extends ChatModelInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: ChatGPTOptions);
  messages: ChatGPTMessage[];
  model: string | null;
  temperature: number | null;
  maxTokens: number | null;
  numberOfOutputs: number;
  effort: string | null;
  verbosity: string | null;
  addMessage(message: ChatGPTMessage): void;
  addSystemMessage(text: string): void;
  getChatMessages(options?: { toolResultName?: boolean }): any[];
  /** Request body for the Responses API (gpt-5 and newer). */
  getResponsesInput(): any;
}

/** Chat-completions input for OpenAI-compatible services; the model defaults to the provider preset. */
export class OpenAICompatibleInput extends ChatGPTInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: ChatModelOptions);
  model: string | null;
}

export class CohereInput extends ChatGPTInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: ChatModelOptions & { web?: boolean });
}

export class MistralInput extends ChatGPTInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: ChatModelOptions);
}

export class VLLMInput extends ChatGPTInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: ChatModelOptions & { top_p?: number });
}

export class GeminiInput extends ChatModelInput {
  constructor(systemMessage?: string | null, options?: ChatModelOptions);
  messages: Array<{ role: 'user' | 'model'; parts: any[] }>;
  model: string;
  maxOutputTokens?: number;
  temperature?: number;
  addModelMessage(text: string): void;
}

export class AnthropicInput extends ChatModelInput {
  constructor(system: string, options?: ChatModelOptions);
  system: string;
  model: string;
  maxTokens: number;
  temperature: number | null;
  messages: Array<{ role: 'user' | 'assistant'; content: any }>;
}

export class NvidiaInput extends ChatModelInput {
  constructor(systemMessage: string, options?: ChatModelOptions & { topP?: number; presencePenalty?: number; frequencyPenalty?: number; stream?: boolean });
  messages: any[];
  model: string;
}

export class ChatLLamaInput extends ChatModelInput {
  constructor(systemMessage: string | ChatGPTMessage, options?: { model?: string; version?: string; temperature?: number; maxTokens?: number; top_p?: number; prompt?: string; repetition_penalty?: number; debug?: boolean } & ChatModelOptions);
  prompt: string;
}
export class LLamaReplicateInput extends ChatLLamaInput {}
export class LLamaSageInput extends ChatModelInput {
  constructor(systemMessage: string | ChatGPTMessage, parameters?: Record<string, any>, options?: ChatModelOptions);
  messages: ChatGPTMessage[];
}

// ---------------------------------------------------------------------
// Chatbot
// ---------------------------------------------------------------------

export const SupportedChatModels: {
  OPENAI: 'openai'; REPLICATE: 'replicate'; SAGEMAKER: 'sagemaker'; COHERE: 'cohere'; MISTRAL: 'mistral';
  GEMINI: 'gemini'; ANTHROPIC: 'anthropic'; NVIDIA: 'nvidia'; VLLM: 'vllm'; OPENAI_COMPATIBLE: 'openai_compatible';
  OPENROUTER: 'openrouter'; GROQ: 'groq'; DEEPSEEK: 'deepseek'; XAI: 'xai'; TOGETHER: 'together'; OLLAMA: 'ollama'; LMSTUDIO: 'lmstudio';
};

export interface ChatbotOptions extends RequestOptions {
  /** IntelliNode one key for semantic search over your documents */
  oneKey?: string;
  intelliBase?: string;
  /** base URL for vllm, nvidia (self-hosted) and openai_compatible */
  baseUrl?: string;
  /** extra headers for OpenAI-compatible services (e.g. OpenRouter attribution) */
  headers?: Record<string, string>;
  /** default model for OpenAI-compatible services */
  model?: string;
  nvidiaOptions?: { baseUrl?: string };
}

/** A tool with its implementation, for Chatbot.runTools. */
export interface RunnableTool extends ChatToolFunction {
  handler: (args: any, call: ToolCall) => any | Promise<any>;
}
/** Anything that exposes MCP-style tools: MCPClient or a compatible object. */
export interface ToolProvider {
  toChatTools(): ChatTool[];
  callTool(name: string, args: any): Promise<any>;
  /** called by runTools when the cached tools list is empty */
  fetchTools?(): Promise<any>;
  tools?: any[];
}
export type ToolSet = RunnableTool[] | Record<string, (args: any, call: ToolCall) => any> | ToolProvider;

export interface RunToolsOptions {
  /** maximum model rounds (default 5) */
  maxSteps?: number;
  onToolCall?: (name: string, args: any) => void | Promise<void>;
  onToolResult?: (name: string, result: any, isError: boolean) => void | Promise<void>;
}
export interface RunToolsResult {
  text: string;
  steps: Array<{ name: string; arguments: any; result: any; isError: boolean }>;
  toolCalls: number;
}

export class Chatbot {
  constructor(keyValue: string | null | undefined, provider?: ChatProvider, customProxyHelper?: any, options?: ChatbotOptions);
  provider: string;
  getSupportedModels(): string[];
  /** Apply timeout, retries or an AbortSignal to every request of this chatbot. */
  setRequestOptions(options: RequestOptions): this;
  chat(modelInput: ChatModelInput | Record<string, any>, functions?: any[] | null, function_call?: any, debugMode?: boolean): Promise<ChatResponse>;
  /** Chat and parse the reply as JSON (set responseSchema or responseFormat on the input). */
  chatJson<T = any>(modelInput: ChatModelInput): Promise<T>;
  /** Run the tool loop until the model answers with text. */
  runTools(modelInput: ChatModelInput, tools?: ToolSet, options?: RunToolsOptions): Promise<RunToolsResult>;
  stream(modelInput: ChatModelInput | Record<string, any>): AsyncGenerator<string, void, unknown>;
  /** Model ids served by an OpenAI-compatible provider. */
  listModels(): Promise<string[]>;
  getSemanticSearchContext(modelInput: any): Promise<Record<string, any>>;
}

// ---------------------------------------------------------------------
// Gen
// ---------------------------------------------------------------------

export interface GenOptions extends RequestOptions {
  system?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  customProxyHelper?: any;
  baseUrl?: string;
  headers?: Record<string, string>;
  responseSchema?: JsonSchema;
  responseFormat?: 'json';
  [option: string]: any;
}

export interface CodeReview {
  summary: string;
  score: number;
  issues: Array<{ severity?: string; line?: number | null; issue?: string; suggestion?: string; [key: string]: any }>;
  [key: string]: any;
}

export interface RegexResult {
  pattern: string | null;
  flags: string;
  explanation?: string;
  matches: string[];
  nonMatches: string[];
  regex: RegExp | null;
  verified: boolean | null;
}

export interface DesignTokens {
  palette: Record<string, any>;
  semantic: Record<string, any>;
  typography: Record<string, any>;
  radius: Record<string, any>;
  spacing: Record<string, any>;
  contrast: any;
  css: string;
  tailwind: Record<string, any>;
  warnings: string[];
  [key: string]: any;
}

export class Gen {
  /** One call to any chat provider; returns the model text. */
  static generate_text(prompt: string, apiKey: string | null | undefined, provider?: ChatProvider, options?: GenOptions): Promise<string>;
  /** One call that returns parsed JSON matching the schema (or free-form JSON when schema is null). */
  static generate_json<T = any>(prompt: string, schema: JsonSchema | null, apiKey: string | null | undefined, provider?: ChatProvider, options?: GenOptions): Promise<T>;

  // content
  static get_marketing_desc(promptString: string, apiKey: string, provider?: ChatProvider, customProxyHelper?: any): Promise<string>;
  static get_blog_post(promptString: string, apiKey: string, provider?: ChatProvider, customProxyHelper?: any): Promise<string>;
  static getImageDescription(promptString: string, apiKey: string, customProxyHelper?: any, provider?: ChatProvider): Promise<string>;
  static generate_image_from_desc(promptString: string, openaiKey: string, imageApiKey: string, is_base64?: boolean, width?: number, height?: number, provider?: 'openai' | 'stability', customProxyHelper?: any): Promise<string | Uint8Array>;
  static generate_speech_synthesis(text: string, googleKey: string): Promise<any>;
  static generate_landing_copy(product: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<Record<string, any>>;
  static generate_faq(topic: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { count?: number }): Promise<Array<{ question: string; answer: string }>>;
  static generate_seo_meta(pageDescription: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { url?: string; siteName?: string }): Promise<Record<string, any> & { html: string }>;
  static translate_ui_strings(strings: Record<string, string>, apiKey: string, provider?: ChatProvider, options?: GenOptions & { targetLanguage?: string; sourceLanguage?: string }): Promise<Record<string, string>>;
  static generate_release_notes(changes: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { version?: string }): Promise<string>;
  static generate_readme(projectDescription: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<string>;

  // pages
  static generate_html_page(text: string, apiKey: string, model_name?: string, provider?: ChatProvider, customProxyHelper?: any): Promise<{ html: string; message: string }>;
  static save_html_page(text: string, folder: string, file_name: string, apiKey: string, model_name?: string, provider?: ChatProvider, customProxyHelper?: any): Promise<boolean>;
  static generate_dashboard(csvStrData: string, topic: string, apiKey: string, model_name?: string, num_graphs?: number, provider?: ChatProvider, customProxyHelper?: any): Promise<{ html: string; message: string }>;
  static instructUpdate(modelOutput: string, userInstruction: string, type?: string, apiKey?: string, model_name?: string, provider?: ChatProvider, customProxyHelper?: any): Promise<string>;

  // UI
  static generate_component(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { framework?: string; language?: string; styling?: string }): Promise<string>;
  static generate_form(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { framework?: string; action?: string }): Promise<string>;
  static generate_page_section(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { sectionType?: string; styling?: string }): Promise<string>;
  static generate_css(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<string>;
  static improve_accessibility(html: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<{ html: string; issues: Array<{ issue: string; fix: string; wcag?: string }> }>;
  static generate_email_template(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<string>;
  static generate_svg_icon(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { size?: number }): Promise<string>;
  static generate_color_palette(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { count?: number }): Promise<{ name: string; colors: Array<{ name: string; hex: string; usage?: string }>; css: string; [key: string]: any }>;
  static generate_design_tokens(input: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { brandColor?: string; cssPrefix?: string }): Promise<DesignTokens>;

  // backend and developer workflow
  static generate_api_endpoint(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { framework?: string; language?: string }): Promise<string>;
  static generate_sql(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { dialect?: string; schema?: string }): Promise<string>;
  static generate_json_schema(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<JsonSchema>;
  static generate_mock_data(schema: string | JsonSchema, apiKey: string, provider?: ChatProvider, options?: GenOptions & { count?: number }): Promise<any[]>;
  static generate_regex(description: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { language?: string }): Promise<RegexResult>;
  static generate_unit_tests(code: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { framework?: string; modulePath?: string; language?: string }): Promise<string>;
  static review_code(code: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { language?: string }): Promise<CodeReview>;
  static explain_code(code: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { audience?: string }): Promise<string>;
  static fix_code(code: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { problem?: string; language?: string }): Promise<{ code: string; explanation: string; changes: string[] }>;
  static convert_code(code: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { from?: string; to?: string }): Promise<string>;
  static generate_commit_message(diff: string, apiKey: string, provider?: ChatProvider, options?: GenOptions): Promise<string>;
  static generate_openapi_spec(input: string, apiKey: string, provider?: ChatProvider, options?: GenOptions & { title?: string; basePath?: string; version?: string }): Promise<Record<string, any>>;
}

// ---------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------

export const SupportedLangModels: { OPENAI: 'openai'; COHERE: 'cohere' };
export const SupportedImageModels: { OPENAI: 'openai'; STABILITY: 'stability' };
export const SupportedSpeechModels: { GOOGLE: 'google'; OPENAI: 'openAi' };
export const SupportedFineTuneModels: { OPENAI: 'openAi' };
export const SupportedEmbedModels: {
  OPENAI: 'openai'; COHERE: 'cohere'; REPLICATE: 'replicate'; GEMINI: 'gemini'; NVIDIA: 'nvidia'; VLLM: 'vllm';
  OPENAI_COMPATIBLE: 'openai_compatible'; OPENROUTER: 'openrouter'; TOGETHER: 'together'; OLLAMA: 'ollama'; LMSTUDIO: 'lmstudio';
};

export class LanguageModelInput {
  constructor(options: { prompt: string; model?: string | null; temperature?: number | null; maxTokens?: number | null; numberOfOutputs?: number });
  prompt: string;
  model: string | null;
  getCohereInputs(): any;
  getOpenAIInputs(): any;
}

export class RemoteLanguageModel {
  constructor(keyValue: string, provider?: 'openai' | 'cohere');
  static getSupportedModels(): string[];
  generateText(langInput: LanguageModelInput | Record<string, any>): Promise<string[]>;
}

export class ImageModelInput {
  constructor(options: {
    prompt: string; numberOfImages?: number; imageSize?: string | null; responseFormat?: string | null; width?: number | null; height?: number | null;
    diffusion_cfgScale?: number | null; diffusion_style_preset?: string | null; engine?: string | null; model?: string | null; quality?: string | null;
  });
  prompt: string;
  getOpenAIInputs(): any;
  getStabilityInputs(): any;
}

export class RemoteImageModel {
  constructor(keyValue: string, provider?: 'openai' | 'stability');
  generateImages(imageInput: ImageModelInput | Record<string, any>): Promise<string[]>;
}

export class Text2SpeechInput {
  constructor(options: { text: string; language?: string; gender?: string; voice?: string; model?: string; stream?: boolean });
}

export class RemoteSpeechModel {
  constructor(keyValue: string, provider?: 'google' | 'openAi');
  getSupportedModels(): string[];
  generateSpeech(input: Text2SpeechInput | Record<string, any>): Promise<any>;
}

export class EmbedInput {
  constructor(options: { texts: string[]; model?: string | null; inputType?: string | null });
  texts: string[];
  model: string | null;
  inputType: string | null;
  setDefaultValues(provider: EmbedProvider): void;
  getOpenAIInputs(): any;
  getCohereInputs(): any;
  getGeminiInputs(): any;
  getNvidiaInputs(inputType?: string): any;
  getVLLMInputs(): any;
  getLlamaReplicateInput(): any;
}

export interface Embedding { object?: string; index: number; embedding: number[] }

/** Gemini returns its single embedding as { values }; every other provider returns Embedding[]. */
export class RemoteEmbedModel<P extends EmbedProvider = 'openai'> {
  constructor(keyValue: string | null | undefined, provider?: P, customProxyHelper?: any);
  getSupportedModels(): string[];
  getEmbeddings(embedInput: EmbedInput | Record<string, any>): Promise<P extends 'gemini' ? { values: number[] } : Embedding[]>;
}

export class FineTuneInput {
  constructor(options: { training_file: string; model?: string });
}
export class RemoteFineTuneModel {
  constructor(keyValue: string, provider?: 'openAi');
  generateFineTune(input: FineTuneInput | Record<string, any>): Promise<any>;
  listFineTune(input?: any): Promise<any>;
  uploadFile(filePayload: any): Promise<any>;
}

export class FunctionModelInput {
  constructor(name: string, description?: string, parameters?: JsonSchema);
  getFunctionModelInput(): { name: string; description: string; parameters: JsonSchema };
}

// ---------------------------------------------------------------------
// Functions and utilities
// ---------------------------------------------------------------------

export class SemanticSearch {
  constructor(keyValue: string, provider?: 'openai' | 'cohere', customProxyHelper?: any);
  getTopMatches(pivotItem: string, searchArray: string[], numberOfMatches: number, modelName?: string | null): Promise<Array<{ index: number; similarity: number }>>;
  getTopVectorMatches(pivotEmbedding: number[], searchEmbeddings: number[][], numberOfMatches: number): Array<{ index: number; similarity: number }>;
  getTopMatchesFromEmbeddings(pivotEmbedding: number[], searchEmbeddings: number[][], numberOfMatches: number): Array<{ index: number; similarity: number }>;
  filterTopMatches<T>(searchResults: Array<{ index: number }>, originalArray: T[]): T[];
}
export class SemanticSearchPaging extends SemanticSearch {
  constructor(keyValue: string, provider: 'openai' | 'cohere', pivotItem: string, numberOfMatches: number);
  addNewData(newSearchItems: string[]): Promise<void>;
  getCurrentTopMatches(): Array<{ text: string; score: number }>;
  clean(): void;
}

export class TextAnalyzer {
  constructor(keyValue: string, provider?: 'openai' | 'cohere');
  summarize(text: string, options?: Record<string, any>): Promise<string>;
  sentimentAnalysis(text: string, options?: Record<string, any>): Promise<any>;
}

export class ChatContext {
  constructor(apiKey: string, provider?: EmbedProvider, customProxyHelper?: any);
  getStringContext(userMessage: string, historyMessages: string[], n: number, modelName?: string | null): Promise<string[]>;
  getRoleContext(userMessage: string, historyMessages: Array<{ role: string; content: string }>, n: number, modelName?: string | null): Promise<Array<{ role: string; content: string }>>;
}

export class LLMEvaluation {
  constructor(embedKeyValue: string, embedProvider?: EmbedProvider);
  generateEmbedding(inputString: string): Promise<number[]>;
  generateText(apiKey: string, inputString: string, provider: string, modelName: string, type: 'chat' | 'completion' | string, maxTokens?: number, custom_url?: string | null): Promise<string>;
  compareModels(inputString: string, targetAnswers: string[], providerSets: any[], isJson?: boolean): Promise<any>;
}

export class Prompt {
  constructor(template: string);
  getInput(): string;
  format(data: Record<string, any>): string;
  static fromText(text: string): Prompt;
  static fromFile(filePath: string): Prompt;
  static fromChatGPT(promptTopic: string, apiKey: string, customProxyHelper?: any, model?: string): Promise<Prompt>;
}

export class ProxyHelper {
  static getInstance(): ProxyHelper;
  setAzureOpenai(resourceName: string): void;
  setOpenaiProxyValues(proxySettings: Record<string, any>): void;
  setOriginOpenai(): void;
  setOpenaiURL(url: string): void;
  setOpenaiOrg(organization: string): void;
  getOpenaiURL(): string;
  getOpenaiChat(model?: string): string;
  getOpenaiResponses(model?: string): string;
  getOpenaiType(): string;
  getOpenaiCompletion(model?: string): string;
  getOpenaiImage(): string;
  getOpenaiAudioTranscriptions(model?: string): string;
  getOpenaiAudioSpeech(model?: string): string;
  getOpenaiFiles(): string;
  getOpenaiFineTuningJob(): string;
  getOpenaiEmbed(model?: string): string;
  getOpenaiResource(): string;
  getOpenaiOrg(): string | null;
}

export const SystemHelper: any;
export const AudioHelper: any;
export const ConnHelper: any;
export const MatchHelpers: any;
export const ModelHelper: {
  stripRouteOverride(model: string): string;
  isReasoningModel(model: string): boolean;
  isReasoningChatModel(model: string): boolean;
  defaultReasoningEffort(model: string): string;
  claudeRejectsSamplingParams(model: string): boolean;
  toChatTools(tools: ToolDefinition[]): ChatTool[];
  toResponsesTools(tools: ToolDefinition[]): any[];
  toAnthropicTools(tools: ToolDefinition[]): any[];
  toChatToolChoice(choice: ToolChoice): any;
  toResponsesToolChoice(choice: ToolChoice): any;
  toAnthropicToolChoice(choice: ToolChoice): any;
  functionsToTools(functions: any[]): ChatTool[];
  functionCallToToolChoice(functionCall: any): any;
  [helper: string]: any;
};

/** Parse model output: strip <think> blocks, extract code / markdown / SVG, repair and parse JSON. */
export const OutputParser: {
  stripThinking(text: string): string;
  extractBlocks(text: string): Array<{ language: string; code: string }>;
  extractCode(text: string, language?: string | null): string;
  extractMarkdown(text: string): string;
  repairJson(text: string): string;
  parseJson<T = any>(text: string, kind?: 'object' | 'array' | null): T;
  extractSvg(text: string): string;
};

export class GPTStreamParser { constructor(isLog?: boolean); feed(chunkText: string): AsyncGenerator<string, void, unknown>; }
export class CohereStreamParser { constructor(isLog?: boolean); feed(chunkText: string): AsyncGenerator<string, void, unknown>; }
export class VLLMStreamParser { constructor(isLog?: boolean); feed(chunkText: string): AsyncGenerator<string, void, unknown>; }
export class AnthropicStreamParser { constructor(isLog?: boolean); feed(chunkText: string): AsyncGenerator<string, void, unknown>; }

/** The fetch wrapper used by every provider wrapper. */
export class FetchClient {
  constructor(options?: { baseURL?: string; headers?: Record<string, string> } & RequestOptions);
  static defaults: { timeout: number; retries: number; retryDelay: number };
  /** Change the defaults for every FetchClient created afterwards. */
  static configure(options: Partial<{ timeout: number; retries: number; retryDelay: number }>): { timeout: number; retries: number; retryDelay: number };
  baseURL: string;
  defaultHeaders: Record<string, string>;
  setRequestOptions(options: RequestOptions): this;
  post<T = any>(endpoint: string, data?: any, extraConfig?: RequestOptions & { headers?: Record<string, string>; responseType?: 'json' | 'stream' | 'arraybuffer' | 'text' }): Promise<T>;
  get<T = any>(endpoint: string, extraConfig?: RequestOptions & { headers?: Record<string, string>; responseType?: 'json' | 'stream' | 'arraybuffer' | 'text' }): Promise<T>;
}

// ---------------------------------------------------------------------
// Wrappers (plain HTTP access to each provider)
// ---------------------------------------------------------------------

export class OpenAIWrapper {
  constructor(apiKey: string, customProxyHelper?: any);
  client: FetchClient;
  generateText(params: any): Promise<any>;
  generateChatText(params: any, functions?: any[] | null, function_call?: any): Promise<any>;
  generateGPT5Response(params: any): Promise<any>;
  generateImages(params: any): Promise<any>;
  getEmbeddings(params: any): Promise<any>;
  [method: string]: any;
}
export class OpenAICompatibleWrapper {
  constructor(apiKey: string | null | undefined, options?: { preset?: CompatiblePreset | null; baseUrl?: string; headers?: Record<string, string>; model?: string });
  static getPreset(name: string): { base: string; chat_model: string | null; embed_model: string | null; local?: boolean };
  static presets(): string[];
  API_BASE_URL: string;
  client: FetchClient;
  defaultModel: string | null;
  generateChatText(params: any): Promise<any>;
  getEmbeddings(params: any): Promise<any>;
  listModels(): Promise<string[]>;
}
export class AnthropicWrapper { constructor(apiKey: string); client: FetchClient; generateText(params: any): Promise<any>; streamText(params: any): Promise<any>; [method: string]: any; }
export class GeminiAIWrapper { constructor(apiKey: string); client: FetchClient; generateContent(params: any, vision?: boolean, model?: string | null): Promise<any>; getEmbeddings(params: any): Promise<any>; [method: string]: any; }
export class MistralAIWrapper { constructor(apiKey: string); client: FetchClient; generateText(params: any): Promise<any>; getEmbeddings(params: any): Promise<any>; [method: string]: any; }
export class CohereAIWrapper { constructor(apiKey: string); client: FetchClient; generateText(params: any): Promise<any>; generateChatText(params: any): Promise<any>; getEmbeddings(params: any): Promise<any>; [method: string]: any; }
export class NvidiaWrapper { constructor(apiKey: string, options?: { baseUrl?: string }); client: FetchClient; generateText(params: any): Promise<any>; generateTextStream(params: any): Promise<any>; generateRetrieval(params: any): Promise<any>; [method: string]: any; }
export class VLLMWrapper { constructor(baseUrl: string); client: FetchClient; generateText(params: any): Promise<any>; generateChatText(params: any): Promise<any>; getEmbeddings(texts: string[]): Promise<any>; [method: string]: any; }
export class GoogleAIWrapper { constructor(apiKey: string); [method: string]: any; }
export class StabilityAIWrapper { constructor(apiKey: string); [method: string]: any; }
export class HuggingWrapper { constructor(apiKey: string); generateText(modelId: string, data: any): Promise<any>; generateImage(modelId: string, data: any): Promise<any>; processImage(modelId: string, data: any): Promise<any>; [method: string]: any; }
export class ReplicateWrapper { constructor(apiKey: string); predict(modelTag: string, inputData: any): Promise<any>; getPredictionStatus(predictionId: string): Promise<any>; [method: string]: any; }
export class AWSEndpointWrapper { constructor(apiUrl: string, apiKey?: string | null); predict(inputData: any): Promise<any>; [method: string]: any; }
export class IntellicloudWrapper { constructor(apiKey: string, apiBase?: string | null); semanticSearch(queryText: string, k?: number, filters?: any): Promise<any>; [method: string]: any; }

// ---------------------------------------------------------------------
// Model Context Protocol
// ---------------------------------------------------------------------

export interface MCPTool {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: JsonSchema;
  [key: string]: any;
}
export interface MCPContentBlock { type: 'text' | 'image' | 'audio' | 'resource' | string; text?: string; data?: string; mimeType?: string; [key: string]: any }
export interface MCPToolResult {
  content: MCPContentBlock[];
  structuredContent?: any;
  isError: boolean;
  /** the text blocks joined with newlines */
  text: string;
}

export interface MCPClientOptions {
  /** Streamable HTTP endpoint */
  url?: string;
  headers?: Record<string, string>;
  /** stdio server command and arguments */
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  /** per request timeout (ms) */
  timeout?: number;
  probeTimeout?: number;
  name?: string;
  version?: string;
  debug?: boolean;
  onNotification?: (notification: any) => void;
}

/** MCP client for stdio and Streamable HTTP servers, current (2026-07-28) and legacy (2025-11-25) protocol eras. */
export class MCPClient implements ToolProvider {
  constructor(options: string | MCPClientOptions);
  /** { name: MCPClient } from an { mcpServers: {...} } configuration. */
  static fromConfig(config: Record<string, any>, defaults?: Partial<MCPClientOptions>): Record<string, MCPClient>;
  url: string | null;
  transport: 'stdio' | 'http';
  era: 'modern' | 'legacy' | null;
  protocolVersion: string | null;
  serverInfo: { name: string; version: string } | null;
  capabilities: Record<string, any> | null;
  instructions: string | null;
  tools: MCPTool[];
  /** Detect the protocol era, run the handshake and cache the tool list. */
  connect(): Promise<{ protocolVersion: string | null; serverInfo: any; capabilities: any; instructions: string | null; [key: string]: any }>;
  /** Connect and return the tool list. */
  initialize(): Promise<MCPTool[]>;
  close(): Promise<void>;
  /** The cached tool list (synchronous, as in 2.x). */
  listTools(): MCPTool[];
  /** Fetch every page of tools/list and cache it. */
  fetchTools(): Promise<MCPTool[]>;
  callTool(name: string, args?: Record<string, any>, options?: { timeout?: number }): Promise<MCPToolResult>;
  toChatTools(): ChatTool[];
  /** Fetch the tools from the server (as in 2.x). */
  getTools(): Promise<MCPTool[]>;
  getTool(toolName: string): MCPTool | null;
  getToolNames(): string[];
  hasTool(toolName: string): boolean;
}

export interface MCPServerTool extends MCPTool {
  handler: (args: any, context?: any) => any | Promise<any>;
}

/** MCP server for stdio and Streamable HTTP (Node only; not part of the browser bundle). */
export class MCPServer {
  constructor(options?: { name?: string; version?: string; instructions?: string | null; tools?: MCPServerTool[]; pageSize?: number; debug?: boolean });
  name: string;
  version: string;
  readonly serverInfo: { name: string; version: string };
  addTool(tool: MCPServerTool): this;
  handle(message: any, context?: { transport?: 'stdio' | 'http'; headers?: Record<string, string>; [key: string]: any }): Promise<any>;
  /** input and output default to process.stdin / process.stdout. */
  startStdio(options?: { input?: any; output?: any; exitOnClose?: boolean }): this;
  /** Resolves with the listening http.Server, extended with host, port, path and url. */
  startHttp(options?: { host?: string; port?: number; path?: string; allowedOrigins?: string[]; maxBodyBytes?: number }): Promise<{ host: string; port: number; path: string; url: string; address(): any; close(callback?: (error?: Error) => void): any; [key: string]: any }>;
  stop(): Promise<void>;
}
