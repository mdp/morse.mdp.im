import { Answer } from "../game";
import { Highscore } from "../highscore_storage";
import { TurnBasedGame, TurnBasedGameState } from "./turn_based_game";

const SPEED_RANGE = 1.6; // 25wpm should top out at 40wpm 1.6x on a perfect game

export abstract class RufzxpGame extends TurnBasedGame {
    readonly settingsAllowed = ["wpm", "freq"] // Farnsworth makes no sense here since it's unclear how we'd increase both progressively

    onAnswer(answers: Answer[], gameState: TurnBasedGameState): TurnBasedGameState {
        const state = super.onAnswer(answers, gameState);

        const correctScoreTally = state.scoreResults.reduce((prev, current) => {return current.correctlyAnswered ? prev + 1 : prev - 1}, 0)

        const startingSpeed = state.scoreResults[0].wpm;
        const speedRange = state.scoreResults[0].wpm * SPEED_RANGE - startingSpeed;
        const step = speedRange / this.turns;
        const speedChange = Math.floor(step * correctScoreTally)

        state.wpm = startingSpeed + speedChange;
        state.fwpm = state.wpm;

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
