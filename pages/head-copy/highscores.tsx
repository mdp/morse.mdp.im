import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getHighscores, getTotalCharacterDecoded } from '../../lib/head_copy/highscore_storage';
import gameList from '../../lib/head_copy/game_list'
import Game from '../../lib/head_copy/game';

export default function Highscores() {

    const router = useRouter();
    const query = router.query;
    const mode: string = [].concat(query.mode)[0] || "";
    const scoreTime = parseInt([].concat(query.scoretime)[0] || "0", 10);

    const [windowLoaded, setWindowLoaded] = useState(false)

    function getHighscoreList() {
        let highscores = null
        let mode = [].concat(query.mode)[0]
        const game: Game = gameList.find((a) => a.id === mode)
        if (mode) {
            highscores = getHighscores(mode).map((h, idx) => {
                const active = h.ts === scoreTime;
                return (
                    <Link key={h.ts} href={`#${h.ts}`}>
                        <li className={`${active ? 'text-blue-600' : ''}`}>
                            {game.parseHighscore(h)}
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

    return <div className="container w-full md:max-w-4xl mx-auto pt-5 pb-5 eightbit-font">
        <div className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <h1>Highscores</h1>
        <h3 className="text-sm">Characters Decoded: {getTotalCharacterDecoded()}</h3>
        <div className="text-xs">
            {getHighscoreList()}
        </div>
        <Link href={`/head-copy`}>
            <button className="w-full justify-center eightbit-btn text-xl p-4 mt-3 mb-3">Done</button>
        </Link>
        </div>
    </div>


}