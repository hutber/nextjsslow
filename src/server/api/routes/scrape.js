import { getUnquie, c } from '../../utils'

import awardsScraper from '../scraper/french/demonwinners.awards.fr'
import artistsScraper from '../scraper/french/demonwinners.artists.fr'
import eventScraper from '../scraper/french/demonwinners.events.fr'
import categoryScraper from '../scraper/french/demonwinners.category.fr'

import { getEventByCountry } from '../graphqlEndPoints/events'
import graphqlEndPoints from '../graphqlEndPoints'

export default server => {
  server.get('/scrape/french/updateEvents', async (req, res) => {
    const allEvents = await eventScraper.getAllFrenchGoldenDemonEvents()
    res.json({ newEvents: allEvents.length })
  })

  server.get('/scrape/french/fullSitePull', async (req, res) => {
    const allEvents = await eventScraper.getAllFrenchGoldenDemonEvents()
    const country = 'japan'
    const allCatgeoryAwardsPages = await Promise.all(
      allEvents[country].map(async event =>
        categoryScraper.getEventCategoryLinks({
          scrapeUrl: event.url,
          year: event.year,
          country: country,
        })
      ) //TODO change from japan
    )

    const allAwards = await awardsScraper.getAllTheAwardsAllTheGoldenDemonInOneCountries(allCatgeoryAwardsPages)
    res.json(allAwards)
  })

  server.get('/scrape/french/fullCountryUpdate/:countryName', async (req, res) => {
    try {
      if (req.params.countryName) {
        const allEvents = await eventScraper.getAllFrenchGoldenDemonEvents()
        const allEventCategoryLinks = await Promise.all(
          await allEvents[req.params.countryName].reduce((acc, event) => {
            return acc.then(async data => {
              const eventData = await categoryScraper.getEventCategoryLinks({
                scrapeUrl: event.url,
                year: event.year,
                country: req.params.countryName,
              })
              data.push(eventData)
              return data
            })
          }, Promise.resolve([]))
        )
        const countriesWithAways = await awardsScraper.getAllTheAwardsAllTheGoldenDemonInOneCountries(
          allEventCategoryLinks
        )
        const { allCategories, allArtists } = await eventScraper.getCategoriesAndArtists()
        const mergedCategories = allEventCategoryLinks.reduce((acc, { categories }) => {
          return [...new Set([...acc, ...Object.keys(categories)])]
        }, [])

        const [newCategories] = await Promise.all(
          mergedCategories
            .filter(item1 => {
              return !allCategories.some(item2 => item2['name'].toLocaleLowerCase() === item1.toLocaleLowerCase())
            })
            .map(category => {
              return graphqlEndPoints.categories.createCategory({
                name: category,
              })
            })
        )
        const updatedCategories = await graphqlEndPoints.categories.getAllcategories()

        const convertToJustCountriesAndYearsEvents = {}
        countriesWithAways.forEach(country => {
          if (!convertToJustCountriesAndYearsEvents[Object.keys(country)])
            convertToJustCountriesAndYearsEvents[Object.keys(country)] = {}

          Object.keys(country[Object.keys(country)]).forEach(eventYear => {
            if (!convertToJustCountriesAndYearsEvents[Object.keys(country)][eventYear])
              convertToJustCountriesAndYearsEvents[Object.keys(country)][eventYear] =
                country[Object.keys(country)][eventYear]
          })
        })

        //Get all events from the units we are going to submit to give to `createAward`
        const events = await Promise.all(
          Object.keys(convertToJustCountriesAndYearsEvents).map(async country => {
            const details = await Promise.all(
              Object.keys(convertToJustCountriesAndYearsEvents[country]).map(async year => {
                const { allEvents: [event] = null } = await getEventByCountry(year, country)
                const awards = convertToJustCountriesAndYearsEvents[event.country][event.year].map(award => {
                  const [categoryItem] = updatedCategories.filter(
                    category => category.name.toLocaleLowerCase() === award.category.toLocaleLowerCase()
                  )
                  return {
                    ...award,
                    categoryId: categoryItem.categoryId,
                  }
                })
                return {
                  [year]: {
                    event,
                    awards,
                  },
                }
              })
            )
            return { [country]: details }
          })
        )
        await eventScraper.updateCreateMultipleEvents(events[0], newCategories, allArtists)
        res.json({ result: true })
      } else {
        res.status(404).send({ error: 'No countryName sent' })
      }
    } catch (err) {
      c(err)
    }
  })

  server.get('/scrape/french/getUpdateSingleEventAndAwards/:eventId', async (req, res) => {
    const { eventByEventId } = await graphqlEndPoints.events.getEventById(req.params.eventId)
    await eventScraper.updateCreateSingleEventAndAwards(eventByEventId)
    res.json({ success: true })
  })

  server.get('/scrape/french/getAndCreateAllArtists', async (req, res) => {
    //check and create artists pages
    const allArtists = await graphqlEndPoints.artists.getAllArtsits()
    const scrapeArtists = await artistsScraper.getAllArtsits()
    const cleanedScrapeArtists = scrapeArtists.filter(
      (thing, index, self) =>
        index === self.findIndex(t => t.surname === thing.surname && t.firstname === thing.firstname)
    )
    const newArtists = getUnquie(cleanedScrapeArtists, allArtists, 'surname')
    await Promise.all(newArtists.map(artist => graphqlEndPoints.artists.createArtists(artist)))
    res.json({ newArtists })
  })
}
