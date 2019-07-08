import config from '../../../config'
import { getHtml } from '../../../utils'

const getAllArtsits = async () => {
  const $ = await getHtml(`${config.frenchUrl}peintres.php`)

  var artists = []
  $('form[action="peintres.php"] center > table > tbody > tr')
    .not('.soustitre')
    .each(function() {
      const ourRow = $(this).find('td[class]')
      const surname = ourRow
        .eq(0)
        .find('a')
        .text()
      const firstname = ourRow
        .eq(1)
        .find('a')
        .text()
      const nationality = ourRow
        .eq(2)
        .find('img')
        .attr('src')
      const www = ourRow
        .eq(9)
        .find('a')
        .attr('href')
      const cmon = ourRow
        .eq(10)
        .find('a')
        .attr('href')
      const email = ourRow
        .eq(11)
        .find('a')
        .attr('href')

      artists.push({
        surname,
        firstname,
        nationality: nationality ? nationality.split('img/')[1].split('.gif')[0] : '',
        www,
        cmon,
        email,
      })
    })
  return artists
}

export default {
  getAllArtsits,
}
