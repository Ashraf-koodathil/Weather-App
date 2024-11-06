const express = require('express')
const app = express()
require('dotenv').config()
const axios = require('axios')
const PORT = 8080

const API_KEY = process.env.API_KEY;



app.get('/',(request,response) => {
    const address = request.query.address
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`

    axios.get(url).then(res => {
        const data = res.data
        const cityName = data.name
        const temparature = data.main.temp
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString()
        const message = `City Name: ${cityName}<br>Temparature:${temparature}<br>Sunset Time${sunsetTime}`
        response.send(`<html><body><div><h1>${message}</h1></div></body></html>`)
        return
    })
    .catch(error => {
        console.error(error)
        response.status(503).send('Error occured')
    })
    
})

app.listen(PORT,() => {
    console.log(`Application is running on ${PORT}`);
})