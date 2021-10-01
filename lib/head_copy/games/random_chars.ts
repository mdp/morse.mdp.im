import { randomChar, shuffle_array as shuffleArray } from "../utils";
import { DefaultGameArgs, GameState, Question } from "../game";
import { TurnBasedGame, TurnBasedGameState } from "./turn_based_game";
import { StreakBasedGame } from "./streak_game";
import { RufzxpGame } from "./rufzxp_game";
import { swaps as morseSwaps } from '../../morse'

export const LETTERS = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export const COMMON_SYMBOLS = "/.,?";

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
// e.g. (3, 4) => [0,0,1,1]
function intToMask(i: number, len: number): number[] {
    const binArr = i.toString(2).split("").map((m) => parseInt(m,10))
    for (let j = binArr.length; j < len; j++) {
        binArr.unshift(0)
    }
    return binArr
}

function evilSwap(str: string, charSet: string, maskArr: number[]): string[] {
    const result = []
    for (let j=0; j < maskArr.length; j++) {
        if (maskArr[j] === 1) {
            // Ensure we only swap with characters in the charset
            const swap = (morseSwaps[str[j]] || []).filter((s) => charSet.includes(s))
            if (swap.length > 0) {
                result.push(randomChar(swap))
            } else {
                // Avoid randoming picking the same character
                result.push(randomChar(charSet.replace(str[j], '')))
            }
        } else {
            result.push(str[j])
        }
    }
    return result
}

function getAnswers(str: string, charSet: string): string[] {
    const strLen = str.length
    const masks = getSwapMasks(strLen)
    const answers = []
    for (let k=0; k < 4; k++) {
        const currentMask = masks[k];
        answers.push(evilSwap(str, charSet, intToMask(currentMask, strLen)).join(""))
    }
    answers.push(str)
    return answers
}

function getGroup(length: number, charSet: string): string {
    const group = []
    for (let i=0; i<length; i++) {
        group.push(randomChar(charSet))
    }
    return group.join("")
}

function buildQuestionRandomGroup({spaced, length, charSet}: {spaced: boolean, length: number, charSet: string}, gameState: GameState): Question {
    const pick = getGroup(length, charSet)
    const answers = getAnswers(pick, charSet)
    const q: Question = {
        id: Date.now(),
        phrase: [pick],
        answers:[answers],
        spaced,
        wpm: gameState.wpm,
        fwpm: gameState.fwpm,
        freq: gameState.freq,
    }
    return q
}

interface RandomCharsArgs extends DefaultGameArgs {
    turns: number
    length: number
    charSet: string
}

// TODO: Allow for character and numbers at some point (and maybe symbols)
export class RandomCharsTurns extends TurnBasedGame {
    readonly type: string
    readonly charSet: string
    readonly turns: number
    readonly length: number
    isReady: boolean

    constructor({id, name, description, turns, length, charSet}: RandomCharsArgs) {
        super({id, name, description})
        this.type = 'random';
        this.turns = turns;
        this.length = length;
        this.charSet = charSet;
        this.isReady = true;
    }

    getQuestion(gameState: TurnBasedGameState): [Question, TurnBasedGameState] {
        return [buildQuestionRandomGroup({spaced: false, length: this.length, charSet: this.charSet}, gameState), gameState]
    }

}

interface RandomCharsStreakArgs extends DefaultGameArgs {
    lives: number
    length: number
    charSet: string
}

export class RandomCharsStreak extends StreakBasedGame {
    readonly type: string
    readonly charSet: string
    readonly lives: number
    readonly length: number
    isReady: boolean

    constructor({id, name, description, lives, length, charSet}: RandomCharsStreakArgs) {
        super({id, name, description})
        this.type = 'random';
        this.lives = lives;
        this.length = length;
        this.charSet = charSet;
        this.isReady = true;
    }

    getQuestion(gameState: GameState): [Question, GameState] {
        return [buildQuestionRandomGroup({spaced: false, length: this.length, charSet: this.charSet}, gameState), gameState]
    }

}

export class RandomCharsRufzxp extends RufzxpGame {
    readonly type: string
    readonly charSet: string
    readonly turns: number
    readonly length: number
    isReady: boolean

    constructor({id, name, description, turns, length, charSet}: RandomCharsArgs) {
        super({id, name, description})
        this.type = 'random';
        this.turns = turns;
        this.length = length;
        this.charSet = charSet;
        this.isReady = true;
    }

    getQuestion(gameState: GameState): [Question, GameState] {
        return [buildQuestionRandomGroup({spaced: false, length: this.length, charSet: this.charSet}, gameState), gameState]
    }

}