import React from "react"
import Head from 'next/head'
import './styles.css'
import config from '../config'
import { useRouter } from "next/dist/client/router"

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
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.TRACKING_ID}`;
    script.async = true;
    document.body.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments)}
    window.gtag('js', new Date());
    window.gtag('config', config.TRACKING_ID, {client_storage: 'none', anonymize_ip: true});
  }
}

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  React.useEffect(() => {
    if (typeof(window) === 'undefined') { return }
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
