// imports
require('dotenv').config()
const express = require('express')
const passport = require('passport')

// database
const db = require('../models')

// router 
const router = express.Router()

// create a new book post
router.post('/create', async (req, res) => {
    console.log(req.body);
    console.log("you have hit the new book post route");
    try {
        const createdPost = await db.book_post.create(req.body)
        res.status(201).json({createdPost})
    } catch (error) {
        console.log(`BOOK POST CREATE ERROR: ${error}`);
        res.status(500).json({msg: "Failed to create post with provided information"})
    }
})


module.exports = router