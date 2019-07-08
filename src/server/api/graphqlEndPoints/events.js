import axios from 'axios/index'
import { graphql } from './index'

export const getAllEvents = async () => {
  const query = `{
  allEvents {
    edges {
      node {
        year
        name
        country
        location
        date
        url
      }
    }
  }}`
  try {
    const request = await axios({
      url: 'http://localhost:4000/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: JSON.stringify({
        query: query,
      }),
    })
    return request.data.data.allEvents.edges.reduce((acc, { node }) => {
      if (!acc[node.country]) {
        acc[node.country] = [node]
      } else {
        acc[node.country].push(node)
      }
      return acc
    }, {})
  } catch (err) {
    console.error(err.response.data.errors[0])
    console.error(err.response.data.errors)
    return err
  }
}

export const getEventByCountry = async (year, country) => {
  const rawQuery = `
  query getEventByYearCountry($year: Int, $country:String) {
    allEvents(filter:{ year:{ equalTo:$year}, country: { equalTo:$country}}) @_(get: "edges") {
      edges @_(map: "node") {
        node {
          eventId
          year
          name
          country
          location
          date
          url
        }
      }
    }
  }
`
  return await graphql({
    rawQuery,
    variables: {
      year: Number.parseInt(year),
      country,
    },
  })
}

export const getEventById = async eventId => {
  const rawQuery = `
  query getEvent($eventId:Int!) {
    eventByEventId(eventId: $eventId){
      eventId
      year
      name
      country
      location
      url
      date
    }
  }
`
  return await graphql({
    rawQuery,
    variables: {
      eventId: Number.parseInt(eventId),
    },
  })
}

export default {
  getAllEvents,
  getEventById,
}
