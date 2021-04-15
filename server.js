const express = require('express')

const app = express()
app.use(express.static('public'))

const PORT = 3000
app.listen(PORT, () => {
  console.log(`PixelMelter (2d canvas PoC) running at http://localhost:${PORT}`)
})