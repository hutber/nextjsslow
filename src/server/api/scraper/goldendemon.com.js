import { getHtml, c } from '../../utils'

export default async () => {
  const url = 'https://golden-demon.com/'
  const $ = await getHtml(url)

  const unknown = 'Unknown'
  const items = []
  $('#masonry article').each(function() {
    const [prize = unknown, category = unknown, compeitionYear = unknown] = $(this)
      .find('.entry-title a')
      .text()
      .split('–')
      .map(item => item.trim())
    const [year = unknown] = compeitionYear.match(/\d+/g).map(Number)
    const [compeition = unknown] = compeitionYear.split(/\d+/g).map(item => item.trim())
    const [name = unknown, artist = unknown] = $(this)
      .find('.panel p')
      .text()
      .split(' by ')
    const [image = unknown] = $(this)
      .find('.post-image img')
      .attr('src')
      .split('?')

    const entryData = {
      prize,
      category,
      compeition,
      year,
      name,
      artist,
      url: $(this)
        .find('.post-image')
        .attr('href'),
      image,
      images: [],
    }
    items.push(entryData)
  })
  c(items)

  return items
}
