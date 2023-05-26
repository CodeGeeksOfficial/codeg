import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { wrapper } from "src/core/redux/store";
import { AuthContextProvider } from '../utils/auth'

function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        {process.env.NODE_ENV === "production" && <title>CodeG</title>}
      </Head>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </div>
  );
}

export default wrapper.withRedux(App);
