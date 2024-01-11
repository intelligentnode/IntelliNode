/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
const FileHelper = require('./FileHelper')

class AudioHelper {
  constructor() {
    this.isLog = true;
  }

  decode(audioContent) {
    const buff = Buffer.from(audioContent, 'base64');
    return buff;
  }

  saveAudio(decodedAudio, directory, fileName) {
    if (!fileName.endsWith('.mp3') && !fileName.endsWith('.wav')) {
      if (this.isLog) console.error('Unsupported audio format: send mp3 or wav');
      return false;
    }

    try {
      const filePath = `${directory}/${fileName}`;
      FileHelper.writeDataToFile(filePath, decodedAudio);
      return true;
    } catch (error) {
      if (this.isLog) console.error(error);
      return false;
    }
  }
}

module.exports = AudioHelper;
