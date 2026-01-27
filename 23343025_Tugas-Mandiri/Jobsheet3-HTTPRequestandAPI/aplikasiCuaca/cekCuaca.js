const request = require('postman-request')
const urlCuaca = 'http://api.weatherstack.com/current?access_key=55eb3af056e988b9dc5c89a397a69218&query=-0.13886437777698835, 100.55195189870547&units=f'
request({ url: urlCuaca, json: true }, (error, response) => {
    console.log('Saat ini suhu di luar mencapai ' + response.body.current.temperature +
        '°f. Kemungkinan terjadinya hujan adalah ' + response.body.current.precip + '%')
})