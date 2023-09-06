const config = require('../config.json');

class ProxyHelper {
  constructor() {
    this.setOriginOpenai();
  }

  static getInstance() {
    if (!ProxyHelper.instance) {
      ProxyHelper.instance = new ProxyHelper();
    }
    return ProxyHelper.instance;
  }

  getOpenaiURL() {
    return this._openaiURL;
  }

  getOpenaiCompletion(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiCompletion
        .replace('{deployment-id}', model)
        .replace('{api-version}', '2023-06-01-preview');
    } else {
      return this._openaiCompletion;
    }
  }

  getOpenaiChat(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiChatGPT
        .replace('{deployment-id}', model)
        .replace('{api-version}', '2023-06-01-preview');
    } else {
      return this._openaiChatGPT;
    }
  }

  getOpenaiImage() {
    if (this._openai_type == 'azure') {
      return this._openaiImage.replace(
        '{api-version}',
        '2023-06-01-preview'
      );
    } else {
      return this._openaiImage;
    }
  }

  getOpenaiAudioTranscriptions() {
    if (this._openai_type == 'azure') {
      return this._openaiAudioTranscriptions.replace(
        '{api-version}',
        '2023-06-01-preview'
      );
    } else {
      return this._openaiAudioTranscriptions;
    }
  }

  getOpenaiEmbed(model = '') {
    if (this._openai_type == 'azure') {
      return this._openaiEmbed
        .replace('{deployment-id}', model)
        .replace('{api-version}', '2023-06-01-preview');
    } else {
      return this._openaiEmbed;
    }
  }

  getOpenaiType() {
    return this._openai_type;
  }

  getOpenaiResource() {
    return this._resourceName;
  }

  setOpenaiURL(url) {
    this._openaiURL = url;
  }

  getOpenaiOrg() {
    return this._openaiOrg ? this._openaiOrg : null;
  }

  setOpenaiOrg(organization) {
    this._openaiOrg = organization;
  }

  setOpenaiProxyValues(proxySettings) {
    this._openaiURL = proxySettings.url || config.url.openai.base;
    this._openaiCompletion =
      proxySettings.completions || config.url.openai.completions;
    this._openaiChatGPT =
      proxySettings.chatgpt || config.url.openai.chatgpt;
    this._openaiImage =
      proxySettings.imagegenerate || config.url.openai.imagegenerate;
    this._openaiEmbed =
      proxySettings.embeddings || config.url.openai.embeddings;
    this._openaiOrg =
      proxySettings.organization || config.url.openai.organization;
    this._openaiAudioTranscriptions =
      proxySettings.audiotranscriptions ||
      config.url.openai.audiotranscriptions;
    this._openai_type = 'openai';
    this._resourceName = '';
  }

  setAzureOpenai(resourceName) {
    if (!resourceName) {
      throw new Error('Set your azure resource name');
    }

    this._openaiURL = config.url.azure_openai.base.replace(
      '{resource-name}',
      resourceName
    );
    this._openaiCompletion = config.url.azure_openai.completions;
    this._openaiChatGPT = config.url.azure_openai.chatgpt;
    this._openaiImage = config.url.azure_openai.imagegenerate;
    this._openaiEmbed = config.url.azure_openai.embeddings;
    this._openai_type = 'azure';
    this._resourceName = resourceName;
  }

  setOriginOpenai() {
    this._openaiURL = config.url.openai.base;
    this._openaiCompletion = config.url.openai.completions;
    this._openaiChatGPT = config.url.openai.chatgpt;
    this._openaiImage = config.url.openai.imagegenerate;
    this._openaiEmbed = config.url.openai.embeddings;
    this._openaiOrg = config.url.openai.organization;
    this._openaiAudioTranscriptions =
      config.url.openai.audiotranscriptions;
    this._openai_type = 'openai';
    this._resourceName = '';
  }
}

module.exports = ProxyHelper;
