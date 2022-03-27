import React, { useState } from 'react'
import createPersistedState from 'use-persisted-state';

import { QuestionComponent }from './question_component'
import Game, { Answer, GameSettings } from '../../lib/head_copy/game'
import Link from 'next/link';
import { addHighscore, addTotalCharacterDecoded } from '../../lib/head_copy/highscore_storage';
import gameList from '../../lib/head_copy/game_list'

const morseSettingsState = createPersistedState('morseSettings');

const MINIMUM_WPM = 5;
const MINIMUM_FREQ = 400;
const MAXIMUM_FREQ = 1200;
const MINIMUM_PREDELAY = 100;
const MAXIMUM_PREDELAY = 2000;

export default function GameRunner({ mode }: { mode: string }) {
  const game: Game | null = gameList.find((a) => a.id === mode) || null

  const [morseSettings, setMorseSettings]: [GameSettings, Function] = morseSettingsState({
    wpm: 20,
    fwpm: 20,
    freq: 700,
    preDelay: 300,
  })

  const defaultState = {
    runState: "stopped",
    advancedSettings: false,
    gameState: game.getInitialState(morseSettings),
    lastScore: null,
    charactersDecoded: 0,
    morseSettings,
    question: null,
  }

  const [state, setState] = useState(defaultState)

  if (!game.isReady) {
    game.load().then(() => setState({...state, runState: 'loaded'}))
  }

  function getGameSetting(key: string, name: string) {
    if (game.settingsAllowed && !game.settingsAllowed.includes(key)) {
      return null;
    }
    return (
      <div className="w-full px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mt-2 mb-1" htmlFor="grid-first-name">
          {name}
        </label>
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          type='text' onBlur={validateMorseSettings}
          onChange={e => updateMorseSettings(key, e.target.value)}
          value={morseSettings[key]} ></input>
      </div>
    )
  }

  function gameComplete() {
    const [ finalScore, charactersDecoded ] = game.getFinalScore(state.gameState)
    addHighscore(finalScore)
    addTotalCharacterDecoded(charactersDecoded) // Keep track for personal goals
    setState({
      ...state,
      runState: "complete",
      lastScore: finalScore,
      charactersDecoded,
    })
  }

  function onTurnComplete(answers: Answer[]) {
    // Update state with new score gameState
    // Score answers with game
    const gameState = game.onAnswer(answers, state.gameState)
    setState({...state,
      gameState
    })
  }

  function onAdvancedClick() {
    setState({...state,
      advancedSettings: !state.advancedSettings
    })
  }

  function onNextQuestion() {
    // Get a new question and update state with it
    if (state.gameState.isComplete) {
      return gameComplete()
    }
    const [question, gameState] = game.getQuestion(state.gameState);
    setState({...state,
      gameState,
      question,
    })
  }

  function startNewGame() {
    const initialGameState = game.getInitialState(morseSettings);
    const [question, gameState] = game.getQuestion(initialGameState);
    setState({...defaultState,
      runState: "running",
      gameState,
      question,
    })
  }

  function stopGame() {
    setState({...state,
      runState: "stopped",
    })
  }

  function updateMorseSettings(key, value) {
    const newSettings = {...morseSettings}
    value = value.replace(/[^0-9]+/,"")
    const newValue = parseInt(value || "0", 10)
    newSettings[key] = newValue

    // Match WPM to FWPM when it's being adjusted
    if (key === "wpm") {
      newSettings.fwpm = newValue 
    }

    setMorseSettings(newSettings)
    setState({...state, morseSettings: newSettings})
  }

  function validateMorseSettings() {
    const newSettings = state.morseSettings
    if (morseSettings.wpm < MINIMUM_WPM) {
      newSettings.wpm = MINIMUM_WPM
    } if (morseSettings.fwpm < MINIMUM_WPM) {
      newSettings.fwpm = MINIMUM_WPM
    }
    // Always lower farnsworth to wpm
    if (morseSettings.wpm < morseSettings.fwpm) {
      newSettings.fwpm = morseSettings.wpm
    }

    if (morseSettings.freq > MAXIMUM_FREQ) {morseSettings.freq = MAXIMUM_FREQ}
    if (morseSettings.freq < MINIMUM_FREQ) {morseSettings.freq = MINIMUM_FREQ}
    if (morseSettings.preDelay > MAXIMUM_PREDELAY) {morseSettings.preDelay = MAXIMUM_PREDELAY}
    if (morseSettings.preDelay < MINIMUM_PREDELAY) {morseSettings.preDelay = MINIMUM_PREDELAY}
    setMorseSettings(newSettings)
    setState({...state, morseSettings: newSettings})
  }

  function render() {
      if (!game.isReady) {
          return <div>Loading...</div>
      } else if (state.runState === "stopped" || state.runState === "loaded") {
          return renderIndexPage();
      } else if (state.runState == "complete") {
          const finalScore = state.lastScore;
          return <div className="container w-full md:max-w-xl mx-auto pt-5 px-4">
            <h1> Game Complete </h1>
            <h3>Score: {finalScore.score}</h3>
            { finalScore.percentCorrect ? (
              <h3>Percent Correct: {finalScore.percentCorrect}</h3>
            ) : null}
            <h3>Correct Decodes: {state.charactersDecoded}</h3>
            <Link href={`/head-copy/highscores/?mode=${mode}&scoretime=${finalScore.ts}`} passHref>
              <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3">Highscores</button>
            </Link>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={startNewGame}>Play Again</button>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={stopGame}>Back</button>
          </div>
      } else {
          return <>
              <QuestionComponent
                question={state.question} onCancelGame={stopGame} onAnswer={onTurnComplete}
                onNext={onNextQuestion} score={state.gameState.score} progress={state.gameState.progress}
                gameOver={state.gameState.isComplete}
                />
          </>
      }
  }

  function renderIndexPage() {
    return(
      <div className="container w-full md:max-w-xl mx-auto pt-5 pb-5">
        <div
          className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
          <header className="font-sans text-center pb-10">
            <h1
              className="font-bold font-sans break-normal text-gray-900 text-3xl"
            > 🧠 Head Copy ✍️ </h1>
            <h2
              className="font-sans break-normal text-gray-800 text-2xl pt-5"
            > {game.name} </h2>
            <h3
              className="font-sans break-normal text-gray-800 pt-2"
            > {game.description} </h3>
          </header>
          <div className="px-10">
            <form className="w-full max-w-lg pb-10 mx-auto">
              <div className="flex flex-wrap -mx-3 mb-5">
                {getGameSetting('wpm', 'WPM')}
                {getGameSetting('fwpm', 'Farnsworth')}
                <div className="w-full">
                  <div className="mx-3 py-2 text-green-800 text-sm" onClick={onAdvancedClick} style={{display: (state.advancedSettings ? "none": "block")}}>Advanced Settings</div>
                  <div className="flex flex-wrap" style={{display: (state.advancedSettings ? "block" : "none")}}>
                    {getGameSetting('freq', 'Frequency')}
                    {getGameSetting('preDelay', 'Audio Delay (for BT headphones)')}
                  </div>
                </div>
              </div>
            </form>

            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={startNewGame}>Click to Play</button>
            <Link href={`/head-copy/highscores/?mode=${mode}`} passHref>
              <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3">Highscores</button>
            </Link>
            <Link href="/head-copy" passHref>
              <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3">Back to Menu</button>
            </Link>
          </div>
        </div>
      </div>
    )

  }
  
  if (game.error) {
    return <div>Error {game.error}</div>
  }

  return (
    <>
      {render()}
    </>
  )

}
