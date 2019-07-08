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

const createCategory = async variables => {
  const rawQuery = `
    mutation CreateCategory($name:String){
      createCategory (input: {
         category: {
          name: $name
        }
      }) {
         category {
          name
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
  createCategory,
}
