import React from "react"
import Head from 'next/head'
import './styles.css'

function ensureHTTPS(window) {
  if (window
    && window.location.protocol === "http:"
    && window.location.host === 'morse.mdp.im'
  ) {
    window.location.protocol = 'https'
  }
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  React.useEffect(() => {
    ensureHTTPS(window);
  });

  return (
    <>
      <Head>
        <title>Morse.MDP.IM</title>
        <meta name="viewport" content="width=device-width, height=device-height, viewport-fit=cover, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
