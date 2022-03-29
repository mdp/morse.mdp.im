import { useState, useRef } from 'react'
import useSWR from 'swr'

import Footer from '../components/news/footer';
import { getState, validate } from '../lib/morse_settings';
import MorseAudio from '../components/morse_audio';

const fetcher = (url, ...args) => fetch(url, ...args).then(res => res.json())

export default function Index() {
  const audioRef = useRef(null)
  let createdOn = '...';
  let headlines = [];
  const {data} = useSWR("https://morse.mdp.im/podcast/headlines.json", fetcher);
  if (data) {
    headlines = data.content;
    createdOn = new Date(data.timestamp).toISOString();
  }

  const [morseSettings, setMorseSettings] = getState()

  const [currentTrackIdx, setCurrentTrackIdx] = useState(-1)

  const [state, setState] = useState({
    advanced: false,
    audioState: "empty",
    content: "",
  });

  function validateMorseSettings() {
    validate(morseSettings, setMorseSettings)
  }

  function audioPlayComplete() {
      console.log("Play complete")
      setState({...state,
        audioState: "played",
      })
  }

  function renderAudio() {
    if (state.audioState === "playing") {
      return <MorseAudio text={state.content} wpm={morseSettings.wpm} fwpm={morseSettings.fwpm} freq={morseSettings.freq} preDelay={morseSettings.preDelay} onComplete={audioPlayComplete}></MorseAudio>
    }
  }

  function updateMorseSettings(key, value) {
    const newSettings = { ...morseSettings }
    value = value.replace(/[^0-9]+/, "")
    const newValue = parseInt(value || "0", 10)
    newSettings[key] = newValue

    // Match WPM to FWPM when it's being adjusted
    if (key === "wpm") {
      newSettings.fwpm = newValue
    }

    setMorseSettings(newSettings)
  }

  function onAdvancedClick() {
    setState({...state, advanced: !state.advanced})
  }


  function playClick(target) {
    const trackNum = parseInt(target.getAttribute('data-idx'), 10)
    if (trackNum === currentTrackIdx) {
      setCurrentTrackIdx(-1)
      setState({...state, audioState: "stopped"})
    } else {
      setState({...state, content: target.getAttribute('data-content'), audioState: "playing"})
      setCurrentTrackIdx(trackNum)
    }
  }

  return (
    <>
    {renderAudio()}
    <div className="container w-full md:max-w-4xl mx-auto pt-5">
      <div
        className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <header className="font-sans text-center pb-20">
          <h1
            className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl"
          >
            📰  Morse Code News 📰 </h1>
          <p className="text-sm md:text-base font-normal text-gray-600">
            Updated: {createdOn}
          </p>
        </header>
        <div className="px-10">
          <form className="w-full max-w-lg pb-10 mx-auto">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                  WPM
                </label>
                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                type='text' onChange={e => updateMorseSettings('wpm', e.target.value)} value={morseSettings.wpm} ></input>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  Farnsworth
                </label>
                <input className="bg-gray-199 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                type='text' onChange={e => updateMorseSettings('fwpm', e.target.value)} value={morseSettings.fwpm} ></input>
              </div>
            </div>
            <div className="mx-3 py-2 text-green-800 text-sm" onClick={onAdvancedClick} style={{ display: (state.advanced ? "none" : "block") }}>Advanced Settings</div>
            <div className="flex flex-wrap -mx-3 mb-6" style={{ display: (state.advanced ? "flex" : "none") }}>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  Frequency
                </label>
                <input className="bg-gray-199 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  type='text' onChange={e => updateMorseSettings('freq', e.target.value)} value={morseSettings.freq} ></input>
              </div>
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  Pre Delay
                </label>
                <input className="bg-gray-199 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  type='text' onChange={e => updateMorseSettings('preDelay', e.target.value)} value={morseSettings.preDelay} ></input>
              </div>
            </div>
          </form>
          <ol className="list-decimal">
            {headlines.map((headline, idx) => (
              <li
                className="pb-3"
                key={`${idx}-headline`}><span onClick={e => playClick(e.target)} data-content={headline} data-idx={idx}> {currentTrackIdx === idx ? "⏹" : "▶"} </span><span className='blur pl-3'>{headline}</span></li>
            ))}
          </ol>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )

}
