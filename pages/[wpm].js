import fs from 'fs'
import path, { parse } from 'path'
import { promisify } from 'util'
import { parseFilename } from '../lib/utils'

const readdir = promisify(fs.readdir);

export default function Index({ files }) {
  return (
    <div>
      <h1>📰  Morse Code News 📰 </h1>
      <h2>Last Update: {new Date(files[0].date).toUTCString().replace(" GMT", "Z")}</h2>
      <ul>
        {files.map((file) => (
          <li>
            <a href={file.filename}>
              {file.name} - {file.repeat} | {file.wpm}@{file.fwpm}
            </a>
            <span className='right'>
              <a href={file.filename.replace(/mp3$/, 'txt')} target='_blank'>
                Text
              </a>
            </span>
          </li>
        ))}
      </ul>
      <h6> Source: <a href="https://github.com/mdp/morse_code_news">https://github.com/mdp/morse_code_news</a> </h6>
    </div>
  );
}

export async function getStaticProps({params}) {
  const files = await readdir('./public')
  let mp3s = files.filter((file) => {
    return path.extname(file).toLowerCase() === '.mp3'
  }).map(parseFilename);

  mp3s = mp3s.filter((file) => {
    return file.fwpm === parseInt(params['wpm'], 10)
  }).sort((a,b) => a.date > b.date ? -1 : 1)


  let latestMp3s = mp3s.reduce((accumulator, mp3) => {
    if(!accumulator.find((a) => {
      return a.fwpm === mp3.fwpm && a.wpm === mp3.wpm &&
             a.repeat === mp3.repeat &&
             a.name === mp3.name
    })) {
      accumulator.push(mp3)
    }
    return accumulator
  }, [])

  return {
    props: {
      files: latestMp3s
    },
  }
}

export async function getStaticPaths(context) {
  const files = await readdir('./public')

  const mp3s = files.filter(function(file) {
    return path.extname(file).toLowerCase() === '.mp3';
  }).map(parseFilename);
  const reducer = (accumulator, currentValue) => {
    if (accumulator.indexOf(currentValue.fwpm) < 0) {
      accumulator.push(currentValue.fwpm)
    }
    return accumulator
  }
  let wpms = mp3s.reduce(reducer, [])


  // Get the paths we want to pre-render based on posts
  const paths = wpms.map((wpm) => `/${wpm}`)

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false } 
}
