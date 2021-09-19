import { GameState, Question } from "../game"
import { randomPick, similar } from "../utils"
import { TurnBasedGame, TurnBasedGameArgs, TurnBasedGameState } from "./turn_based_game"

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
    {answerCount, spaced}: {answerCount: number, spaced: boolean}, gameState: GameState): Question {
      const q: Question = {
          id: Date.now(),
          phrase: [],
          answers: [],
          spaced,
          wpm: gameState.wpm,
          fwpm: gameState.fwpm,
          freq: gameState.freq,
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

export class PhraseGameTurns extends TurnBasedGame {
    readonly type: string
    readonly turns: number
    readonly spaced: boolean

    isReady: boolean
    phraseList: PhraseList

    constructor({id, name, description, data, turns, spaced}: TurnBasedGameArgs) {
        super({id, name, description, data})
        this.type = 'phrases';
        this.turns = turns;
        this.spaced = spaced;
    }

    onData(data): void {
        this.phraseList = phrasesToPhraseList(data['content'])
        this.isReady = true;
    }

    unloadData(): void {
        this.phraseList = null;
    }

    getQuestion(gameState: TurnBasedGameState): [Question, TurnBasedGameState] {
        return [questionFromPhraseList(this.phraseList, {answerCount: 5, spaced: true}, gameState), gameState]
    }

}