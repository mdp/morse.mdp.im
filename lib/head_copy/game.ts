import { Highscore } from "./highscore_storage";

export interface GameSettings {
    wpm: number
    fwpm: number
    freq: number
    preDelay: number
}

// Represents a single question
export interface Question {
    id: number
    spaced: boolean
    phrase: string[]
    answers: string[][]
    gameSettings: GameSettings
}

export interface GameState {
    score: number
    charactersDecoded: number
    progress: string
    isComplete: boolean
    gameSettings: GameSettings
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
    data?: AsyncData
}

// "interface merging" to allow for a optional class property
interface Game {
    settingsAllowed?: string[]
}

abstract class Game {
    readonly id: string
    readonly name: string
    readonly description: string
    abstract readonly type: string
    abstract isReady: boolean     // when getQuestion is available
    state: string
    error: string
    source: string | null
    data: AsyncData | null

    abstract getInitialState(GameSettings): GameState;
    abstract getQuestion(gamState: GameState): [question: Question, state: GameState];
    abstract onAnswer(answers: Answer[], gameState: GameState): GameState;
    abstract getFinalScore(gameState: GameState): [hs: Highscore, charactersDecoded: number];

    constructor({id, name, description, data}: DefaultGameArgs) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.data = null
        if (data) {
            this.data = data;
        }
        this.state = "empty"
        this.error = null
    }

    async load() : Promise<void> {
        if (this.data === null) {
            this.isReady = true;
        }
        if (this.state !== 'empty') { return }
        this.state = 'loading'
        try {
            const data = await this.data.load()
            this.onData(data)

        } catch (e) {
            this.error = `Error loading data(${this.source}): ${e}`
        }
    }

    unload(): void {
        this.unloadData();
        this.isReady = false;
        this.state = 'empty';
    }


    onData(data): void {
        console.error("This method should be overridden by the game subclass")
    }

    unloadData(): void {
    }

    // Allow games to customize their scores
    parseHighscore(h): string {
        const t = new Date(h.ts)
        const dateStr = `${t.getFullYear()}.${t.getMonth() + 1}.${t.getDate()}`
        return `${h.score} ${h.percentCorrect ? "- " + h.percentCorrect + "%" : ""} @${h.wpm}wpm on ${dateStr}`
    }

}

export interface AsyncData {
    load(): Promise<any>
}

export class FetchData {
    readonly source: string
    
    constructor(source: string) {
        this.source = source
    }

    load() : Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(this.source).then(res => {
                if (res.status >= 400) {
                    const error = `Error loading data(${this.source}): ${res.status} - ${res.statusText}`
                    return reject(error)
                }
                res.json().then(data => {
                    resolve(data)
                })
            }).catch((e) => {
                console.log(e)
                const error = `Error loading data(${this.source}): ${e}`
                reject(error)
            })
        })
    }
}

export default Game