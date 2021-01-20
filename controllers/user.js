// imports
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JWT_SECRET = process.env.JWT_SECRET

// database
const db = require('../models')

// router 
const router = express.Router()

// test route
router.get('/test', (req, res) => {
    res.json({msg: 'you have hit the users route'})
})

module.exports = router