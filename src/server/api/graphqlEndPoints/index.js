import axios from 'axios'
import { c } from './../../utils'
import { graphqlLodash } from 'graphql-lodash'

import artists from './artists'
import categories from './category'
import awards from './awards'
import events from './events'

export const graphql = async ({ rawQuery, variables = null, queryName = '' }) => {
  const { query, transform } = graphqlLodash(rawQuery)
  try {
    const { data } = await axios({
      url: 'http://localhost:4000/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: JSON.stringify({
        query,
        variables,
      }),
    })
    if (data.errors) {
      c(data.errors[0])
      c(data.errors)
    }
    return transform(data.data)
  } catch (err) {
    c(err)
    c(err.response.data.errors[0])
    c(err.response.data.errors)
  }
}

export default {
  artists,
  categories,
  awards,
  events,
}
