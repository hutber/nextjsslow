import express from 'express'
import next from 'next'
import expressGraphiqlMiddleware from 'express-graphiql-middleware'
import requestProxy from 'express-request-proxy'

import scrape from './src/server/api/routes/scrape'

const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev,
  dir: './src/client',
})
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post'
      const queryParams = { title: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    //Scraping Tools
    scrape(server)

    server.get(
      '/graphiql',
      expressGraphiqlMiddleware({ endpointURL: 'http://localhost:4000/graphql', rewriteURL: true })
    )

    server.use(
      '/graphql',
      requestProxy({
        cache: false,
        timeout: 20000,
        url: 'http://localhost:4000/graphql',
      })
    )

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(ex => {
    console.info('error')
    console.error(ex.stack)
    process.exit(1)
  })
