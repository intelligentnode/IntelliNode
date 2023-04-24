/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
const fs = require('fs');

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
      fs.writeFileSync(filePath, decodedAudio);
      return true;
    } catch (error) {
      if (this.isLog) console.error(error);
      return false;
    }
  }
}

module.exports = AudioHelper;
