import { Question } from "./types"
import Game from "./game"
import { randomPick, similar } from "./utils"

export interface PhraseList {
    phrases: string[][],
    corpus: string[],
}

// Take a set of phrase and convert it to a PhraseList
// The multiple choice options should be pooled from the entire set of words
// in the set of phrases
export const phrasesToPhraseList = function(phrases: string[]): PhraseList {
    const phrasesSplit = phrases.map((p) => p.split(" "))

    // Flatten and make a unique list of every word
    const corpus = phrasesSplit.flat().filter((value, index, self) => self.indexOf(value) === index)

    return {
      phrases: phrasesSplit,
      corpus
    }
}

export const questionFromPhraseList = function(phraseList: PhraseList,
    {answerCount, spaced}: {answerCount: number, spaced: boolean}): Question {
      const q: Question = {
          phrase: [],
          answers: [],
          spaced,
      }
      const phrasePick = randomPick(phraseList.phrases);
      for (let j=0; j < phrasePick.length; j++) {
          const corpus = phraseList.corpus
          const answers = similar(phrasePick[j], corpus, answerCount - 1).concat(phrasePick[j]).sort()
          q.phrase.push(phrasePick[j])
          q.answers.push(answers)
      }
      return q;
  }

export default class PhraseGame extends Game {
    readonly source: string
    readonly type: string
    readonly turns: number

    isReady: boolean
    phraseList: PhraseList

    constructor(source: string, {turns, spaced}: {turns: number, spaced: boolean}) {
        super()
        this.source = source
        this.type = 'phrases'
        this.turns = turns;
    }

    loadData(data): void {
        this.phraseList = phrasesToPhraseList(data['content'])
    }

    unloadData(): void {
        this.phraseList = null;
    }

    getQuestion(turnIdx: number): Question {
        return questionFromPhraseList(this.phraseList, {answerCount: 5, spaced: true})
    }

}