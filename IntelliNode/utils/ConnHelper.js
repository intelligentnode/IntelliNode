/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class ConnHelper {
  constructor() {
  }

  static convertMapToJson(params) {
    return JSON.stringify(params);
  }

  static getErrorMessage(error) {
    if (!error || typeof error !== 'object') return String(error);
    if (error.response && error.response.data) {
      return `Unexpected HTTP response: ${error.response.status} Error details: ${JSON.stringify(error.response.data)}`;
    }
    return error.message;
  }

  /**
   * The error a wrapper rethrows: same message as before, keeping name (AbortError), code (ETIMEDOUT),
   * status and body from the HTTP layer, with the original error as cause.
   */
  static wrapError(error) {
    const wrapped = new Error(ConnHelper.getErrorMessage(error));
    if (error && typeof error === 'object') {
      if (error.name && error.name !== 'Error') wrapped.name = error.name;
      for (const key of ['code', 'status', 'body']) {
        if (error[key] !== undefined) wrapped[key] = error[key];
      }
      wrapped.cause = error;
    }
    return wrapped;
  }

  static readStream(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', err => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
  }

  static async lambdaSagemakerInputPass(internal_endpoint,
                                    event,
                                    client,
                                    InvokeEndpointCommand,
                                    log=false) {
    if (!event.body) {
        return {
            statusCode: 400,
            body: "Invalid input: " + JSON.stringify(event.body)
        };
    }
    let jsonString = "";
    if (typeof event.body === 'object') {
        jsonString = JSON.stringify(event.body);
    } else {
        jsonString = event.body;
    }

    const command = new InvokeEndpointCommand({
        EndpointName: internal_endpoint,
        ContentType: 'application/json',
        Body: jsonString,
        CustomAttributes: "accept_eula=true",
    });

    const response = await client.send(command);

    // Convert buffer to string
    const bodyString = Buffer.from(response.Body).toString('utf8');
    if (log) {
        console.log("Converted Response.Body: ", bodyString);
    }


    try {
        return {
            statusCode: 200,
            body: JSON.stringify(JSON.parse(bodyString))
        };

    } catch (error) {
        console.error("Parsing Error: ", error);
        throw error;
    }
  }
}

module.exports = ConnHelper;
