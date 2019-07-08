import pg from 'pg'
import PAS from 'postgraphile-apollo-server'
import AP from 'apollo-server'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'

const { makeSchemaAndPlugin } = PAS
const { ApolloServer } = AP

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPwd = process.env.DB_PWD
const dbUrl = dbPwd
  ? `postgres://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbName}`
  : `postgres://${dbHost}:${dbPort}/${dbName}`

const pgPool = new pg.Pool({
  connectionString: dbUrl,
})

async function main() {
  const { schema, plugin } = await makeSchemaAndPlugin(
    pgPool,
    'public', // PostgreSQL schema to use
    {
      appendPlugins: [ConnectionFilterPlugin],
      graphiql: true,
      // PostGraphile options, see:
      // https://www.graphile.org/postgraphile/usage-library/
    }
  )

  const server = new ApolloServer({
    schema,
    plugins: [plugin],
  })

  const { url } = await server.listen()
  console.log(`🚀 Server ready at ${url}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})

// import express from 'express'
// import pg from 'pg'
// import graphqlHTTP from 'express-graphql'
// import PAS from 'postgraphile-apollo-server'
// import AP from 'apollo-server-express'
//
// const { makeSchemaAndPlugin } = PAS
// const { ApolloServer } = AP
//
// const env = process.env.NODE_ENV || 'development'
// const dbHost = process.env.DB_HOST
// const dbPort = process.env.DB_PORT
// const dbName = process.env.DB_NAME
// const dbUser = process.env.DB_USER
// const dbPwd = process.env.DB_PWD
// const dbUrl = dbPwd
//   ? `postgres://${dbUser}:${dbPwd}@${dbHost}:${dbPort}/${dbName}`
//   : `postgres://${dbHost}:${dbPort}/${dbName}`
//
// const pgPool = new pg.Pool({
//   connectionString: dbUrl,
// })
//
// async function main() {
//   const { schema, plugin } = await makeSchemaAndPlugin(
//     pgPool,
//     'public', // PostgreSQL schema to use
//   )
//
//   const server = new ApolloServer({
//     schema,
//     plugins: [plugin],
//   })
//   const app = express()
//
//   app.use(
//     '/graphql',
//     graphqlHTTP({
//       schema: schema,
//       graphiql: true,
//     })
//   )
//
//   server.applyMiddleware({ app })
//
//   app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))
// }
//
// main().catch(e => {
//   console.error(e)
//   process.exit(1)
// })
