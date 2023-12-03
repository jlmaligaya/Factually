import { SessionProvider } from "next-auth/react";
import Layout from "../components/Layout";
import { getSession } from "next-auth/react";
import Head from "next/head";
import "../styles/globals.css";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Other head elements, like title, link to stylesheets, etc. */}
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
