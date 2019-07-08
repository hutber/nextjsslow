import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
      fontFamily: '"Indie Flower", handwriting',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    h1: {
      fontFamily: '"Indie Flower", handwriting',
    },
  },
})

export default theme
