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
class Text2SpeechInput {
  constructor({text, language = "en-gb", gender = "FEMALE"}) {
    this.text = text;
    this.language = language.toLowerCase();
    this.gender = gender;
  }

  getGoogleInput() {
    const params = {
      text: this.text,
      languageCode: this.language,
    };

    if (this.language === "en-gb" || this.language === "en" ) {
      params.name = this.gender === "FEMALE" ? "en-GB-Standard-A" : "en-GB-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "tr-tr" || this.language === "tr" ) {
      params.name = this.gender === "FEMALE" ? "tr-TR-Standard-A" : "tr-TR-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "cmn-cn" || this.language === "cn" ) {
      params.name = this.gender === "FEMALE" ? "cmn-CN-Standard-A" : "cmn-CN-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "de-de" || this.language === "de" ) {
      params.name = this.gender === "FEMALE" ? "de-DE-Standard-A" : "de-DE-Standard-B";
      params.ssmlGender = this.gender;
    } else if (this.language === "ar-xa" || this.language === "ar" ) {
      params.name = this.gender === "FEMALE" ? "ar-XA-Wavenet-A" : "ar-XA-Standard-B";
      params.ssmlGender = this.gender;
    } else {
      throw new Error("Unsupported language code: " + this.language);
    }

    return params;
  }
}

Text2SpeechInput.Gender = {
  FEMALE: "FEMALE",
  MALE: "MALE",
};

module.exports = Text2SpeechInput;
