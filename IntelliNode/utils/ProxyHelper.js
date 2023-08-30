const config = require('../utils/Config2').getInstance();

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

  getOpenaiCompletion(model='') {
    if (this._openai_type == 'azure') {
        return this._openaiCompletion.replace('{deployment-id}', model).replace('{api-version}', '2023-06-01-preview');
    } else {
        return this._openaiCompletion;
    }

  }

  getOpenaiChat(model='') {
    if (this._openai_type == 'azure') {
        return this._openaiChatGPT.replace('{deployment-id}', model).replace('{api-version}', '2023-06-01-preview');
    } else {
        return this._openaiChatGPT;
    }
  }

  getOpenaiImage() {
    if (this._openai_type == 'azure') {
        return this._openaiImage.replace('{api-version}', '2023-06-01-preview');
    } else {
        return this._openaiImage;
    }
  }
  
  getOpenaiAudioTranscriptions() {
    if (this._openai_type == 'azure') {
        return this._openaiAudioTranscriptions.replace('{api-version}', '2023-06-01-preview');
    } else {
        return this._openaiAudioTranscriptions;
    }
  }

  getOpenaiEmbed(model='') {
    if (this._openai_type == 'azure') {
        return this._openaiEmbed.replace('{deployment-id}', model).replace('{api-version}', '2023-06-01-preview');
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
    this._openaiURL = proxySettings.url || config.getProperty('url.openai.base');
    this._openaiCompletion = proxySettings.completions || config.getProperty('url.openai.completions');
    this._openaiChatGPT = proxySettings.chatgpt || config.getProperty('url.openai.chatgpt');
    this._openaiImage = proxySettings.imagegenerate || config.getProperty('url.openai.imagegenerate');
    this._openaiEmbed = proxySettings.embeddings || config.getProperty('url.openai.embeddings');
    this._openaiOrg = proxySettings.organization || config.getProperty('url.openai.organization');
    this._openaiAudioTranscriptions = proxySettings.audiotranscriptions || config.getProperty('url.openai.audiotranscriptions');
    this._openai_type = 'openai';
    this._resourceName = '';
  }

  setAzureOpenai(resourceName) {
    if (!resourceName) {
        throw new Error("Set your azure resource name");
    }

    this._openaiURL = config.getProperty('url.azure_openai.base').replace('{resource-name}', resourceName);
    this._openaiCompletion = config.getProperty('url.azure_openai.completions');
    this._openaiChatGPT = config.getProperty('url.azure_openai.chatgpt');
    this._openaiImage = config.getProperty('url.azure_openai.imagegenerate');
    this._openaiEmbed = config.getProperty('url.azure_openai.embeddings');
    this._openai_type = 'azure';
    this._resourceName = resourceName;
  }

  setOriginOpenai() {
    this._openaiURL = config.getProperty('url.openai.base');
    this._openaiCompletion = config.getProperty('url.openai.completions');
    this._openaiChatGPT = config.getProperty('url.openai.chatgpt');
    this._openaiImage = config.getProperty('url.openai.imagegenerate');
    this._openaiEmbed = config.getProperty('url.openai.embeddings');
    this._openaiOrg = config.getProperty('url.openai.organization');
    this._openai_type = 'openai';
    this._resourceName = '';
  }

}

module.exports = ProxyHelper;