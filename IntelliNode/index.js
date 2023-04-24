// controllers
const { RemoteLanguageModel, SupportedLangModels } = require('./controller/RemoteLanguageModel');
const { RemoteImageModel, SupportedImageModels } = require('./controller/RemoteImageModel');
const { RemoteSpeechModel, SupportedSpeechModels } = require('./controller/RemoteSpeechModel');
// functions
const { Chatbot, SupportedChatModels } = require('./function/Chatbot');
// inputs
const LanguageModelInput = require('./model/input/LanguageModelInput');
const ImageModelInput = require('./model/input/ImageModelInput');
const Text2SpeechInput = require('./model/input/Text2SpeechInput');
const { ChatGPTInput, ChatGPTMessage } = require("./model/input/ChatModelInput");
// wrappers
const CohereAIWrapper = require('./wrappers/CohereAIWrapper');
const GoogleAIWrapper = require('./wrappers/GoogleAIWrapper');
const OpenAIWrapper = require('./wrappers/OpenAIWrapper');
const StabilityAIWrapper = require('./wrappers/StabilityAIWrapper');
// utils
const AudioHelper = require('./utils/AudioHelper');
const Config2 = require('./utils/Config2');
const ConnHelper = require('./utils/ConnHelper');

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
  Config2,
  ConnHelper,
  Chatbot,
  SupportedChatModels,
  ChatGPTInput,
  ChatGPTMessage
};
