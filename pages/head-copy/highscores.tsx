import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getHighscores, getTotalCharacterDecoded } from '../../lib/head_copy/highscore_storage';

export default function Highscores() {

    const router = useRouter();
    const query = router.query;
    const mode: string = [].concat(query.mode)[0] || "";
    const scoreTime = parseInt([].concat(query.scoretime)[0] || "0", 10);

    const [windowLoaded, setWindowLoaded] = useState(false)

    function getHighscoreList() {
        let highscores = null
        if (mode) {
            highscores = getHighscores(mode).map((h, idx) => {
                const ts = Math.floor(h.createdAt.getTime() / 1000)
                const active = ts === scoreTime;
                const t = h.createdAt
                const dateStr = `${t.getFullYear()}.${t.getMonth()+1}.${t.getDate()}`
                return (
                    <Link key={ts} href={`#${ts}`}>
                        <li className={`${active ? 'text-blue-600' : ''}`}>
                            {h.score} - {h.percentCorrect}% @{h.wpm}wpm on {dateStr}
                        </li>
                    </Link>
                )
            })
            return <ul>{highscores}</ul>
        }
        return <> </>
    }

    useEffect(() => setWindowLoaded(true))

    // Need to handle SSR issues with this page (window not available)
    if (!windowLoaded) {
        return <div> Loading... </div>
    }

    return <div className="container w-full md:max-w-4xl mx-auto pt-5 eightbit-font">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <h1>Highscores</h1>
        <h3 className="text-sm">Characters Decoded: {getTotalCharacterDecoded()}</h3>
        <div className="text-xs">
            {getHighscoreList()}
        </div>
        <Link href={`/head-copy.html`}>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3">Done</button>
        </Link>
        </div>
    </div>


}