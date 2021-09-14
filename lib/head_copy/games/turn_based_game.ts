import Game, { Answer, DefaultGameArgs, GameSettings, GameState } from "../game";
import score, { ScoreResult } from "../scoring";
import { Highscore } from "../highscore_storage";

export interface TurnBasedGameState extends GameState {
    scoreResults: ScoreResult[]
    turnIdx: number
}

export interface TurnBasedGameArgs extends DefaultGameArgs {
    source: string
    turns: number
    spaced: boolean
}

export abstract class TurnBasedGame extends Game {
    abstract readonly turns: number

    getInitialState({wpm, fwpm, freq}: GameSettings): TurnBasedGameState {
        return {
            wpm,
            fwpm,
            freq,
            progress: "1/" + this.turns,
            turnIdx: 0,
            score: 0,
            charactersDecoded: 0,
            isComplete: false,
            scoreResults: [],
        }
    }

    onAnswer(answers: Answer[], gameState: TurnBasedGameState): TurnBasedGameState {
        const result = score(answers, gameState);
        gameState.scoreResults.push(result)
        gameState.score = gameState.score + result.score
        gameState.charactersDecoded = gameState.charactersDecoded + result.correctlyDecoded

        gameState.turnIdx = gameState.turnIdx + 1
        gameState.progress = gameState.turnIdx + "/" + this.turns
        if (gameState.turnIdx === this.turns - 1) {
            gameState.isComplete = true
        }
        return gameState
    }

    getFinalScore(gameState: TurnBasedGameState): [Highscore, number] {
        const correctAnswers = gameState.scoreResults.map((r) => r.correctlyAnswered).filter((r) => r).length;
        const percentCorrect = Math.floor(100 * (correctAnswers / gameState.scoreResults.length))
        return [{
            mode: this.id,
            score: gameState.score,
            wpm: gameState.fwpm,
            percentCorrect,
            ts: Date.now()
        }, gameState.charactersDecoded]
    }

}

export abstract class TurnBasedGameFetch extends TurnBasedGame{
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
