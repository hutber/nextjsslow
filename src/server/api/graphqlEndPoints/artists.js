import { graphql } from './index'

const getAllArtsits = async () => {
  const rawQuery = `
    {
      allArtists @_(get: "edges") {
        edges @_(map: "node") {
          node {
            artistId
            firstname
            surname
            nationality
            www
            pp
            contact
            dateCreated
            dob
            eventsCompeted
        }
      }
    }
  }
`
  const { allArtists } = await graphql({
    rawQuery,
    variables: null,
    queryName: `allArtists`,
  })

  return allArtists
}

const createArtists = async variables => {
  const rawQuery = `
    mutation CreateArtist($firstname: String, $surname: String, $nationality: String, $www: String, $pp: String, $contact: String, $dob: Date, $eventsCompeted: JSON) {
    createArtist (input: {
      artist: {
          firstname: $firstname
          surname: $surname
          nationality: $nationality
          www: $www
          pp: $pp
          contact: $contact
          dob: $dob
          eventsCompeted: $eventsCompeted
        }
      }) {
         artist {
          artistId
          firstname
          surname
          nationality
          www
          pp
          contact
          dateCreated
          dob
          eventsCompeted
        }
      }
    }
`
  const data = await graphql({
    rawQuery,
    variables,
  })

  return data
}

export default {
  getAllArtsits,
  createArtists,
}
