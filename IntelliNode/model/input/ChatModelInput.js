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
class ChatGPTMessage {
  constructor(content, role) {
    this.content = content;
    this.role = role;
  }

  isSystemRole() {
    return this.role === "system";
  }
}

class ChatModelInput {}

class ChatGPTInput extends ChatModelInput {
  constructor(systemMessage) {
    super();
    if (systemMessage instanceof ChatGPTMessage && systemMessage.isSystemRole()) {
      this.messages = [systemMessage];
    } else if (typeof systemMessage === "string") {
      this.messages = [new ChatGPTMessage(systemMessage, "system")];
    } else {
      throw new Error(
        "The input type should be system to define the chatbot theme or instructions."
      );
    }
    this.model = "gpt-3.5-turbo";
    this.temperature = 1;
    this.numberOfOutputs = 1;
    this.maxTokens = null;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  addUserMessage(prompt) {
    this.messages.push(new ChatGPTMessage(prompt, "user"));
  }

  cleanMessages() {
    if (this.messages.length > 1) {
      const firstMessage = this.messages[0];
      this.messages = [firstMessage];
    }
  }

  deleteLastMessage(message) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const currentMessage = this.messages[i];
      if (
        currentMessage.content === message.content &&
        currentMessage.role === message.role
      ) {
        this.messages.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  getChatGPTInput() {
    const messages = this.messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const params = {
      model: this.model,
      messages: messages,
      ...this.temperature && { temperature: this.temperature },
      ...this.numberOfOutputs && { n: this.numberOfOutputs },
      ...this.maxTokens && { max_tokens: this.maxTokens },
    };

    return params;
  }
}

module.exports = {
  ChatGPTInput,
  ChatModelInput,
  ChatGPTMessage,
};