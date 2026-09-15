// controllers
const {
  RemoteLanguageModel,
  SupportedLangModels,
} = require('./controller/RemoteLanguageModel');
const {
  RemoteImageModel,
  SupportedImageModels,
} = require('./controller/RemoteImageModel');
const {
  RemoteFineTuneModel,
  SupportedFineTuneModels,
} = require('./controller/RemoteFineTuneModel');
const {
  RemoteSpeechModel,
  SupportedSpeechModels,
} = require('./controller/RemoteSpeechModel');
const {
  RemoteEmbedModel,
  SupportedEmbedModels,
} = require('./controller/RemoteEmbedModel');
// functions
const {
  Chatbot,
  SupportedChatModels,
} = require('./function/Chatbot');
const { SemanticSearch } = require('./function/SemanticSearch');
const {
  SemanticSearchPaging,
} = require('./function/SemanticSearchPaging');
const { TextAnalyzer } = require('./function/TextAnalyzer');
const { Gen } = require('./function/Gen');
// Node only: the browser bundle maps these modules to empty objects (package.json "browser")
const { CodingAgent } = require('./function/CodingAgent');
const WorkspaceToolkitModule = require('./utils/WorkspaceToolkit');
const WorkspaceToolkit = typeof WorkspaceToolkitModule === 'function' ? WorkspaceToolkitModule : undefined;

// inputs
const LanguageModelInput = require('./model/input/LanguageModelInput');
const ImageModelInput = require('./model/input/ImageModelInput');
const Text2SpeechInput = require('./model/input/Text2SpeechInput');
const {
  ChatGPTInput,
  ChatLLamaInput,
  LLamaReplicateInput,
  ChatGPTMessage,
  LLamaSageInput,
  CohereInput,
  MistralInput,
  GeminiInput,
  AnthropicInput,
  NvidiaInput,
  VLLMInput,
  OpenAICompatibleInput
} = require('./model/input/ChatModelInput');
const FunctionModelInput = require('./model/input/FunctionModelInput');
const EmbedInput = require('./model/input/EmbedInput');
const FineTuneInput = require('./model/input/FineTuneInput');
// wrappers
const CohereAIWrapper = require('./wrappers/CohereAIWrapper');
const GoogleAIWrapper = require('./wrappers/GoogleAIWrapper');
const OpenAIWrapper = require('./wrappers/OpenAIWrapper');
const StabilityAIWrapper = require('./wrappers/StabilityAIWrapper');
const HuggingWrapper = require('./wrappers/HuggingWrapper');
const ReplicateWrapper = require('./wrappers/ReplicateWrapper');
const AWSEndpointWrapper = require('./wrappers/AWSEndpointWrapper');
const IntellicloudWrapper = require('./wrappers/IntellicloudWrapper');
const MistralAIWrapper = require('./wrappers/MistralAIWrapper');
const GeminiAIWrapper = require('./wrappers/GeminiAIWrapper');
const AnthropicWrapper = require('./wrappers/AnthropicWrapper');
const NvidiaWrapper = require('./wrappers/NvidiaWrapper');
const VLLMWrapper = require('./wrappers/VLLMWrapper');
const OpenAICompatibleWrapper = require('./wrappers/OpenAICompatibleWrapper');
// utils
const { LLMEvaluation } = require('./utils/LLMEvaluation');
const AudioHelper = require('./utils/AudioHelper');
const ConnHelper = require('./utils/ConnHelper');
const MatchHelpers = require('./utils/MatchHelpers');
const SystemHelper = require('./utils/SystemHelper');
const Prompt = require('./utils/Prompt');
const ProxyHelper = require('./utils/ProxyHelper');
const { GPTStreamParser, CohereStreamParser, VLLMStreamParser, AnthropicStreamParser } = require('./utils/StreamParser');
const ModelHelper = require('./utils/ModelHelper');
const ChatContext = require('./utils/ChatContext');
const MCPClient = require('./utils/MCPClient');
// Node only: the browser bundle maps this module to an empty object (package.json "browser")
const { MCPServer } = require('./mcp/server');
const FetchClient = require('./utils/FetchClient');
const OutputParser = require('./utils/OutputParser');

module.exports = {
  RemoteLanguageModel,
  SupportedLangModels,
  LanguageModelInput,
  RemoteImageModel,
  SupportedImageModels,
  ImageModelInput,
  RemoteSpeechModel,
  SupportedSpeechModels,
  Text2SpeechInput,
  CohereAIWrapper,
  GoogleAIWrapper,
  OpenAIWrapper,
  StabilityAIWrapper,
  AudioHelper,
  ConnHelper,
  Chatbot,
  SupportedChatModels,
  ChatGPTInput,
  ChatLLamaInput,
  LLamaReplicateInput,
  ChatGPTMessage,
  EmbedInput,
  MatchHelpers,
  RemoteEmbedModel,
  SupportedEmbedModels,
  SemanticSearch,
  SystemHelper,
  TextAnalyzer,
  HuggingWrapper,
  ReplicateWrapper,
  Gen,
  ProxyHelper,
  FunctionModelInput,
  AWSEndpointWrapper,
  Prompt,
  LLamaSageInput,
  LLMEvaluation,
  SemanticSearchPaging,
  GPTStreamParser,
  CohereStreamParser,
  ChatContext,
  CohereInput,
  IntellicloudWrapper, 
  MistralAIWrapper,
  MistralInput,
  RemoteFineTuneModel,
  SupportedFineTuneModels,
  FineTuneInput,
  GeminiInput,
  GeminiAIWrapper,
  AnthropicInput,
  AnthropicWrapper,
  NvidiaInput,
  NvidiaWrapper,
  VLLMWrapper,
  VLLMInput,
  VLLMStreamParser,
  AnthropicStreamParser,
  ModelHelper,
  MCPClient,
  MCPServer,
  CodingAgent,
  WorkspaceToolkit,
  OpenAICompatibleWrapper,
  OpenAICompatibleInput,
  FetchClient,
  OutputParser
};
