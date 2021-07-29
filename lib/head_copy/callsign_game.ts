import { Question } from "./types";
import GameFetch from "./game_fetch";
import { randomPick, similar } from "./utils";

// Represents all the possible phrases and and answer corpus for each column
export interface CallList {
    phrases: string[][],
    corpus: string[][],
}

// Split call into 2 parts, with the number always in the first half
// A4BCD => [A4, BCD]
// AB4CD => [AB4, CD]
// AB4CDE => [AB4, CDE]
function splitCall(call: string) {
    const callSplit = [];
    // 5/2 => 2.5 => 2
    // call.slice(0,2)
    let callLen = call.length
    let splitAt = Math.floor(callLen / 2)
    if (callLen % 2 === 1 && isNaN(parseInt(call.charAt(splitAt - 1)))) {
        splitAt = splitAt + 1
    }
    return [call.substr(0, splitAt), call.substr(splitAt, callLen)]
}

function buildCallsignQuestionPool(callSigns: string[]): CallList {
    const phrases = callSigns.map((c) => splitCall(c))
    const corpus = [[]]

    for (let i = 0; i < 2; i++) {
        const phraseArr = phrases.map((p) => p[i])
        corpus[i] = phraseArr.filter((value, index, self) => self.indexOf(value) === index)
    }

    return {
        phrases,
        corpus
    }
}

function buildQuestionFromCallList(callList: CallList,
    { answerCount, spaced }: { answerCount: number, spaced: boolean }): Question {
    const q: Question = {
        phrase: [],
        answers: [],
        spaced,
    }
    const phrasePick = randomPick(callList.phrases);
    const phraseLen = phrasePick.length
    for (let j = 0; j < phraseLen; j++) {
        const corpus = callList.corpus[j].filter((p) => p.length === phrasePick[j].length)
        const answers = similar(phrasePick[j], corpus, answerCount - 1).concat(phrasePick[j]).sort()
        q.phrase.push(phrasePick[j])
        q.answers.push(answers)
    }
    return q;
}

export default class CallSignGame extends GameFetch {
    readonly source: string
    readonly type: string
    readonly turns: number

    isReady: boolean
    callList: CallList

    constructor(source: string, {turns, spaced}: {turns: number, spaced: boolean}) {
        super()
        this.source = source
        this.type = 'calls';
        this.turns = turns;
    }

    loadData(data): void {
        console.log(data)
        this.callList = buildCallsignQuestionPool(data['content'])
    }

    unloadData(): void {
        this.callList = null;
    }

    getQuestion(turnIdx: number): Question {
        return buildQuestionFromCallList(this.callList, {answerCount: 5, spaced: false})
    }

}