import { getHtml, c } from '../../../utils'

const getAllTheAwardsAllTheGoldenDemonInOneCountries = async awards => {
  return await Promise.all(
    awards.map(async events => {
      return await Object.keys(events.categories).reduce((acc, cur) => {
        return acc.then(async data => {
          c(`Scraping ${events.categories[cur]}`)
          const newData = await getAwardsInfoFromIndvidiualCategoryPage(events.categories[cur])
          if (!data[events.country]) data[events.country] = { [events.year]: [] }
          data[events.country][events.year].push({
            category: cur,
            results: newData,
          })
          return data
        })
      }, Promise.resolve({}))
    })
  )
}

const getAllAwardsFromAnIndividualGoldenDemonEvent = async eventDetails => {
  try {
    return await Promise.all(
      await Object.keys(eventDetails).reduce((acc, cur) => {
        return acc.then(async data => {
          c(`Scraping ${eventDetails[cur]}`)
          const newData = await getAwardsInfoFromIndvidiualCategoryPage(eventDetails[cur])
          data.push({ [cur]: newData })
          return data
        })
      }, Promise.resolve([]))
    )
  } catch (err) {
    c(err)
  }
}

const getAwardsInfoFromIndvidiualCategoryPage = async scrapeUrl => {
  const $ = await getHtml(scrapeUrl)
  return $('a[name]')
    .map(function() {
      if ($(this).attr('name') !== 'top') {
        const placement = $(this).attr('name')
        const placementDetails = $(this)
          .next()
          .next()
        const originalImages = placementDetails.next().find('img')

        const fullName = placementDetails
          .find('b')
          .text()
          .trim()
          .split('by')
        const name = fullName.length > 1 ? fullName[1].trim() : fullName[0].trim()

        const images = originalImages
          .map(function() {
            return $(this).attr('src')
          })
          .toArray()
          .filter(item => item !== '../..//img/copyright_en.jpg')
        return {
          placement,
          name,
          images,
        }
      }
    })
    .get()
}

export default {
  getAwardsInfoFromIndvidiualCategoryPage,
  getAllAwardsFromAnIndividualGoldenDemonEvent,
  getAllTheAwardsAllTheGoldenDemonInOneCountries,
}
