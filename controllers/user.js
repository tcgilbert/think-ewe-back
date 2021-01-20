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

// login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // check for user with that email
        const requestedUser = await db.user.findOne({
            where: {
                email: email
            }
        })
        if (!requestedUser) {
            res.status(400).json({ msg: 'User not found'})
        } else {
            // login user
            const isMatch = await bcrypt.compare(password, requestedUser.password)
            if (isMatch) {
                // token payload
                const payload = {
                    id: requestedUser.id,
                    email: requestedUser.email,
                    name: requestedUser.name
                }
                // token signature
                jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                    res.json({
                        success: true,
                        token: `Bearer token: ${token}`
                    })
                })
            } else {
                return res.status(400).json({msg: 'Password is incorrect'})
            }
        }
    } catch (error) {
        console.log(`LOGIN ERROR: ${error}`);
    }
})

module.exports = router