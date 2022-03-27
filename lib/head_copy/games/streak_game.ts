import Game, { Answer, AsyncData, DefaultGameArgs, GameSettings, GameState } from "../game";
import score, { ScoreResult } from "../scoring";
import { Highscore } from "../highscore_storage";

const PROGRESS_CHAR = "X"

export interface StreakBasedGameState extends GameState {
    scoreResults: ScoreResult[]
}

export interface StreakBasedGameArgs extends DefaultGameArgs {
    data: AsyncData
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

    getInitialState(gameSettings: GameSettings): StreakBasedGameState {
        return {
            progress: getProgress(this.lives),
            score: 0,
            charactersDecoded: 0,
            isComplete: false,
            scoreResults: [],
            gameSettings,
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
            wpm: gameState.gameSettings.fwpm,
            ts: Date.now()
        }, gameState.charactersDecoded]
    }

}
