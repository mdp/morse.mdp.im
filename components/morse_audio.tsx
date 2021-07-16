import { useEffect, useRef, useState } from "react"
import MorseCWWave from 'morse-pro/lib/morse-pro-cw-wave'
import getDataURI from 'morse-pro/lib/morse-pro-util-datauri';
import * as RiffWave from 'morse-pro/lib/morse-pro-util-riffwave';

interface MorseAudioProps {
    text: string,
    wpm: number,
    fwpm: number,
    freq?: number,
    preDelay?: number,
    onComplete: () => void,
}

export default function MorseAudio(props: MorseAudioProps) {

    const audioRef = useRef<HTMLAudioElement>(null)
    const previousContent = useRef(null)
    const [state, setState] = useState("new")

    if (props.text && props.text !== previousContent.current && audioRef.current) {
        // Only play if the content has changed and we have a current audio element rendered
        previousContent.current = props.text
        setupForPlay()
        setState("initializing")
    }
    
    function canPlay() {
        if (state !== "stopped") {
            audioRef.current.play()
            setState("playing")
        }
    }

    function onComplete() {
        setState("stopped")
        props.onComplete()
    }

    function setupForPlay() {
        var morseCWWave = new MorseCWWave(true, props.wpm, props.fwpm);
        morseCWWave.translate(props.text);
        const timings = morseCWWave.getTimings();
        // On mobile(ios with bluetooth) we need to lead with some space.
        // On bluetooth it seems to launch the sound and quickly fade in the
        // audio which clips the first dit sometimes
        timings.unshift(props.preDelay || -250) // 250ms seems like a reasonable amount
        const sample = MorseCWWave.getSampleGeneral(timings, props.freq || 700, morseCWWave.sampleRate, 10);
        const datauri = getDataURI(RiffWave.getData(sample), RiffWave.getMIMEType()); // create an HTML5 audio element
        if (audioRef.current) {
            audioRef.current.src = datauri
            audioRef.current.load()
        }
    }

    useEffect(() => {
        // On the first render, call setup for play after the audio element is instantiated
        if (state === "new") {
            setState("initializing") // Will re-render the component but with audioRef set
        }
    })

    // TODO: Place an optional button here to pause/stop playback on pages that
    // need control (eg. headlines)
    return <>
        <audio ref={audioRef} onEnded={onComplete} onCanPlayThrough={canPlay}></audio>
    </>

}