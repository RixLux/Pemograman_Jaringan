// const request = require('postman-request')
// const url = 'http://api.weatherstack.com/current?access_key=55eb3af056e988b9dc5c89a397a69218&query=-0.1388965641899718, 100.55187679685'
// request({ url: url }, (error, response) => {
//     // console.log(response)
//     const data = JSON.parse(response.body)
//     console.log(data)
//     // console.log(data.current)
//     console.log(data.current.temperature)
// })

const request = require('postman-request')
const url = 'http://api.weatherstack.com/current?access_key=55eb3af056e988b9dc5c89a397a69218&query=-0.1388965641899718, 100.55187679685'
request(
    {url},
    (err, res) => {
        if (err)
            return console.log('Gagal mendapatkan data cuaca.');

        const { request, location } = JSON.parse(res.body);
        const query = request.query;
        const place_name = `${location.name}, ${location.region}, ${location.country}`;
        const place_type = request.type;
        
        console.log(`data yang anda cari adalah: ${query}`)
        console.log(`data yang ditemukan adalah: ${place_name}`)
        console.log(`tipe lokasi adalah: ${place_type}`)
    }
);