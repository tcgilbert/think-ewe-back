// imports
const express = require('express')
const app = express()

// app home route
app.get('/', (req, res) => {
    res.status(200).json({msg: 'You have hit the backend home route'})
})

// create port
const PORT = process.env.PORT || 8000

// create server
const server = app.listen(PORT, () => {
    console.log(`🔥 Listening on PORT: ${PORT} 🔥`);
})

module.exports = server