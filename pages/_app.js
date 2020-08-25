import "../styles/globals.css";
import React from "react";
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>cTrace</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
