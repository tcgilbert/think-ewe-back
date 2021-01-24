// imports
require('dotenv').config()
const express = require('express')
const passport = require('passport')

// database
const db = require('../models')

// router 
const router = express.Router()

// get all book posts
router.get('/:id', async (req, res) => {
    try {
        let posts =  await db.book_post.findAll({
            where: {
                user_id: req.params.id
            }
        })
        res.status(200).json({posts})
    } catch (error) {
        console.log(`ERROR GETTING BOOK POSTS: ${error}`);
    }
})


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