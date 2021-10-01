import Link from 'next/link'
import Footer from '../components/head-copy/footer'



export default function Index() {

  return (

    <div className="container w-full md:max-w-2xl mx-auto pt-5">
      <div
        className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal" >
        <header className="font-sans text-center pb-20">
          <h1
            className="font-bold font-sans break-normal text-gray-900 text-3xl"
          >💡 KC4T Morse Trainer 🤔</h1>
        </header>
        <div className="px-10">
        <ul>
          <li className="items-center my-2 px-4">
            <Link href={`/head-copy/`} passHref>
              <button className="w-full justify-center rounded-md border border-gray-300 p-4"
              >Head Copy Games</button>
            </Link>
          </li>
          <li className="items-center my-2 px-4">
            <Link href={`/news/`} passHref>
              <button className="w-full justify-center rounded-md border border-gray-300 p-4"
              >Morse Code Headlines</button>
            </Link>
          </li>
        </ul>
        </div>
      </div>
      <Footer></Footer>
    </div>
  )

}
