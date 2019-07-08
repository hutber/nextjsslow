import config from '../../../config'
import { getHtml, c } from '../../../utils'

const getEventCategoryLinks = async ({ scrapeUrl, year, country }) => {
  c(`Scraping ${scrapeUrl} for Category Links`)
  const $ = await getHtml(scrapeUrl)
  const demons = {
    year,
    country,
    categories: {},
  }
  try {
    $('td:nth-child(3)[bgcolor="#FFFFFF"] table')
      .children()
      .last()
      .find('tr:not([height])')
      .each(function() {
        const tds = $(this).find('td')
        const firstUrl = tds[0]
        const firstDetails = tds[1]
        const secondDetails = tds[2]
        const secondUrl = tds[3]

        const firstCat = $(firstDetails)
          .not('b')
          .text()
          .split(':')[1]
          .split('Golden Demon')[0]
          .trim()

        const secondCat = $(secondDetails)
          .not('b')
          .text()
          .split(':')
        const secondCatCleaned =
          secondCat.length > 1 ? secondCat[1].split('Golden Demon')[0].trim() : secondCat[0].trim()

        demons.categories[firstCat] = `${config.frenchUrl}/${
          $(firstUrl)
            .find('a')
            .attr('href')
            .split('../../')[1]
        }`

        if (secondCatCleaned)
          demons.categories[secondCatCleaned] = `${config.frenchUrl}/${
            $(secondUrl)
              .find('a')
              .attr('href')
              .split('../../')[1]
          }`
      })

    return demons
  } catch (err) {
    c(err)
    c(`
    
    Failed:
    ${scrapeUrl}
    
    `)
    return demons
  }
}

export default {
  getEventCategoryLinks,
}
