// imports
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const passport = require('passport')
const JWT_SECRET = process.env.JWT_SECRET

// database
const db = require('../models')

// router 
const router = express.Router()


// get by ID
router.get('/:id', async (req, res) => {
    console.log(req.params);
    try {        
        const requestedUser = await db.user.findOne({
            where: {
                id: req.params.id
            }
        })
        if (requestedUser) {
            return res.status(200).json({requestedUser})
        } else {
            return res.status(404).json({msg: 'Could not find requested user'})
        }
    } catch (error) {
        console.log(`GET ERROR: ${error}`);
    }
})

// sign up route
router.post('/signup', async (req, res) => {
    console.log('hit the signup route');
    console.log(req.body);
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
                password: req.body.password,
                registered: false
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
        const { identifier, password } = req.body
        // check for user with that email
        let requestedUser = await db.user.findOne({
            where: {
                email: identifier
            }
        })
        if (!requestedUser) {
            requestedUser = await db.user.findOne({
                where: { username: identifier }
            })
        }
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
                    name: requestedUser.name,
                    registered: requestedUser.registered, 
                    username: requestedUser.username, 
                    bio: requestedUser.bio,
                    avater: requestedUser.avatar
                }
                // token signature
                jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                    res.json({
                        success: true,
                        token
                    })
                })
            } else {
                return res.status(400).json({msg: 'Password is incorrect'})
            }
        }
    } catch (error) {
        return res.status(400).json({msg: 'Email or password incorrect'})
    }
})

// update from dashboard
router.put('/dashboard-update', async (req, res) => {
    const { username, bio, id } = req.body
    console.log("hit the update route!!!!!!!!!1");
    console.log(req.body);
    try {  
        const updatedUser = await db.user.update({
            username: username,
            bio: bio,
            registered: true
        }, {
            where: {
                id: id
            }
        })
        return res.status(204).json(updatedUser)
    } catch (error) {
        return res.status(400).json({msg: 'Failed to update user', error: error})
    }
})


router.post('/check-token', async (req, res) => {
    console.log('hit token checkpoint');
    const { token } = req.body
    const payload = await jwt_decode(token)
    try {        
        const requestedUser =  await db.user.findOne({
            where: {
                email: payload.email
            }
        })
        if (requestedUser) {
            res.status(200).json({user_found: true})
        } else {
            res.status(401).json({msg: "No user associated with that token"})
        }
    } catch (error) {
        console.log(`TOKEN CHECKPOINT ERROR: ${error}`);
    }
})

module.exports = router