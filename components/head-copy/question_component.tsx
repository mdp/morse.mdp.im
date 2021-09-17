import { MouseEventHandler, useRef, useState } from 'react'
import Result from './result';
import MorseAudio from '../morse_audio';
import { AnswerSet } from './answer_set';
import { Answer, Question } from '../../lib/head_copy/game';

interface TurnProps {
  question: Question,
  onComplete: (answers: Answer[]) => void,
  onNext: MouseEventHandler<HTMLButtonElement>,
  gameOver: boolean,
}

export function Turn({question, onComplete, onNext, gameOver}: TurnProps) {
  const wordSetLength = question.phrase.length;
  const defaultState = {
      questionId: question.id,
      audioState: "empty",
      wordIdx: 0,
      score: 0,
      startedAt: null,
      answers: [],
      content: null,
      gameOver,
  }

  // Default state
  const joiner = question.spaced ? " " : ""
  const [state, setState] = useState({
    ...defaultState,
    content: question.phrase.join(joiner)
  })

  function audioPlayComplete() {
      console.log("Play complete")
      setState({...state,
        audioState: "played",
        startedAt: Date.now()
      })
  }

  function onAnswer(correctWord, wordSelected) {
    let wordIdx = state.wordIdx + 1;
    console.log(`${correctWord} : ${wordSelected}`);
    let startedAt = state.startedAt
    if (state.answers.length > 0) {
      startedAt = state.startedAt + state.answers.map((a) => a.elapsed).reduce((a,b) => a + b)
    }
    const answer: Answer = {actual: correctWord, selected: wordSelected, elapsed: Date.now() - startedAt}
    const answers = [...state.answers, answer]
    setState({
      ...state,
      answers,
      wordIdx
    })
    if (wordSetLength <= answers.length) {
      console.log("Turn Complete")
      onComplete(answers)
    }
  }

  function renderAnswerSet() {
    if (state.audioState === "played" && state.answers.length < wordSetLength) {
      return <AnswerSet words={question.answers[state.wordIdx]} pick={question.phrase[state.wordIdx]} onAnswer={onAnswer}></AnswerSet>
    } else if (state.audioState === "played" && gameOver) {
      return <div>
          <button className="w-full justify-center eightbit-btn text-xl p-4" onClick={onNext}>Game Over</button>
      </div>
    } else if (state.audioState === "played") {
      return <div>
          <button className="w-full justify-center eightbit-btn text-xl p-4" onClick={onNext}>Next</button>
      </div>
    }
    return false;
  }

  function renderAudio() {
    return <MorseAudio text={state.content} wpm={question.wpm} fwpm={question.fwpm} freq={question.freq} onComplete={audioPlayComplete}></MorseAudio>
  }

  if (state.questionId !== question.id) {
    console.log(state.questionId, question.id)
    const joiner = question.spaced ? " " : ""
    setState({
      ...defaultState,
      questionId: question.id,
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

interface QuestionComponentProps {
  question: Question
  onAnswer: (answers: Answer[]) => void
  onCancelGame: () => void
  onNext: () => void
  score: number
  progress: string
  gameOver: boolean
}

export function QuestionComponent({question, onAnswer, onNext, onCancelGame, score, progress, gameOver}: QuestionComponentProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    questionId: question.id
  })

  function onTurnComplete(answers: Answer[]) {
    onAnswer(answers)
  }

  return (
    <div className="absolute inset-0">
      <div className="flex flex-col p-4 h-full">
        <div className="flex flex-row justify-between w-full eightbit-font">
          <div>{score}</div>
          <div>{progress}</div>
          <button className="" onClick={onCancelGame}>X</button>
        </div>
        <div className="w-full flex flex-col justify-between h-full">
          <div>&nbsp;</div>
          <Turn question={question} onComplete={onTurnComplete} onNext={onNext} gameOver={gameOver} />
        </div>
      </div>
    </div>
  )

}
