import { useRef, useState } from 'react'
import {Question}  from '../../lib/head_copy_buiders';
import Result from './result';
import MorseAudio from '../morse_audio';

const HIGHEST_SCORE = 500;
const LOWEST_SCORE = 200;
const FASTEST_RESPONSE = 1500; // time to get the full points
const SLOWEST_RESPONSE = 5000; // time after a correct answer gets lowest score

export function AnswerSet({words, pick, onAnswer}) {

  const start = Date.now();

  function score() {
    const duration = Date.now() - start;
    if (duration < FASTEST_RESPONSE) {
      return HIGHEST_SCORE;
    } else if (duration < SLOWEST_RESPONSE) {
      const factor = 1 - ((duration - FASTEST_RESPONSE) / (SLOWEST_RESPONSE - FASTEST_RESPONSE));
      const bonus = Math.floor((HIGHEST_SCORE - LOWEST_SCORE) * factor);
      return LOWEST_SCORE + bonus;
    }
    return LOWEST_SCORE;
  }

  const onClick = (e) => {
    const selected = e.target.innerText;
    if (selected === pick) {
      onAnswer(score(), pick, selected);
    } else {
      onAnswer(0, pick, selected);
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
  wpm: number,
  fwpm: number,
  spaced: boolean,
}

export function Turn({question, turnIdx, onComplete, wpm, fwpm, spaced}: TurnProps) {
  const wordSetLength = question.phrase.length;
  const defaultState = {
      audioState: "empty",
      wordIdx: 0,
      turnIdx: -1,
      score: 0,
      answers: [],
      content: null
  }


  // Default state
  const [state, setState] = useState({
    ...defaultState,
  })

  console.log("Turn", question, turnIdx, state)

  function audioPlayComplete() {
      console.log("Play complete")
      setState({...state, audioState: "played"})
  }

  function onAnswer(score, correctWord, wordSelected) {
    let wordIdx = state.wordIdx + 1;
    console.log("Score", score);
    console.log(`${correctWord} : ${wordSelected}`);
    const total = score + state.score
    setState({
      ...state,
      score: total,
      answers: [...state.answers, [correctWord, wordSelected]],
      wordIdx
    })
    console.log("Total:", total);
  }

  function onNext() {
    onComplete({score: state.score});
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
  onGameUpdate: (isComplete: boolean, score: number) => void,
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
      currentQuestion: getQuestion(0),
  })

  function onTurnComplete({score}) {
    let isComplete = state.turnIdx + 1 < turns;
    setState({
      ...state,
      turnIdx: state.turnIdx + 1,
      score: state.score + score,
      currentQuestion: getQuestion(state.turnIdx + 1),
    });
    onGameUpdate(isComplete, state.score + score);
  }

  return (
    <div className="absolute inset-0">
      <div className="flex flex-col p-4 h-full">
        <div className="flex flex-row justify-between w-full eightbit-font">
          <div>{state.score}</div>
          <div>{state.turnIdx + 1}/50</div>
        </div>
        <div className="w-full flex flex-col justify-between h-full">
          <div></div>
          <Turn wpm={wpm} fwpm={fwpm} turnIdx={state.turnIdx} question={state.currentQuestion} onComplete={onTurnComplete} spaced={spaced} />
        </div>
      </div>
      <button className="absolute top-0 right-0 flex items-center justify-center rounded-md border border-gray-300 p-2" onClick={onCancelGame}>✖️</button>
    </div>
  )

}
