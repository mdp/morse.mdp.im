import React, { useState } from 'react'
import createPersistedState from 'use-persisted-state';

import { Game }from './game'
import { Question } from '../../lib/head_copy/types';
import Link from 'next/link';
import { addTotalCharacterDecoded, setHighscore } from '../../lib/head_copy/highscore_storage';
import gameList, { GameDefinition } from '../../lib/head_copy/game_list'

const morseSettingsState = createPersistedState('morseSettings');

export interface MorseSettings {
  fwpm: number,
  wpm: number,
  freq: number,
}
const MINIMUM_WPM = 5;

export default function GameRunner({ mode }: { mode: string }) {
  const game: GameDefinition | null = gameList.find((a) => a.id === mode) || null

  const [morseSettings, setMorseSettings]: [MorseSettings, Function] = morseSettingsState({
    wpm: 20,
    fwpm: 20,
    freq: 700,
  })

  const defaultState = {
    gameState: "stopped",
    questionData: null,
    lastGameAt: null,
    lastGameScore: null,
    lastGamePercent: null,
    lastGameCorrectlyDecoded: null,
    questionIdx: 0,
    morseSettings,
  }

  const [state, setState] = useState(defaultState)

  if (!game.questionPool.isReady) {
    game.questionPool.load(() => setState({...state, gameState: 'loaded'}))
  }

  function gameUpdate(isComplete: boolean, {score, percentCorrect, correctlyDecoded}) {
    if (isComplete) {
      const scoreAt = setHighscore(mode, score, morseSettings.fwpm, percentCorrect)
      addTotalCharacterDecoded(correctlyDecoded) // Keep track for personal goals
      setState({...state,
        lastGameAt: scoreAt,
        lastGameScore: score,
        lastGamePercent: percentCorrect,
        lastGameCorrectlyDecoded: correctlyDecoded,
        gameState: "complete",
        questionIdx: 0,
      })
    }
  }

  function getQuestion(turn: number): Question {
      return game.questionPool.getQuestion(turn);
  }

  function startNewGame() {
    setState({...defaultState,
      gameState: "running",
      questionIdx: 0,
    })
  }

  function stopGame() {
    setState({...state,
      gameState: "stopped",
      questionIdx: 0,
    })
  }

  function updateMorseSettings(key, value) {
    const newSettings = {...morseSettings}
    value = value.replace(/[^0-9]+/,"")
    const newValue = parseInt(value || "0", 10)
    newSettings[key] = newValue

    // Match WPM to FWPM when it's being adjusted
    if (key = "wpm") {
      newSettings.fwpm = newValue 
    }

    setMorseSettings(newSettings)
    setState({...state, morseSettings: newSettings})
  }

  function validateSpeeds() {
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
    setMorseSettings(newSettings)
    setState({...state, morseSettings: newSettings})
  }

  function render() {
      if (!game.questionPool.isReady) {
          return <div>Loading...</div>
      } else if (state.gameState === "stopped" || state.gameState === "loaded") {
          return renderIndexPage();
      } else if (state.gameState == "complete") {
          return <div className="container w-full md:max-w-xl mx-auto pt-5 px-4">
            <h1> Game Complete </h1>
            <h3>Score: {state.lastGameScore}</h3>
            <h3>Percent Correct: {state.lastGamePercent}</h3>
            <h3>Correct Decodes: {state.lastGameCorrectlyDecoded}</h3>
            <Link href={`/head-copy/highscores?mode=${mode}&scoretime=${state.lastGameAt}`}>
              <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3">Highscores</button>
            </Link>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={startNewGame}>Play Again</button>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={stopGame}>Back</button>
          </div>
      } else {
        console.log("play game")
          return <>
              <Game morseSettings={morseSettings} getQuestion={getQuestion} onGameUpdate={gameUpdate} onCancelGame={stopGame} turns={game.questionPool.turns} />
          </>
      }
  }

  function renderIndexPage() {
    return(
      <div className="container w-full md:max-w-xl mx-auto pt-5">
        <div
          className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
          <header className="font-sans text-center pb-20">
            <h1
              className="font-bold font-sans break-normal text-gray-900 text-3xl"
            > 🧠 Head Copy ✍️ </h1>
          </header>
          <div className="px-10">
            <form className="w-full max-w-lg pb-10 mx-auto">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                    WPM
                  </label>
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type='text' onBlur={validateSpeeds}
                    onChange={e => updateMorseSettings('wpm', e.target.value)}
                    value={morseSettings.wpm} ></input>
                </div>
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Farnsworth
                  </label>
                  <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                    type='text' onBlur={validateSpeeds}
                    onChange={e => updateMorseSettings('fwpm', e.target.value)}
                    value={morseSettings.fwpm} ></input>
                </div>
              </div>
            </form>

            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3" onClick={startNewGame}>Click to Play</button>
            <Link href="/head-copy">
              <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3">Back to Menu</button>
            </Link>
          </div>
        </div>
      </div>
    )

  }
  
  console.log("QuestionPool", game.questionPool)
  if (game.questionPool.error) {
    return <div>Error {game.questionPool.error}</div>
  }

  return (
    <>
      {render()}
    </>
  )

}
