import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="main-layout">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp 