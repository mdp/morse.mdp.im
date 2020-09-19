import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400 shadow mt-20">
      <div className="container max-w-4xl mx-auto flex py-8">
        <div className="w-full mx-auto flex flex-wrap">
          <div className="flex w-full md:w-1/2">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">About Morse News</h3>
              <p className="py-4 text-gray-600 text-sm">
                Morse News is an open source project by Mark Percival (KC4T) for the <a href="https://longislandcwclub.org/">Long Island CW Club</a>.
                You can find the source code on <a href="https://github.com/mdp/morse_code_news">Github</a>
              </p>
            </div>
          </div>

          <div className="flex w-full md:w-1/2">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">
                Get the Podcast on your phone
              </h3>
              <p className="py-4 text-gray-600 text-sm">
                The headlines on this site are also available as a 20wpm podcast and available
                on <a href="https://podcasts.apple.com/us/podcast/id1531399638">iTunes</a> and <a href="https://www.listennotes.com/podcasts/news-headlines-in-morse-code-at-20-wpm-mark-JIUqd6RwXsa/">ListenNotes</a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}