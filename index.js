const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fetch = require('node-fetch');

app.use(express.static('site'));

app.get('/product/:category', (req, res) => {
  let category=req.params.category
  fetch(`https://bad-api-assignment.reaktor.com/v2/products/${category}`)
    .then(res => res.json())
    .then(text => res.send(text))
})

app.get('/availability/:manufacturer', (req, res) => {
  let manufacturer=req.params.manufacturer
  fetch(`https://bad-api-assignment.reaktor.com/v2/availability/${manufacturer}`)
    .then(res => res.json())
    .then(text => res.send(text))
})


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})