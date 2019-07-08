import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '../src/theme'
import { StoreProvider } from 'easy-peasy'

import withReduxStore from '../lib/redux-store'

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <Container>
        <Head>
          <title>Demon Info - The other unofficial Golden Demon</title>
        </Head>
        <StoreProvider store={reduxStore}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </StoreProvider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
