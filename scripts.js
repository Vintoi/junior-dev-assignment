console.log('hello world')

const getItems = (category) => {
  fetch(`https://bad-api-assignment.reaktor.com/v2/products/${category}`)
  .then(res => res.json())
  .then(data => {
    console.log(data)
  })
}