import { graphql } from './index'

const getAllcategories = async () => {
  const rawQuery = `
    {allCategories @_(get: "edges") {
      edges @_(map: "node") {
        node {
          categoryId
          name
          dateCreated
        }
      }
    }}
`
  const { allCategories } = await graphql({
    rawQuery,
    variables: null,
    queryName: `allCategories`,
  })

  return allCategories
}

const createAward = async variables => {
  const rawQuery = `
    mutation CreateAward ($categoryId: Int, $place: Int, $artistId: Int, $eventId: Int, $date: Date, $images: String) {
      createAward (input:{
        award:{
          categoryId: $categoryId
          place: $place
          artistId: $artistId
          eventId: $eventId
          date: $date
          images: $images
        }
      }) {
        award {
          awardId
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
  getAllcategories,
  createAward,
}
