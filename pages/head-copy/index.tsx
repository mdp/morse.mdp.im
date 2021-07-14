import { useState, useRef } from 'react'
import useSWR from 'swr'
import createPersistedState from 'use-persisted-state';

import fetcher from '../../lib/fetcher';

import { Game }from '../../components/head-copy/game'
import { buildQuestionFromPhrases, buildQuestionFromWords, callSignsToPhraseList, Question } from '../../lib/head_copy_buiders';
import { useRouter } from 'next/dist/client/router';
import GameMode from '../../components/head-copy/game_mode';

const TURNS = 50;

const wpmState = createPersistedState('wpm');
const fwpmState = createPersistedState('fwpm');

const games = [
  {title: "Top 500 Words", source: "/data/top500.json", spaced: true},
  {title: "Callsigns", source: "/data/cwops_calls.json", spaced: false},
]


// Pick a game
// Create phrases ~500 and corpus
// Store phrases in state
// Create questions from phrases

export default function Index() {
  const router = useRouter();
  const query = router.query;

  function render() {
    if (query.mode) {
      return <GameMode mode={[].concat(query.mode)[0]}></GameMode>
    } else {
      return renderIndexPage()
    }
  }

  function renderIndexPage() {
    return(
      <div className="container w-full md:max-w-4xl mx-auto pt-5">
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
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  Game list here
                </div>
              </div>
            </form>
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
