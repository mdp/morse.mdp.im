import { MouseEventHandler, useRef, useState } from 'react'
import {Question}  from '../../lib/head_copy_buiders';
import Result from './result';
import MorseAudio from '../morse_audio';


const SCORE_BASE_CORRECT = 500
const SCORE_BASE_CORRECT_PHRASE = 100
const SCORE_WPM_BONUS = 5
const HIGHEST_SCORE = 500;
const LOWEST_SCORE = 200;
const FASTEST_RESPONSE = 1500; // time to get the full points
const SLOWEST_RESPONSE = 5000; // time after a correct answer gets lowest score

export function AnswerSet({words, pick, onAnswer}) {

  const onClick = (e) => {
    const selected = e.target.innerText;
    if (selected === pick) {
      onAnswer(pick, selected);
    } else {
      onAnswer(pick, selected);
    }
  }

  const answerSet = words.sort().map((word, i) =>
      <li key={word + i} className="items-center my-2 px-4">
          <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3" onClick={onClick}>{word}</button>
      </li>
  )

  return(
    <ul className="w-full flex-row">{answerSet}</ul>
  )
}

interface TurnProps {
  question: Question,
  turnIdx: number,
  onComplete: Function,
  onNext: MouseEventHandler<HTMLButtonElement>,
  wpm: number,
  fwpm: number,
  spaced: boolean,
}

export function Turn({question, turnIdx, onComplete, onNext, wpm, fwpm, spaced}: TurnProps) {
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

  function score(): [score: number, correctlyAnswered: boolean] {
    let score = 0;
    // Extend time depending on how many answer sets we provide
    const fasterResponse = (state.wordIdx + 1) * FASTEST_RESPONSE; // Needed for the full time bonus
    const partialPhrasePoints = Math.floor((SCORE_BASE_CORRECT / (state.wordIdx + 1)) * 0.5)
    const duration = Date.now() - state.startedAt;
    const correct = state.answers.map((a) => a[0]).join("") === state.answers.map((a) => a[1]).join("")
    if (correct) {
      score = SCORE_BASE_CORRECT
    } else {
      state.answers.forEach((set, idx) => {
        let answer = set[idx];
        if (answer[0] === answer[1]) {
          score = score + partialPhrasePoints
        }
      })
    }

    // Time penalty
    // WPM Bonus
    const speedBonusFactor = fwpm / 10 // Every 10wpm bumps up the score by 1x

    return [Math.floor(score * speedBonusFactor), correct]
  }

  console.log("Turn", question, turnIdx, state)

  function audioPlayComplete() {
      console.log("Play complete")
      setState({...state, audioState: "played"})
  }

  function onAnswer(correctWord, wordSelected) {
    let wordIdx = state.wordIdx + 1;
    console.log(`${correctWord} : ${wordSelected}`);
    console.log(wordIdx)
    if (wordSetLength <= state.wordIdx + 1) {
      onComplete(score())
    }
    setState({
      ...state,
      answers: [...state.answers, [correctWord, wordSelected]],
      wordIdx
    })
  }

  function renderAnswerSet() {
    if (state.audioState === "played" && state.wordIdx < wordSetLength) {
      return <AnswerSet words={question.answers[state.wordIdx]} pick={question.phrase[state.wordIdx]} onAnswer={onAnswer}></AnswerSet>
    } else if (state.audioState === "played") {
      return <div>
          <button className="w-full justify-center eightbit-btn text-xl p-4" onClick={onNext}>Next</button>
      </div>
    }
    return false;
  }

  function renderAudio() {
    return <MorseAudio text={state.content} wpm={wpm} fwpm={fwpm} onComplete={audioPlayComplete}></MorseAudio>
  }

  if (state.turnIdx < turnIdx) {
    console.log("New turn", state)
    const joiner = question.spaced ? " " : ""
    setState({
      ...defaultState,
      turnIdx: turnIdx,
      content: question.phrase.join(joiner),
    })
  }


  return (
    <div className="w-full flex flex-col h-full">
      <div><Result answers={state.answers} spaced={spaced} /></div>
      {renderAudio()}
      <div className="mt-auto ">
        {renderAnswerSet()}
      </div>
    </div>
  )

}

interface GameProps {
  getQuestion: (turnIdx: number) => Question,
  onGameUpdate: (isComplete: boolean, {score, percentCorrect}: {score: number, percentCorrect: number}) => void,
  onCancelGame: () => void,
  wpm: number,
  fwpm: number,
  turns: number,
  spaced: boolean,
}

export function Game({getQuestion, onGameUpdate, onCancelGame, wpm, fwpm, turns, spaced}: GameProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
      turnIdx: 0,
      score: 0,
      correctAnswers: 0,
      currentQuestion: getQuestion(0),
  })

  function onTurnComplete([score, correctlyAnswered]) {
    let isComplete = state.turnIdx + 1 >= turns;
    const totalScore = state.score + score;
    let correctAnswers = state.correctAnswers
    if (correctlyAnswered) {
      correctAnswers++
    }
    setState({
      ...state,
      score: totalScore,
      correctAnswers
    });
    const percentCorrect = Math.floor((correctAnswers/(state.turnIdx + 1))*100)
    onGameUpdate(isComplete, {score: totalScore, percentCorrect});
  }

  function onNext() {
    setState({
      ...state,
      turnIdx: state.turnIdx + 1,
      currentQuestion: getQuestion(state.turnIdx + 1),
    });
  }
  
  console.log(turns)

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
          <Turn wpm={wpm} fwpm={fwpm} turnIdx={state.turnIdx} question={state.currentQuestion} onComplete={onTurnComplete} onNext={onNext} spaced={spaced} />
        </div>
      </div>
    </div>
  )

}
