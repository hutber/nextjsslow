import Link from 'next/link'
import styles from './style'
import withStyles from '@material-ui/core/styles/withStyles'

export const urls = {
  home: '/',
  admin: {
    home: '/admin',
    artists: '/admin/artists',
  },
}

const navigation = [
  {
    text: 'Home',
    href: urls.home,
  },
  {
    text: 'Admin',
    href: urls.admin.home,
  },
  {
    text: 'Admin Artists',
    href: urls.admin.artists,
  },
]

const Index = function({ classes }) {
  return (
    <header className={classes.container}>
      <Link href="/">
        <a className={classes.logo}>
          <h1>Demon Info</h1>
        </a>
      </Link>
      <nav>
        {navigation.map(item => (
          <Link key={`${item.name}${item.href}`} href={item.href}>
            <a className={classes.link}>{item.text}</a>
          </Link>
        ))}
      </nav>
    </header>
  )
}

export default withStyles(styles)(Index)
