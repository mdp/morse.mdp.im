import {readFile} from 'fs'
import { promisify } from 'util'
import { useState, useRef } from 'react'
import MorseCWWave from 'morse-pro/lib/morse-pro-cw-wave'
import getDataURI from 'morse-pro/lib/morse-pro-util-datauri';
import * as RiffWave from 'morse-pro/lib/morse-pro-util-riffwave';

const readFileAsync = promisify(readFile);

import Footer from '../components/footer';


export async function getStaticProps(context) {
  let headlines = await readFileAsync('./public/news_headlines.json')
  headlines = JSON.parse(headlines)

  return {
    props: {
      headlines:headlines.headlines,
      createdOn:headlines.createdOn,
    },
  }
}

export default function Index({headlines, createdOn}) {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(-1)
  const [wpm, setWpm] = useState(20)
  const [fwpm, setFwpm] = useState(20)
  const audioRef = useRef()

  function validateSpeed() {
    if (parseInt(wpm, 10) < parseInt(fwpm, 10)) {
      setWpm(fwpm)
    }
  }

  function playClick(target) {
    const trackNum = parseInt(target.getAttribute('idx'), 10)
    audioRef.current.pause()
    if (trackNum === currentTrackIdx) {
      setCurrentTrackIdx(-1)
      return
    }
    validateSpeed()
    var morseCWWave = new MorseCWWave(true, parseInt(wpm, 10), parseInt(fwpm, 10));
    morseCWWave.translate(target.getAttribute('content'));
    var datauri = getDataURI(RiffWave.getData(morseCWWave.getSample()), RiffWave.getMIMEType()); // create an HTML5 audio element
    audioRef.current.src = datauri
    audioRef.current.play()
    setCurrentTrackIdx(trackNum)
  }

  return (
    <>
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
                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type='text' onChange={e => setWpm(e.target.value)} value={wpm} ></input>
              </div>
              <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                  Farnsworth
              </label>
                <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type='text' onChange={e => setFwpm(e.target.value)} value={fwpm} ></input>
              </div>
            </div>
          </form>
          <ol className="list-decimal">
            {headlines.map((headline, idx) => (
              <li
                className="pb-3"
                key={`${idx}-headline`}><span onClick={e => playClick(e.target)} content={headline} idx={idx}> {currentTrackIdx === idx ? "⏹" : "▶"} </span><span className='blur pl-3'>{headline}</span></li>
            ))}
          </ol>
          <audio ref={audioRef}></audio>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )

}
