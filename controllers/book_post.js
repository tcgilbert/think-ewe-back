// imports
require('dotenv').config()
const express = require('express')
const passport = require('passport')

// database
const db = require('../models')

// router 
const router = express.Router()

// create a new book post
router.post('/create', (req, res) => {
    console.log(req.body);
    console.log("you have hit the new book post route");
    res.send("hey from the backend")
})


module.exports = router