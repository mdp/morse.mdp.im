import Link from 'next/link'


export default function Index() {

  return (
    <div className="container w-full md:max-w-4xl mx-auto pt-5">
      <div className="px-10">
        <ul>
          <li className="items-center my-2 px-4">
            <Link href={`/news/`}>
              <button className="w-full justify-center rounded-md border border-gray-300 p-4"
              >Morse Code Headlines</button>
            </Link>
          </li>
          <li className="items-center my-2 px-4">
            <Link href={`/head-copy/`}>
              <button className="w-full justify-center rounded-md border border-gray-300 p-4"
              >Head Copy Games</button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )

}
