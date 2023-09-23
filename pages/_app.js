import "../styles/globals.css";
import { SessionProvider } from "next-auth/react"
import Layout from "../components/Layout";
import { getSession } from 'next-auth/react';

export default function MyApp({
   Component, 
   pageProps: {session, ...pageProps} }) {
  
  // const getLayout = Component.getLayout || ((page) => page)
  return <SessionProvider session={session}><Component {...pageProps} /></SessionProvider>
}

