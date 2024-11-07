const express = require('express')
const app = express()
require('dotenv').config()
const axios = require('axios')
const path = require('path')
const bodyParser = require('body-parser')
const { log } = require('console')
const PORT = 8080

const API_KEY = process.env.API_KEY;

app.use(bodyParser.urlencoded({extended:true}))

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'))

app.get('/',(request,response) => {
    response.render('index',{weatherData:null})
})

app.post('/weather',(request,response) => {
    const address = request.body.place
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}`
    console.log(url)

    axios.get(url).then(res => {
        
        const data = res.data
        console.log(data)
        const temparature = kelvinToCelsius(data.main.temp)
        const temparature_Max = kelvinToCelsius(data.main.temp_max)
        const temparature_Min = kelvinToCelsius(data.main.temp_min)
        const windSpeed = convertToKmh(data.wind.speed)
        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString()
        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
        const weatherState = data.weather

        const weatherData = {data,temparature, temparature_Max,temparature_Min,windSpeed,sunsetTime,sunriseTime,weatherState}
        response.status(200).render('index',{weatherData})
        console.log(weatherState)
        return
    })
    .catch(error => {
        console.error(error)
        response.status(404).send(`<h1>It looks like there may be a small error in your prompt. Could you please check it and try again ?</h1><h3>If you want to go back, remove 'weather' from the URL</h3>`)
    })
    
})



function kelvinToCelsius(kelvin) {
    return Math.floor(kelvin - 273.15)
}

function convertToKmh(speedInMs) {
    return Math.floor(speedInMs * 3.6)
}

app.listen(PORT,() => {
    console.log(`Application is running on ${PORT}`);
})