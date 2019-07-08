import React from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import Link from '../src/Link'
import Layout from '../components/shared/Container'

export default function Index() {
  return (
    <Layout>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js v4-beta example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
      </Box>
    </Layout>
  )
}
