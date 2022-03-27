import Game, { Answer, AsyncData, DefaultGameArgs, GameSettings, GameState } from "../game";
import score, { ScoreResult } from "../scoring";
import { Highscore } from "../highscore_storage";

export interface TurnBasedGameState extends GameState {
    scoreResults: ScoreResult[]
    turnIdx: number
}

export interface TurnBasedGameArgs extends DefaultGameArgs {
    data: AsyncData
    turns: number
    spaced: boolean
}

export abstract class TurnBasedGame extends Game {
    abstract readonly turns: number

    getInitialState(gameSettings: GameSettings): TurnBasedGameState {
        return {
            progress: "1/" + this.turns,
            turnIdx: 0,
            score: 0,
            charactersDecoded: 0,
            isComplete: false,
            scoreResults: [],
            gameSettings,
        }
    }

    onAnswer(answers: Answer[], gameState: TurnBasedGameState): TurnBasedGameState {
        const result = score(answers, gameState);
        gameState.scoreResults.push(result)
        gameState.score = gameState.score + result.score
        gameState.charactersDecoded = gameState.charactersDecoded + result.correctlyDecoded

        if (gameState.turnIdx === this.turns - 1) {
            gameState.isComplete = true
        }

        gameState.turnIdx = gameState.turnIdx + 1
        if (gameState.isComplete) {
            // Don't display 51/50 on Game Over Page
            gameState.progress = (gameState.turnIdx) + "/" + this.turns 
        } else {
            gameState.progress = (gameState.turnIdx + 1) + "/" + this.turns
        }
        return gameState
    }

    getFinalScore(gameState: TurnBasedGameState): [Highscore, number] {
        const correctAnswers = gameState.scoreResults.map((r) => r.correctlyAnswered).filter((r) => r).length;
        const percentCorrect = Math.floor(100 * (correctAnswers / gameState.scoreResults.length))
        return [{
            mode: this.id,
            score: gameState.score,
            wpm: gameState.gameSettings.fwpm,
            percentCorrect,
            ts: Date.now()
        }, gameState.charactersDecoded]
    }

}
