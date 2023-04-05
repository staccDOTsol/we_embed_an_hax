import { ContextProvider } from "@/contexts/ContextProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";


require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');
export default function App({ Component, pageProps }: AppProps) {
  return (
  
    <ContextProvider><Component {...pageProps} /> </ContextProvider>);
}
