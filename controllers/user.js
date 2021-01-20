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

// sign up route
router.post('/signup', async (req, res) => {
    console.log('hit the signup route');
    try {
        const requestedUser = await db.user.findOne({
            where: { email: req.body.email }
        })
        // check for email
        if (requestedUser) {
            return res.status(400).json({ msg: 'Email already in use' })
        } else {
            // create new user
            const newUser = await db.user.build({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            // create salt for password
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw Error
                bcrypt.hash(newUser.password, salt, async (error, hash) => {
                    try {
                        if (error) throw Error
                        // else hash password
                        newUser.password = hash
                        const createdUser = await newUser.save()
                        res.status(201).json(createdUser)
                    } catch (error) {
                        console.log(`HASHING ERROR: ${error}`);
                    }
                })
            })
        } 
    } catch(err) {
        console.log(`SIGNUP ERROR: ${err}`);
    }
})

module.exports = router