import graphqlEndPoints from '../../graphqlEndPoints'
import { getHtml, getUnquie, c } from '../../../utils'
import config from '../../../config'

import categoryScraper from './demonwinners.category.fr'
import awardsScraper from './demonwinners.awards.fr'

import { getAllEvents } from '../../graphqlEndPoints/events'
import { writeEvent } from '../../mutations/events'

const key = item => {
  return Object.keys(item)
}

const getAllFrenchGoldenDemonEvents = async () => {
  const $ = await getHtml(config.frenchUrl)
  const goldenDemonEvents = {}

  $('#conteneurmenu > table > tbody > tr').each(function() {
    const country = $(this)
      .find('.menu a')
      .attr('href')
    if (!goldenDemonEvents[country]) goldenDemonEvents[country] = []

    $(this)
      .find('.ssmenu li')
      .each(function() {
        const url = $(this).find('a')
        const [year] = url.attr('href').match(/\d+/g)
        const [name] = url.text().split(';')
        goldenDemonEvents[country].push({
          name: name.trim(),
          year,
          url: config.frenchUrl + url.attr('href'),
        })
      })
  })

  const allEvents = await getAllEvents()
  await Promise.all(
    Object.keys(goldenDemonEvents).map(async eventCountry => {
      const events = goldenDemonEvents[eventCountry]
      const removeAlreadySavedItems =
        Object.keys(allEvents).length > 0 ? getUnquie(events, allEvents[eventCountry]) : events
      return await Promise.all(removeAlreadySavedItems.map(async event => writeEvent(event, eventCountry)))
    })
  )
  return goldenDemonEvents
}

const getCategoriesAndArtists = async () => {
  return {
    allCategories: await graphqlEndPoints.categories.getAllcategories(),
    allArtists: await graphqlEndPoints.artists.getAllArtsits(),
  }
}

const checkEventDetailsAndUpdate = async function(
  eventId,
  eventDate,
  categories,
  allCategories,
  allArtists,
  eventAwards
) {
  //check and create categories
  await Promise.all(
    getUnquie(Object.keys(categories).map(item => ({ name: item })), allCategories).map(category =>
      graphqlEndPoints.categories.createCategory(category)
    )
  )
  const refreshedCategories = await graphqlEndPoints.categories.getAllcategories()

  return await Promise.all(
    eventAwards.map(item => {
      const category = Object.keys(item)
      const [{ categoryId }] = refreshedCategories.filter(item => item.name === category[0])
      return item[category].map(award => {
        const artistDetails = allArtists.filter(artist => `${artist.firstname} ${artist.surname}` === award.name)
        return graphqlEndPoints.awards.createAward({
          categoryId,
          place: Number.parseInt(award.placement.match(/\d+/g)),
          artistId: artistDetails.length ? artistDetails[0].artistId : 0,
          eventId: Number.parseInt(eventId),
          date: eventDate,
          images: JSON.stringify(award.images),
        })
      })
    })
  )
}

const createAward = async (allArtists, award, categoryId, eventId, eventDate) => {
  try {
    const artistDetails = allArtists.filter(artist => `${artist.firstname} ${artist.surname}` === award.name)
    await graphqlEndPoints.awards.createAward({
      categoryId,
      place: Number.parseInt(award.placement.match(/\d+/g)),
      artistId: artistDetails.length ? artistDetails[0].artistId : 0,
      eventId: Number.parseInt(eventId),
      date: eventDate,
      images: JSON.stringify(award.images),
    })
    return true
  } catch (err) {
    c(err)
    return false
  }
}

const updateCreateSingleEventAndAwards = async event => {
  const { allCategories, allArtists } = await getCategoriesAndArtists() //Grab Details N stuff
  const { categories } = await categoryScraper.getEventCategoryLinks({
    scrapeUrl: event.url,
    year: event.year,
    country: event.country,
  })
  const eventAwards = await awardsScraper.getAllAwardsFromAnIndividualGoldenDemonEvent(categories)

  return await checkEventDetailsAndUpdate(event.eventId, event.date, categories, allCategories, allArtists, eventAwards)
}

const updateCreateMultipleEvents = async (countries, categories, artists) => {
  return await key(countries).map(
    country => {
      countries[country].map(event => {
        key(event).map(year => {
          const currentEvent = event[year]
          currentEvent.awards.map(awards => {
            return awards.results.map(
              async award =>
                await createAward(
                  artists,
                  award,
                  awards.categoryId,
                  currentEvent.event.eventId,
                  currentEvent.event.date
                )
            )
          })
        })
      })
    }
    // Object.keys(countries[country]).map(async year => {
    //   const {
    //     allEvents: [event],
    //   } = await getEventByCountry(year, country)
    //
    //   const transformAwards = countries[country][year].map(item => ({
    //     [item.category]: item.results,
    //   }))
    //   countries[country][year].map(async awards => {
    //     const addSingleEvent = await checkEventDetailsAndUpdate(
    //       event.eventId,
    //       event.date,
    //       countries[country][year].map(item => ({ [item.category]: awards.results })),
    //       allCategories,
    //       allArtists,
    //       transformAwards
    //     )
    //     c(addSingleEvent)
    //   })
    // })
  )
}

export default {
  getAllFrenchGoldenDemonEvents,
  updateCreateSingleEventAndAwards,
  updateCreateMultipleEvents,
  createAward,
  getCategoriesAndArtists,
}
