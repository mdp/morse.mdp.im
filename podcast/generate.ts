import { writeFile, unlink, stat } from 'fs/promises'
import { exec as execFn } from 'child_process'
import { promisify } from 'util';

const exec = promisify(execFn)


import MorseCWWave from 'morse-pro/lib/morse-pro-cw-wave'
import { getData as riffwave } from 'morse-pro/lib/morse-pro-util-riffwave'


async function createAudioFile(content, out, wpm, farnsworth): Promise<number> {
  const morseCWWave = new MorseCWWave(true, wpm, farnsworth)
  const outFileWav = `${out}.wav`
  const outFileMP3 = `${out}.mp3`
  morseCWWave.translate(content)
  await writeFile(outFileWav,
    Buffer.from(riffwave(morseCWWave.getSample()))
  )
  console.log(`Written ${outFileWav}`)
  // TODO: Error check this
  let { stdout, stderr } = await exec(`ffmpeg -i ${outFileWav} -y -codec:a libmp3lame -b:a 160k ${outFileMP3}`)
  await unlink(outFileWav)
  console.log(`Compressed ${outFileMP3}`)
  const stats = await stat(outFileMP3)
  return stats.size
}

type GenerateArgs = {
  wpm: number
  fwpm: number
  content: string
  out: string
}

type GenerateResults = {
  audioFile: string
  textFile: string
}

export async function generate(opts:GenerateArgs): Promise<number> {
  try {
    const length = await createAudioFile(opts.content, opts.out, opts.wpm, opts.fwpm)
    return length
  } catch(err) {
    console.log("Unable to create audio file: ", err)
    return 0
  }
}
