import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import '@/styles/index.css'
import '@/styles/fonts.css'

export default function App({
  Component, pageProps: { session, ...pageProps }
}) {
  return (
    <main>
    <SessionProvider session={session}>
      <Component {...pageProps}/>
    </SessionProvider>
    </main>
  )
}