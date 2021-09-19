
import { GameState, Question } from "../game"
import { randomPick, similar } from "../utils"
import { RufzxpGame } from "./rufzxp_game"
import { StreakBasedGame, StreakBasedGameArgs } from "./streak_game"
import { TurnBasedGame, TurnBasedGameArgs, TurnBasedGameState } from "./turn_based_game"

export interface WordList {
    words: string[],
}

// Take a set of phrase and convert it to a PhraseList
// The multiple choice options should be pooled from the entire set of words
// in the set of phrases
export const wordsToPhraseList = function(wordList: string[]): WordList {
    // Make unique list of every word
    const words = wordList.filter((value, index, self) => self.indexOf(value) === index)

    return {
      words
    }
}

export const questionFromWordList = function(wordList: WordList,
    {answerCount, spaced, phraseWordCount}: {answerCount: number, spaced: boolean, phraseWordCount: number}, gameState: GameState): Question {
      const q: Question = {
          id: Date.now(),
          phrase: [],
          answers: [],
          spaced,
          wpm: gameState.wpm,
          fwpm: gameState.fwpm,
          freq: gameState.freq,
      }
      const wordPicks = []
      for (let i=0; i < phraseWordCount; i++) {
        const wordPick = randomPick(wordList.words);
        const answers = similar(wordPick, wordList.words, answerCount - 1).concat(wordPick).sort()
        q.phrase.push(wordPick)
        q.answers.push(answers)
      }
      return q;
  }


interface WordGameArgs extends TurnBasedGameArgs {
    phraseWordCount: number
}

export class WordGameTurns extends TurnBasedGame {
    readonly type: string
    readonly turns: number
    readonly spaced: boolean
    readonly phraseWordCount: number

    isReady: boolean
    wordList: WordList

    constructor({id, name, description, data, turns, spaced, phraseWordCount}: WordGameArgs) {
        super({id, name, description, data})
        this.type = 'words';
        this.turns = turns;
        this.spaced = spaced;
        this.phraseWordCount = phraseWordCount;
    }

    onData(data): void {
        this.wordList = wordsToPhraseList(data['content'])
        this.isReady = true;
    }

    unloadData(): void {
        this.wordList = null;
    }

    getQuestion(gameState: TurnBasedGameState): [Question, TurnBasedGameState] {
        return [questionFromWordList(this.wordList, {answerCount: 5, spaced: true, phraseWordCount: this.phraseWordCount}, gameState), gameState]
    }

}

export class WordGameRufzxp extends RufzxpGame {
    readonly type: string
    readonly turns: number
    readonly spaced: boolean
    readonly phraseWordCount: number

    isReady: boolean
    wordList: WordList

    constructor({id, name, description, data, turns, spaced, phraseWordCount}: WordGameArgs) {
        super({id, name, description, data})
        this.type = 'words';
        this.turns = turns;
        this.spaced = spaced;
        this.phraseWordCount = phraseWordCount;
    }

    onData(data): void {
        this.wordList = wordsToPhraseList(data['content'])
        this.isReady = true;
    }

    unloadData(): void {
        this.wordList = null;
    }

    getQuestion(gameState: TurnBasedGameState): [Question, TurnBasedGameState] {
        return [questionFromWordList(this.wordList, {answerCount: 5, spaced: true, phraseWordCount: this.phraseWordCount}, gameState), gameState]
    }


}

interface WordGameStreakArgs extends StreakBasedGameArgs {
    lives: number
    phraseWordCount: number
}

export class WordGameStreak extends StreakBasedGame {
    readonly type: string
    readonly lives: number
    readonly spaced: boolean
    readonly phraseWordCount: number

    isReady: boolean
    wordList: WordList


    constructor({id, name, description, lives, phraseWordCount, data}: WordGameStreakArgs) {
        super({id, name, description, data})
        this.type = 'words';
        this.lives = lives;
        this.phraseWordCount = phraseWordCount;
    }

    onData(data): void {
        this.wordList = wordsToPhraseList(data['content'])
        this.isReady = true;
    }

    unloadData(): void {
        this.wordList = null;
    }

    getQuestion(gameState: TurnBasedGameState): [Question, TurnBasedGameState] {
        return [questionFromWordList(this.wordList, {answerCount: 5, spaced: true, phraseWordCount: this.phraseWordCount}, gameState), gameState]
    }


}