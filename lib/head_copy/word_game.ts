
import { Question } from "./types"
import Game from "./game"
import { randomPick, similar } from "./utils"
import { phrasesToPhraseList } from "./phrase_game"

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
    {answerCount, spaced, phraseWordCount}: {answerCount: number, spaced: boolean, phraseWordCount: number}): Question {
      const q: Question = {
          phrase: [],
          answers: [],
          spaced,
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

export default class WordGame extends Game {
    readonly source: string
    readonly type: string
    readonly turns: number
    readonly phraseWordCount: number

    isReady: boolean
    wordList: WordList

    constructor(source: string, {turns, spaced, phraseWordCount}: {turns: number, spaced: boolean, phraseWordCount: number}) {
        super()
        this.type = 'words'
        this.source = source
        this.turns =  turns;
        this.phraseWordCount = phraseWordCount;
    }

    loadData(data): void {
        this.wordList = wordsToPhraseList(data['content'])
    }

    unloadData(): void {
        this.wordList = null;
    }

    getQuestion(turnIdx: number): Question {
        return questionFromWordList(this.wordList, {answerCount: 5, spaced: true, phraseWordCount: this.phraseWordCount})
    }

}