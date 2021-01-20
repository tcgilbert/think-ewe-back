// imports
const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')

// configure passport
require('./config/ppconfig')(passport)

// express middleware
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(passport.initialize())

// app home route
app.get('/', (req, res) => {
    res.status(200).json({msg: 'You have hit the backend home route'})
})

// endpoints
app.use('/users', require('./controllers/user'))


// create port
const PORT = process.env.PORT || 8000

// create server
const server = app.listen(PORT, () => {
    console.log(`🔥 Listening on PORT: ${PORT} 🔥`);
})

module.exports = server