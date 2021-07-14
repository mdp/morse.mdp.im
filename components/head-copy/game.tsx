import { useEffect, useRef, useState } from 'react'
import MorseCWWave from 'morse-pro/lib/morse-pro-cw-wave'
import getDataURI from 'morse-pro/lib/morse-pro-util-datauri';
import * as RiffWave from 'morse-pro/lib/morse-pro-util-riffwave';
import levenshteinDistance from '../../lib/levenshtein';
import {Question}  from '../../lib/word_set_builder';

const HIGHEST_SCORE = 500;
const LOWEST_SCORE = 200;
const FASTEST_RESPONSE = 1500; // time to get the full points
const SLOWEST_RESPONSE = 5000; // time after a correct answer gets lowest score

function shuffle(array: string[]): string[] {
  return array.sort(() => Math.random() - 0.5);
}

function randomPick(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function similar(word: string, array: string[]): string[] {
  return array.concat().sort(function(a,b): number {
    const aNum = levenshteinDistance(word, a);
    const bNum = levenshteinDistance(word, b);
    if (aNum > bNum) {
      return 1
    } else if (aNum < bNum) {
      return -1
    }
    return 0;
  })
}

// Return x sets of y words
function wordSetBuilder(wordList: string[], x: number, y: number): string[][] {
  const sets = []
  for (let i=0; i < x; i++) {
    let pick = randomPick(wordList);
    let others = similar(pick, wordList).slice(1, y);
    let set = [pick]
    set = set.concat(others)
    sets.push(set)
  }
  return sets
}

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

  const answerSet = words.sort().map((word) =>
      <li className="items-center my-2 px-4">
          <button className="w-full justify-center rounded-md border border-gray-300 p-4" onClick={onClick}>{word}</button>
      </li>
  )

  return(
    <ul className="w-full absolute bottom-0">{answerSet}</ul>
  )
}

interface TurnProps {
  question: Question,
  turnIdx: number,
  onComplete: Function,
  wpm: number,
  fwpm: number,
}

export function Turn({question, turnIdx, onComplete, wpm, fwpm}: TurnProps) {
  const wordSetLength = question.phrase.length;
  const defaultState = {
      playing: true,
      played: false,
      wordIdx: 0,
      turnIdx,
      score: 0,
      answers: [],
  }

  // Default state
  const [state, setState] = useState({
    ...defaultState,
    wordPicks: question.phrase,
  })

  const audioRef = useRef<HTMLAudioElement>(null);

  function playTurn() {
    console.log("Playing turn", state)
    if (state.turnIdx < turnIdx) {
      console.log("New turn")
      setState({
        ...defaultState,
        turnIdx: turnIdx,
        wordPicks: question.phrase,
      })
    }
    if (!state.playing) {
      return true;
    }
    var morseCWWave = new MorseCWWave(true, wpm, fwpm);
    // On mobile(ios at least) we need to lead with a space to let the sound volume come up
    // It seems to launch the sound and quickly fade in the audio which clips the first dit slightly
    const joiner = question.spaced ? " " : ""
    morseCWWave.translate("  " + state.wordPicks.join(joiner));
    var datauri = getDataURI(RiffWave.getData(morseCWWave.getSample()), RiffWave.getMIMEType()); // create an HTML5 audio element
    if (audioRef.current) {
      audioRef.current.src = datauri
      audioRef.current.play()
    }
  }

  function audioPlayComplete() {
      setState({...state, played: true, playing: false})
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
    if (state.played && state.wordIdx < wordSetLength) {
      return <AnswerSet words={question.answers[state.wordIdx]} pick={state.wordPicks[state.wordIdx]} onAnswer={onAnswer}></AnswerSet>
    } else if (!state.playing) {
      return <div className="w-full flex items-center bottom-0 p-4 absolute">
          <button className="w-full justify-center rounded-md border border-gray-300 p-4" onClick={onNext}>Next</button>
      </div>
    }
    return false;
  }

  function renderAnswers() {
    const words = [];
    for (let i=0; i < state.answers.length; i++) {
      let answer = state.answers[i];
      console.log(answer);
      if (answer[0] === answer[1]) {
        words.push(<span className='correct'>{answer[1]} </span>)
      } else {
        words.push(<span className='wrong'><span style={{textDecoration:'line-through'}}>{answer[1]}</span> {answer[0]} </span>)
      }
    }
    return words
  }

  useEffect(() => {
    playTurn();
  });


  return (
    <div className="container w-full md:max-w-4xl mx-auto pt-5">
      <audio ref={audioRef} onEnded={audioPlayComplete}></audio>
      <div>{renderAnswers()}</div>
      <div>
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
}

export function Game({getQuestion, onGameUpdate, onCancelGame, wpm, fwpm, turns}: GameProps) {
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
    <div className="container w-full flex-auto md:max-w-4xl mx-auto h-screen">
      <div className="grid grid-cols-2 justify-items-center">
        <div>Score: {state.score}</div>
        <div>Turn {state.turnIdx + 1}/50</div>
      </div>
      <Turn wpm={wpm} fwpm={fwpm} turnIdx={state.turnIdx} question={state.currentQuestion} onComplete={onTurnComplete} />
      <button className="absolute top-0 right-0 flex items-center justify-center rounded-md border border-gray-300 p-2" onClick={onCancelGame}>✖️</button>
    </div>
  )

}
