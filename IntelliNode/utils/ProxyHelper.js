const config = require('../utils/Config2').getInstance();

class ProxyHelper {
  constructor() {
    this._openaiURL = config.getProperty('url.openai.base');
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

  setOpenaiURL(url) {
    this._openaiURL = url;
  }

}

module.exports = ProxyHelper;