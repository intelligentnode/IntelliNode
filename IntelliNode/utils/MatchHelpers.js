/*
Apache License

Copyright 2023 Github.com/Barqawiz/IntelliNode

   Licensed under the Apache License, Version 2.0 (the "License");
*/
class MatchHelpers {
  
  static cosineSimilarity(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));

    return dotProduct / (magnitudeA * magnitudeB);
  }

  static euclideanDistance(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    const distance = Math.sqrt(
      a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0)
    );

    return distance;
  }

  static manhattanDistance(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have the same dimensions');
    }

    const distance = a.reduce((sum, ai, i) => sum + Math.abs(ai - b[i]), 0);

    return distance;
  }

}

module.exports = MatchHelpers;