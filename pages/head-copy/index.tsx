import {turnGameList, streakGameList, rufzxpGameList} from '../../lib/head_copy/game_list';
import Link from 'next/link'

export default function Index() {

  function listGames(type) {
    let gameList = []
    switch(type) {
      case 'regular':
        gameList = turnGameList;
        break;
      case 'streak':
        gameList = streakGameList;
        break;
      case 'rufzxp':
        gameList = rufzxpGameList;
        break;
    }

    return gameList.map((game) =>
      <li className="items-center my-2 px-4" key={game.id}>
        <Link href={`/head-copy/play/?mode=${game.id}`}>
          <button className="w-full justify-center rounded-md border border-gray-300 p-4"
          >{game.name}</button>
        </Link>
      </li>
    )
  }

  return (
    <div className="container w-full md:max-w-4xl mx-auto pt-5">
      <div
        className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <header className="font-sans text-center pb-20">
          <h1
            className="font-bold font-sans break-normal text-gray-900 text-3xl"
          > 🧠 Head Copy ✍️ </h1>
        </header>
        <div className="px-10">
          <form className="w-full max-w-lg pb-10 mx-auto">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0 text-center">
                <h3 className="text-2xl font-bold pt-2">Regular Mode</h3>
                <p className="text-base pt-1">50 turns, and the faster you answer the higher your score.</p>
                <ul>{listGames('regular')}</ul>
              </div>
              <div className="w-full px-3 mb-6 md:mb-0 text-center">
                <h3 className="text-2xl font-bold pt-2">Streak Mode</h3>
                <p className="text-base pt-1">3 strikes and you're out. How long can you go?</p>
                <ul>{listGames('streak')}</ul>
              </div>
              <div className="w-full px-3 mb-6 md:mb-0 text-center">
                <h3 className="text-2xl font-bold pt-2">RufzXP Mode</h3>
                <p className="text-base pt-1">50 turns, answer correctly and you're rewarded with a faster speed.</p>
                <ul>{listGames('rufzxp')}</ul>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )

}
