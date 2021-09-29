import React from "react"
import Head from 'next/head'
import './styles.css'
import { TRACKING_ID } from '../config'

function ensureHTTPS(window) {
  if (window
    && window.location.protocol === "http:"
    && window.location.host === 'morse.mdp.im'
  ) {
    window.location.protocol = 'https'
  }
}

// Privacy preserving Google Analytics, no cookies and an anonymized IP
// Only tracks pageviews for usage stats, no user or session tracking
function anonymousGoogleTracking(window) {
  if (window) {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push(['js', new Date()]);
    dataLayer.push(['config', TRACKING_ID, {client_storage: 'none', anonymize_ip: true}]);
  }

  const script = document.createElement('script');
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-6LX83HX0LX";
  script.async = true;
  document.body.appendChild(script);
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {

  React.useEffect(() => {
    ensureHTTPS(window);
    anonymousGoogleTracking(window)
  }, []);

  return (
    <>
      <Head>
        <title>Morse.mdp.im</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
