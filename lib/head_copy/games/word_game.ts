
import { GameState, Question } from "../game"
import { randomPick, similar } from "../utils"
import { TurnBasedGameArgs, TurnBasedGameFetch, TurnBasedGameState } from "./turn_based_game"

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

export class WordGameTurns extends TurnBasedGameFetch {
    readonly source: string
    readonly type: string
    readonly turns: number
    readonly spaced: boolean
    readonly phraseWordCount: number

    isReady: boolean
    wordList: WordList

    constructor({id, name, description, source, turns, spaced, phraseWordCount}: WordGameArgs) {
        super({id, name, description})
        this.source = source
        this.type = 'phrases';
        this.turns = turns;
        this.spaced = spaced;
        this.phraseWordCount = phraseWordCount;
    }

    loadData(data): void {
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