import { useState } from 'react'
import useSWR from 'swr'
import createPersistedState from 'use-persisted-state';

import fetcher from '../../lib/fetcher';

import { Game }from './game'
import { buildQuestionFromPhrases, buildQuestionFromWords, callSignsToPhraseList, GameData, Question } from '../../lib/head_copy_buiders';

const TURNS = 50;

const wpmState = createPersistedState('wpm');
const fwpmState = createPersistedState('fwpm');

export const gameList: {[key: string]: GameData} = {
    "Top500": {
        title: "Top 500 Words", source: "/data/top500.json", type: "words",
        description: `In this game we will jumble up the 500 top words into groups of 3 for 50 turns.
        You'll hear each set of words then need to pick them from a list, in order of appearance.
        `,
        spaced: true, turns: 50
    },
    "Callsigns": {
        title: "Callsigns", source: "/data/cwops_calls.json", type: "calls",
        description: `In this game you'll need to identify the callsign you from memory.
        After you hear the callsign you'll need to pick the correct callsign from memory.
        `,
        spaced: false, turns: 50
    },
}

export default function GameMode({mode}:{mode: string}) {
    const game: GameData = gameList[mode]

    const [wpm, setWpm] = wpmState(20)
    const [fwpm, setFwpm] = fwpmState(20)
    const [state, setState] = useState({
        gameState: "stopped",
        gameData: null, 
        questionIdx: 0,
        fwpm: 20,
        wpm: 20,
    })

    let dataLoaded = false
    const { data, error } = useSWR(game.source, fetcher);
    if (data && !state.gameData) {
        if (game.type === "calls") {
            const p = callSignsToPhraseList(data.calls)
            game.phraseList = p;
            setState({
                ...state,
                gameData: game
            })
            console.log(p);
            console.log(buildQuestionFromPhrases(p, { answerCount: 5, spaced: false }));
        }
        dataLoaded = true
    }

  function validateSpeed() {
    // Always lower farnsworth to at least WPM
    if (parseInt(wpm, 10) < parseInt(fwpm, 10)) {
      setFwpm(wpm)
    }
  }

  function gameUpdate(complete: boolean, info: any) {
    console.log(complete);
    console.log(info);
  }

  function getQuestion(_turn: number): Question {
      const game: GameData = state.gameData;
      if (game.phraseList) {
          return buildQuestionFromPhrases(state.gameData.phraseList, {spaced: game.spaced, answerCount: 5})
      }
  }

  if (error) {
    return <div>Error</div>
  }

  if (!state.gameData) {
    return <div>Loading...</div>
  }

  function startNewGame() {
    validateSpeed();
    setState({...state,
      gameState: "running",
      questionIdx: 0,
    })
  }

  function cancelGame() {
    setState({...state,
      gameState: "stopped",
      questionIdx: 0,
    })
  }

  function render() {
      if (!state.gameData) {
          return <div>Loading...</div>
      } else if (state.gameState == "stopped") {
          return renderIndexPage();
      } else {
          return <>
              <Game wpm={wpm} fwpm={fwpm} getQuestion={getQuestion} onGameUpdate={gameUpdate} onCancelGame={cancelGame} turns={TURNS} />
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
                  <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type='text' onChange={e => setWpm(e.target.value)} value={wpm} ></input>
                </div>
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Farnsworth
                  </label>
                  <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type='text' onChange={e => setFwpm(e.target.value)} value={fwpm} ></input>
                </div>
              </div>
            </form>
            <button className="w-full flex items-center justify-center rounded-md border border-gray-300" onClick={startNewGame}>Click to play</button>
          </div>
        </div>
      </div>
    )

  }

  return (
    <>
      {render()}
    </>
  )

}
