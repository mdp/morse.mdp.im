import { Answer, GameState } from "./game";

const SCORE_PHRASE_CORRECT_BONUS = 500
const SCORE_PER_PHRASE = 50
const SLOW_RESPONSE = 1500; // time in ms per phrase to get the full points

export interface ScoreResult {
  score: number
  correctlyAnswered: boolean
  correctlyDecoded: number
  wpm: number
}

export default function score(answers: Answer[], gameState: GameState): ScoreResult {
    let correctlyDecoded = 0;
    let score = 0;

    // Extend time depending on how many answer sets we provide
    const slowResponseTime = (answers.length) * SLOW_RESPONSE; // Needed for the slow time penalty

    // Get the last questions elapsed time, this is the total time it took to answer the question
    const duration = answers[answers.length - 1].elapsed;

    const correctlyAnswered = answers.map((a) => a.selected).join("") === answers.map((a) => a.actual).join("")
    answers.forEach((set, idx) => {
      if (set.actual === set.selected) {
        score = score + SCORE_PER_PHRASE * set.actual.length
        correctlyDecoded = correctlyDecoded + set.actual.length
      }
    })
    if (correctlyAnswered) {
      score = score + SCORE_PHRASE_CORRECT_BONUS
    }

    // Penalize slow responses
    let speedPenaltyFactor = 0
    if (duration > slowResponseTime) {
      const overage = duration - slowResponseTime
      const maxOverage = slowResponseTime * 2
      speedPenaltyFactor = overage > maxOverage ? 1 : overage/maxOverage
      speedPenaltyFactor = speedPenaltyFactor * 0.5 // Max of 50% penalty
    }
    const speedPenalty = score * speedPenaltyFactor

    // WPM Bonus
    const speedBonusFactor = (gameState.gameSettings.fwpm + 5) / 10 // Every 10wpm above 5 wpm bumps up the score by 1x
    // (5wpm + 5) / 10 = 1x
    // (10wpm + 5) / 10 = 1.5x
    // (15wpm + 5) / 10 = 2x
    // (25wpm + 5) / 10 = 3x

    return {
      score: Math.floor((score * speedBonusFactor) - speedPenalty),
      correctlyAnswered,
      correctlyDecoded,
      wpm: gameState.gameSettings.fwpm,
    }
  }