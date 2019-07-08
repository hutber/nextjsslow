import fetch from 'isomorphic-unfetch'
import { graphqlLodash } from 'graphql-lodash'
import { getAllEvents } from './queries'
import { c } from '../../../server/utils'

import Layout from '../../components/shared/Container.js'

const Admin = props => {
  const getAllDetails = async url => {
    const res = await fetch('http://localhost:3000/scrape/french/fullSitePull')
    const data = await res.json()
    c(data)
  }

  const getCountriesEntries = async country => {
    const res = await fetch(`http://localhost:3000/scrape/french/fullCountryUpdate/${country}`)
    const getWinners = await res.json()
    c(getWinners)
  }

  const getEventsDetails = async eventId => {
    const res = await fetch(`http://localhost:3000/scrape/french/getUpdateSingleEventAndAwards/${eventId}`)
    const getWinners = await res.json()
    c(getWinners)
  }

  return (
    <Layout>
      <p>Admin</p>
      <button onClick={() => getAllDetails()}>Get All French Data</button>
      {Object.keys(props.events).map(item => {
        const country = props.events[item]
        return (
          <div key={`${item}_as`}>
            <h3>{item}</h3> <button onClick={() => getCountriesEntries(item)}>Get countries entries</button>
            <ul>
              {country.map(event => (
                <li key={`${event.name}_as`}>
                  <button onClick={() => getEventsDetails(event.eventId)}>{event.name}</button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </Layout>
  )
}

Admin.getInitialProps = async function() {
  const { query, transform } = graphqlLodash(getAllEvents)
  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const { data } = await res.json()
  const { events } = transform(data)

  return {
    events: events.reduce((acc, event) => {
      if (!acc[event.country]) {
        acc[event.country] = [event]
      } else {
        acc[event.country].push(event)
      }
      return acc
    }, {}),
  }
}
export default Admin
