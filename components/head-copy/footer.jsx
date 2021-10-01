import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400 mt-20 max-w-lg mx-auto">
      <div className="container mx-auto flex py-8">
        <div className="w-full mx-auto flex flex-wrap">
          <div className="flex w-full">
            <div className="px-8">
              <h3 className="font-bold text-gray-900">About morse.mdp.im</h3>
              <p className="py-4 text-gray-600 text-sm">
                This is an open source project by Mark Percival (KC4T).
                You can find the source code on <a href="https://github.com/mdp/morse.mdp.im">Github</a>
              </p>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}