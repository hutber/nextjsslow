import React from 'react'

import Container from '@material-ui/core/Container/index'

import Header from './header'

export default function Layout(props) {
  return (
    <Container maxWidth="lg">
      <Header />
      {props.children}
    </Container>
  )
}
