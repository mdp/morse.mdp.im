import fs from 'fs'
import path, { parse } from 'path'
import { promisify } from 'util'
import { parseFilename, getMp3s } from '../lib/utils'

const readdir = promisify(fs.readdir);

import Link from 'next/link';

export default function Index({ wpms, files }) {
  return (
    <div>
      <h1>📰  Morse Code News 📰 </h1>
      <h2>Last Update: {new Date(files[0].date).toUTCString().replace(" GMT", "Z")}</h2>
      <h3>Select your speed</h3>
      <ul>
        {wpms.sort((a,b)=> parseInt(a,10) > parseInt(b, 10) ? 1 : -1 ).map((wpm) => (
          <li className='centered'>
            <Link href='/[wpm]' as={`/${wpm}`}>
              <a> {wpm} WPM </a>
            </Link>
          </li>
        ))}
      </ul>
      <h6> Source: <a href="https://github.com/mdp/morse_code_news">https://github.com/mdp/morse_code_news</a> </h6>
    </div>
  );
}

export async function getStaticProps(context) {
  const files = await readdir('./public')
  const mp3s = await getMp3s(files)

  const reducer = (accumulator, currentValue) => {
    if (accumulator.indexOf(currentValue.fwpm) < 0) {
      accumulator.push(currentValue.fwpm)
    }
    return accumulator
  }
  let wpms = mp3s.reduce(reducer, [])

  return {
    props: {
      wpms,
      files: mp3s,
    },
  }
}
