import fs from 'fs'
import path, { parse } from 'path'
import { promisify } from 'util'

const readdir = promisify(fs.readdir);

import Link from 'next/link';

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

export async function getStaticProps(context) {
  const files = await readdir('./public')
  console.log("Files", files)
  const mp3s = files.filter(function(file) {
    return path.extname(file).toLowerCase() === '.mp3';
  }).map(parseFilename);
  return {
    props: {
      files: mp3s
    },
  }
}
