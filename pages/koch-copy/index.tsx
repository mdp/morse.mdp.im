import Link from 'next/link'
import { useRouter } from 'next/dist/client/router';
import {lcwoGameList, cwopsGameList} from '../../lib/head_copy/game_list';
import Footer from '../../components/head-copy/footer'

const subModes = [
  {
    name: "LCWO", id: "lcwo",
    description: "Koch in LCWO order",
    games: lcwoGameList
  },
  {
    name: "CWOps Academy", id: "cwops",
    description: "Koch with CWOps Academy Beginner order",
    games: cwopsGameList
  },
]

export default function Index() {
  const router = useRouter();
  const query = router.query;
  const subModeParam = [].concat(query.submode)[0] || null;

  function listGames(gameList: any[]) {
    return gameList.map((game) =>
      <li className="items-center my-2 px-4" key={game.id}>
        <Link href={`/koch-copy/play/?mode=${game.id}`} passHref>
          <button className="w-full justify-center rounded-md border border-gray-300 p-4"
          >{game.name}</button>
        </Link>
      </li>
    )
  }

  function renderGameList(subModeId: string) {
    const subMode = subModes.find((s)=>s.id === subModeId)
    return (
      <form className="w-full max-w-lg pb-10 mx-auto">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0 text-center">
            <h3 className="text-2xl font-bold pt-2">{subMode.name}</h3>
            <p className="text-base pt-1">{subMode.description}</p>
            <ul>{listGames(subMode.games)}</ul>
          </div>
        </div>
      </form>
    )
  }

  function renderSubModeSelect() {
    return (
      <form className="w-full max-w-lg pb-10 mx-auto">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0 text-center">
            <ul>
              { subModes.map((mode)=>{
                return (
                  <li className="items-center my-2 px-4" key={mode.id}>
                    <Link href={`?submode=${mode.id}`} passHref>
                      <button className="w-full justify-center rounded-md border border-gray-300 p-4"
                      >{mode.name}</button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </form>
    )
  }

  return (
    <div className="container w-full md:max-w-4xl mx-auto pt-5">
      <div
        className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <header className="font-sans text-center pb-20">
          <h1
            className="font-bold font-sans break-normal text-gray-900 text-3xl"
          > 🧠 Koch Training Games ✍️ </h1>
        </header>
        <div className="px-10">
          { subModeParam ? 
            renderGameList(subModeParam) :
            renderSubModeSelect()
          }
        </div>
      </div>
      <Footer></Footer>
    </div>
  )

}
