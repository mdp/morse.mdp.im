import Game, { Answer, DefaultGameArgs, GameSettings, GameState } from "../game";
import score, { ScoreResult } from "../scoring";
import { Highscore } from "../highscore_storage";

const PROGRESS_CHAR = "X"

export interface StreakBasedGameState extends GameState {
    scoreResults: ScoreResult[]
}

export interface StreakBasedGameArgs extends DefaultGameArgs {
    source: string
    lives: number
    spaced: boolean
}

function getProgress(_lives, wrongAnswers=0): string {
    let progress = "";
    for (let i = 0; i < wrongAnswers; i++) { progress = progress + PROGRESS_CHAR }
    return progress
}

export abstract class StreakBasedGame extends Game {
    abstract readonly lives: number

    getInitialState({wpm, fwpm, freq}: GameSettings): StreakBasedGameState {
        return {
            wpm,
            fwpm,
            freq,
            progress: getProgress(this.lives),
            score: 0,
            charactersDecoded: 0,
            isComplete: false,
            scoreResults: [],
        }
    }

    onAnswer(answers: Answer[], gameState: StreakBasedGameState): StreakBasedGameState {
        const result = score(answers, gameState);
        gameState.scoreResults.push(result)
        gameState.score = gameState.score + result.score
        gameState.charactersDecoded = gameState.charactersDecoded + result.correctlyDecoded

        const wrongAnswers = gameState.scoreResults.filter((r) => !r.correctlyAnswered).length
        gameState.progress = getProgress(this.lives, wrongAnswers)
        if (wrongAnswers >= this.lives) {
            gameState.isComplete = true
        }

        return gameState
    }

    getFinalScore(gameState: StreakBasedGameState): [Highscore, number] {
        return [{
            mode: this.id,
            score: gameState.score,
            wpm: gameState.fwpm,
            ts: Date.now()
        }, gameState.charactersDecoded]
    }

}

export abstract class StreakBasedGameFetch extends StreakBasedGame{
    abstract source: string

    abstract loadData(data: any): void;

    abstract unloadData(): void;

    load(done: (err?: any) => void) : void {
        if (this.state !== 'empty') { return }
        this.state = 'loading'
        fetch(this.source).then(res => {
            if(res.status >= 400) {
                this.error = `Error loading data(${this.source}): ${res.status} - ${res.statusText}`
                done(this.error)
            } else {
                res.json().then(data => {
                    this.loadData(data)
                    this.state = 'loaded'
                    done()
                })
            }
        }).catch((e) => {
            console.log(e)
            this.error = e
            this.error = `Error loading data(${this.source}): ${e}`
            done(this.error)
        })
    }
    
}

