import axios from 'axios'
import cheerio from 'cheerio'

export const getUnquie = (temp1, temp2, key = 'name') => {
  return temp1.filter(item1 => {
    return !temp2.some(item2 => item2[key] === item1[key])
  })
}

export const c = console.info // eslint-disable-line no-console

export const getHtml = async scrapeUrl => {
  const siteData = await axios(scrapeUrl)
  return cheerio.load(siteData.data)
}

export const reducePromiseAll = async loopableData => {
  return await Promise.all(
    loopableData.map(async events => {
      return await Object.keys(events.categories).reduce((acc, cur) => {
        return acc.then(async data => {
          const newData = await axios(events.categories[cur])
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
