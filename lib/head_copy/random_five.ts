import { Question } from "./types";
import Game from "./game";
import { randomChar, shuffle_array } from "./utils";

export const letters="abcdefghijklmnopqrstuvwxyz";

const evilSwaps = {
    "a": "n",
    "b": "dvu",
    "c": "kqy",
    "d": "bud",
    "e": "it",
    "f": "l",
    "g": "z",
    "h": "si",
    "i": "s",
    "j": "po",
    "k": "cr",
    "l": "f",
    "m": "no",
    "n": "m",
    "o": "mj",
    "p": "rj",
    "q": "cy",
    "r": "kw",
    "s": "ih",
    "t": "em",
    "u": "vd",
    "v": "bu",
    "w": "rj",
    "x": "b",
    "y": "qc",
    "z": "g",
}

const swapMasks = ["10101",
             "01010",
             "10100",
             "01011",
             "11010",
             "00101",
]



function evilSwap(str: string, mask: string): string[] {
    const maskArr = mask.split("").map((m) => parseInt(m, 10))
    const result = []
    for (let j=0; j < maskArr.length; j++) {
        if (maskArr[j] === 1) {
            const swap = evilSwaps[str[j]]
            if (swap) {
                result.push(randomChar(swap))
            } else {
                result.push(randomChar(letters))
            }
        } else {
            result.push(str[j])
        }
    }
    return result
}

function getAnswers(str: string): string[] {
    const masks = shuffle_array(swapMasks)
    const answers = []
    for (let k=0; k < 4; k++) {
        const currentMask = masks[k];
        answers.push(evilSwap(str, currentMask).join(""))
    }
    answers.push(str)
    return answers
}

function getGroup(length: number): string {
    const group = []
    for (let i=0; i<length; i++) {
        group.push(randomChar(letters))
    }
    return group.join("")
}

function buildQuestionRandomGroup({spaced}: {spaced: boolean}): Question {
    const pick = getGroup(5)
    const answers = getAnswers(pick)
    const q: Question = {
        phrase: [pick],
        answers:[answers],
        spaced,
    }
    return q
}


// Could be vastly improved to support variable size, but good enough for now for testing
export default class RandomFive extends Game {
    readonly characters: string[]
    readonly type: string
    readonly turns: number
    isReady: boolean

    constructor({turns}: {turns: number}) {
        super()
        this.type = 'random';
        this.turns = turns;
        this.isReady = true;
    }

    load(): void {
        return
    }

    loadData(data): void {
        return
    }

    unloadData(): void {
        return
    }

    getQuestion(turnIdx: number): Question {
        return buildQuestionRandomGroup({spaced: false})
    }

}