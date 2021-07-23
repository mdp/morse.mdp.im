import { MouseEventHandler, useRef, useState } from 'react'
import {Question}  from '../../lib/head_copy/types';
import Result from './result';
import MorseAudio from '../morse_audio';
import { AnswerSet } from './answer_set';
import { MorseSettings } from './game_runner';

const SCORE_PHRASE_CORRECT_BONUS = 500
const SCORE_PER_PHRASE = 50
const SLOW_RESPONSE = 1500; // time in ms per phrase to get the full points

interface ScoreResult {
  score: number,
  correctlyAnswered: boolean,
  correctlyDecoded: number
}

interface TurnProps {
  question: Question,
  turnIdx: number,
  onComplete: (scoreResult: ScoreResult) => void,
  onNext: MouseEventHandler<HTMLButtonElement>,
  morseSettings: MorseSettings,
}

export function Turn({question, turnIdx, onComplete, onNext, morseSettings}: TurnProps) {
  const wordSetLength = question.phrase.length;
  const defaultState = {
      audioState: "empty",
      wordIdx: 0,
      turnIdx: -1,
      score: 0,
      startedAt: Date.now(),
      answers: [],
      content: null
  }

  // Default state
  const [state, setState] = useState({
    ...defaultState,
  })

  const start = Date.now();

  function score(answers: string[][]): ScoreResult {
    let correctlyDecoded = 0;
    let score = 0;
    // Extend time depending on how many answer sets we provide
    const slowResponseTime = (answers.length) * SLOW_RESPONSE; // Needed for the slow time penalty
    const duration = Date.now() - state.startedAt;
    const correctlyAnswered = answers.map((a) => a[0]).join("") === answers.map((a) => a[1]).join("")
    answers.forEach((set, idx) => {
      if (set[0] === set[1]) {
        score = score + SCORE_PER_PHRASE * set[0].length
        correctlyDecoded = correctlyDecoded + set[0].length
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
    const speedBonusFactor = (morseSettings.fwpm + 5) / 10 // Every 10wpm above 5 wpm bumps up the score by 1x
    // (5wpm + 5) / 10 = 1x
    // (10wpm + 5) / 10 = 1.5x
    // (15wpm + 5) / 10 = 2x
    // (25wpm + 5) / 10 = 3x

    return {
      score: Math.floor((score * speedBonusFactor) - speedPenalty),
      correctlyAnswered,
      correctlyDecoded,
    }
  }

  console.log("Turn", question, turnIdx, state)

  function audioPlayComplete() {
      console.log("Play complete")
      setState({...state, audioState: "played"})
  }

  function onAnswer(correctWord, wordSelected) {
    let wordIdx = state.wordIdx + 1;
    console.log(`${correctWord} : ${wordSelected}`);
    const answers = [...state.answers, [correctWord, wordSelected]]
    setState({
      ...state,
      answers,
      wordIdx
    })
    if (wordSetLength <= answers.length) {
      console.log("Turn Complete")
      onComplete(score(answers))
    }
  }

  function renderAnswerSet() {
    if (state.audioState === "played" && state.answers.length < wordSetLength) {
      return <AnswerSet words={question.answers[state.wordIdx]} pick={question.phrase[state.wordIdx]} onAnswer={onAnswer}></AnswerSet>
    } else if (state.audioState === "played") {
      return <div>
          <button className="w-full justify-center eightbit-btn text-xl p-4" onClick={onNext}>Next</button>
      </div>
    }
    return false;
  }

  function renderAudio() {
    return <MorseAudio text={state.content} wpm={morseSettings.wpm} fwpm={morseSettings.fwpm} onComplete={audioPlayComplete}></MorseAudio>
  }

  if (state.turnIdx < turnIdx) {
    const joiner = question.spaced ? " " : ""
    setState({
      ...defaultState,
      turnIdx: turnIdx,
      content: question.phrase.join(joiner),
    })
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div><Result answers={state.answers} spaced={question.spaced} /></div>
      {renderAudio()}
      <div className="mt-auto ">
        {renderAnswerSet()}
      </div>
    </div>
  )

}

interface GameResults {
  score: number,
  percentCorrect: number,
  correctlyDecoded: number,
}

interface GameProps {
  getQuestion: (turnIdx: number) => Question,
  onGameUpdate: (isComplete: boolean, gameResults: GameResults) => void,
  onCancelGame: () => void,
  morseSettings: MorseSettings,
  turns: number,
}

export function Game({getQuestion, onGameUpdate, onCancelGame, morseSettings, turns}: GameProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
      turnIdx: 0,
      score: 0,
      correctAnswers: 0,
      correctlyDecoded: 0,
      currentQuestion: getQuestion(0),
  })

  function onTurnComplete(scoreResult: ScoreResult) {
    let isComplete = state.turnIdx + 1 >= turns;
    const totalScore = state.score + scoreResult.score;
    const correctlyDecoded = state.correctlyDecoded + scoreResult.correctlyDecoded;
    let correctAnswers = state.correctAnswers
    if (scoreResult.correctlyAnswered) {
      correctAnswers++
    }
    setState({
      ...state,
      score: totalScore,
      correctAnswers,
      correctlyDecoded,
    });
    const percentCorrect = Math.floor((correctAnswers/(state.turnIdx + 1))*100)
    onGameUpdate(isComplete, {score: totalScore, percentCorrect, correctlyDecoded});
  }

  function onNext() {
    setState({
      ...state,
      turnIdx: state.turnIdx + 1,
      currentQuestion: getQuestion(state.turnIdx + 1),
    });
  }
  
  return (
    <div className="absolute inset-0">
      <div className="flex flex-col p-4 h-full">
        <div className="flex flex-row justify-between w-full eightbit-font">
          <div>{state.score}</div>
          <div>{state.turnIdx + 1}/{turns}</div>
          <button className="" onClick={onCancelGame}>X</button>
        </div>
        <div className="w-full flex flex-col justify-between h-full">
          <div>&nbsp;</div>
          <Turn morseSettings={morseSettings} turnIdx={state.turnIdx} question={state.currentQuestion} onComplete={onTurnComplete} onNext={onNext} />
        </div>
      </div>
    </div>
  )

}
