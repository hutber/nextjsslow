import fetch from 'isomorphic-unfetch'
import graphqlEndPoints from '../../../../server/api/graphqlEndPoints'

import Layout from '../../../components/shared/Container.js'

const Admin = props => {
  const getArtists = async () => {
    const res = await fetch(`http://localhost:3000/scrape/french/getAndCreateAllArtists`)
    const getWinners = await res.json()
    console.info(getWinners)
  }
  const updateOneArtist = async () => {}

  return (
    <Layout>
      <p>Admin - Artist</p>
      <button onClick={() => getArtists()}>Get All Artists</button>
      {props.artists.map(artist => {
        return (
          <div key={`${artist.firstname}_${artist.surname}_1`}>
            <h3>{`${artist.firstname} ${artist.surname}`}</h3>
            <button onClick={() => updateOneArtist()}>Update details</button>
          </div>
        )
      })}
    </Layout>
  )
}

Admin.getInitialProps = async function() {
  const artists = await graphqlEndPoints.artists.getAllArtsits()
  return { artists }
}
export default Admin
