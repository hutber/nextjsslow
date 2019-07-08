import fetch from 'isomorphic-unfetch'
import Layout from '../../components/shared/Container.js'
import Link from 'next/link'

const Admin = props => {
  return (
    <Layout>
      <p>Admin</p>
    </Layout>
  )
}

Admin.getInitialProps = async function({ query }) {
  // const res = await fetch('http://localhost:3000/api/getFrance')
  // const data = await res.json()
  console.info(query)
  const data = {}
  return {
    data,
  }
}

export default Admin
