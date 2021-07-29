import { Question } from "./types";

export default abstract class Game {
    abstract readonly turns: number
    abstract readonly type: string
    abstract isReady: boolean     // when getQuestion is available
    state: string
    error: string

    abstract getQuestion(turnIdx: number): Question;

    constructor() {
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