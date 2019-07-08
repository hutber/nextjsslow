import axios from 'axios/index'

export const writeEvent = async (event, eventCountry) => {
  const queryMutation = `mutation CreateEvent($name:String, $year:Int, $country:String, $location:String, $date:Date, $url: String){
    createEvent (input: {
      event: {
        name: $name
        year: $year
        country: $country
        location: $location
        date: $date
        url: $url
      }
    }) {
      event {
        name
        year
        country
        location
        date
        url
      }
    }
  }`
  const [, evenName = 'Unknown'] = event.name.split(/\d+/g)
  try {
    const mutation = await axios({
      url: 'http://localhost:4000/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: JSON.stringify({
        query: queryMutation,
        variables: {
          name: event.name,
          year: Number.parseInt(event.year),
          country: eventCountry,
          location: evenName.trim(),
          date: `${event.year}-01-01`,
          url: event.url,
        },
      }),
    })
    return mutation.data.data.createEvent.event
  } catch (err) {
    console.error(err.response.data.errors[0])
    console.error(err.response.data.errors)
    return err
  }
}
