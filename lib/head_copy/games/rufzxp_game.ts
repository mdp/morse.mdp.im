import { Answer } from "../game";
import { Highscore } from "../highscore_storage";
import { TurnBasedGame, TurnBasedGameState } from "./turn_based_game";

const SPEED_CHANGE = 0.03; // 3 percent speed increase or decrease (Ceiled to always ensure the minimum of 1 wpm)

export abstract class RufzxpGame extends TurnBasedGame {

    onAnswer(answers: Answer[], gameState: TurnBasedGameState): TurnBasedGameState {
        const state = super.onAnswer(answers, gameState)

        const correctlyAnswered = state.scoreResults[state.scoreResults.length - 1].correctlyAnswered
        const speedChange = Math.ceil(state.wpm * SPEED_CHANGE);

        if (correctlyAnswered) {
            state.wpm = state.wpm + speedChange;
            state.fwpm = state.wpm;
        } else {
            state.wpm = state.wpm - speedChange;
            state.fwpm = state.wpm;
        }

        return state
    }

    getFinalScore(gameState: TurnBasedGameState): [Highscore, number] {
        const correctAnswers = gameState.scoreResults.map((r) => r.correctlyAnswered).filter((r) => r).length;
        const highestSpeedScore = gameState.scoreResults.reduce((prev, current) => (prev.wpm > current.wpm) ? prev : current);
        const percentCorrect = Math.floor(100 * (correctAnswers / gameState.scoreResults.length))
        return [{
            mode: this.id,
            score: gameState.score,
            wpm: highestSpeedScore.wpm,
            percentCorrect,
            ts: Date.now()
        }, gameState.charactersDecoded]
    }

}

export abstract class RufzxpGameFetch extends RufzxpGame{
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
