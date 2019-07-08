import gql from 'graphql-tag'

export const getEvents = `
  {
    awards: allAwards @_(get: "edges") {
      edges @_(map: "node") {
        node {
          categoryId
          place
          artistId
          eventId
          oop
          modelReleaseDate
          date
          dateCreated
        }
      }
    }
  }
`
export const getAllEvents = `
  {
    events: allEvents @_(get: "edges") {
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

export const getEventById = `
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
