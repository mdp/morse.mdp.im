import fs from 'fs'
import path, { parse } from 'path'
import { promisify } from 'util'

const readdir = promisify(fs.readdir);

export default function Index({ files }) {
  console.log("Files:", files)
  return (
    <div>
      <h1>📰  Morse Code News 📰 </h1>
      <h2>Last Update: {new Date(files[0].date).toUTCString().replace(" GMT", "Z")}</h2>
      <ul>
        {files.map((file) => (
          <li>
            <a href={file.file}>
              {file.name} - {file.repeat} | {file.wpm}@{file.fwpm}
            </a>
            <span className='right'>
              <a href={file.file.replace(/mp3$/, 'txt')} target='_blank'>
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


function parseFilename(filename) {
  const parts = filename.split("-")
  const name = parts[0].replace("_", " ")
  const repeat = parts[1]
  const speed = parts[2]
  const [wpm, fwpm] = speed.split("x")
  const date = Date.now(parts[3])
  return {
    name,
    wpm,
    repeat,
    fwpm,
    date,
    file: filename,
  }
}

export async function getStaticProps({params}) {
  const files = await readdir('./public')
  console.log("Files", files)
  let mp3s = files.filter((file) => {
    return path.extname(file).toLowerCase() === '.mp3'
  }).map(parseFilename);
  mp3s = mp3s.filter((file) => {
    return file.fwpm === params['wpm']
  })
  return {
    props: {
      files: mp3s
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
  console.log(wpms)

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false } 
}
