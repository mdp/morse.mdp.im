import levenshteinDistance from "../levenshtein";

// Represents a single question
export interface Question {
    spaced: boolean,
    phrase: string[],
    answers: string[][],
}

// The actual game data, everything needed to run a game
export interface GameData {
  wordPhraseLength?: number, // For building phrases from wordList
  spaced?: boolean,
  description: string,
  turns: number,
  source: string,
  type: string, 
  title: string, 
}
