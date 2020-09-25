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
  return <Component {...pageProps} />
}