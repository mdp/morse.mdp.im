import { Highscore } from "./highscore_storage";

export interface GameSettings {
    wpm: number
    fwpm: number
    freq: number
}

// Represents a single question
export interface Question {
    id: number
    spaced: boolean
    phrase: string[]
    answers: string[][]
    wpm: number
    fwpm: number
    freq: number
}
export interface GameState {
    turnIdx: number
    score: number
    charactersDecoded: number
    progress: string
    isComplete: boolean
    wpm: number
    fwpm: number
    freq: number
}

export interface Answer {
    selected: string
    actual: string
    elapsed: number
}

export interface DefaultGameArgs {
    id: string
    name: string
    description: string
}

export default abstract class Game {
    readonly id: string
    readonly name: string
    readonly description: string
    abstract readonly type: string
    abstract isReady: boolean     // when getQuestion is available
    state: string
    error: string

    abstract getInitialState(GameSettings): GameState;
    abstract getQuestion(gamState: GameState): [question: Question, state: GameState];
    abstract onAnswer(answers: Answer[], gameState: GameState): GameState;
    abstract getFinalScore(gameState: GameState): [hs: Highscore, charactersDecoded: number];

    constructor({id, name, description}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.state = "empty"
        this.error = null
    }

    load(done: (err?: any) => void): void {
    }

    unload(): void {
        this.isReady = false;
        this.state = 'empty';
    }

}
