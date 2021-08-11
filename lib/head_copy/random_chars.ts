import { Question } from "./types";
import Game from "./game";
import { randomChar, shuffle_array as shuffleArray } from "./utils";

export const letters="abcdefghijklmnopqrstuvwxyz";

const evilSwaps = {
    "a": "n",
    "b": "dvu",
    "c": "kqy",
    "d": "bu",
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
    "0": "91",
    "1": "9",
    "2": "3",
    "3": "2",
    "4": "59",
    "5": "4",
    "6": "1",
    "7": "3",
    "8": "7",
    "9": "40",
}

function getSwapMasks(power: number): number[] {
    const maskCount = Math.pow(2, power)
    const masks = []
    
    // Leave off the first mask (no changes, eg. "0000")
    for (let i=1; i<maskCount; i++) {
        masks.push(i);
    }
    shuffleArray(masks)
    return masks
}

// Get a mask from the int padded to the desired length
function intToMask(i: number, len: number): number[] {
    const binArr = i.toString(2).split("").map((m) => parseInt(m,10))
    for (let j = binArr.length; j < len; j++) {
        binArr.unshift(0)
    }
    return binArr
}



function evilSwap(str: string, maskArr: number[]): string[] {
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
    const strLen = str.length
    const masks = getSwapMasks(strLen)
    const answers = []
    for (let k=0; k < 4; k++) {
        const currentMask = masks[k];
        answers.push(evilSwap(str, intToMask(currentMask, strLen)).join(""))
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

function buildQuestionRandomGroup({spaced, length}: {spaced: boolean, length: number}): Question {
    const pick = getGroup(length)
    const answers = getAnswers(pick)
    const q: Question = {
        phrase: [pick],
        answers:[answers],
        spaced,
    }
    return q
}


// TODO: Allow for character and numbers at some point (and maybe symbols)
export default class RandomChars extends Game {
    readonly type: string
    readonly turns: number
    readonly length: number
    isReady: boolean

    constructor({turns, length}: {turns: number, length: number}) {
        super()
        this.type = 'random';
        this.turns = turns;
        this.length = length;
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
        return buildQuestionRandomGroup({spaced: false, length: this.length})
    }

}