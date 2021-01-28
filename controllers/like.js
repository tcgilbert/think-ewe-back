// imports
require("dotenv").config();
const express = require("express");
const passport = require("passport");

// database
const db = require("../models");

// router
const router = express.Router();

// create a like
router.post('/create', async (req, res) => {
    console.log("you hit the like route!");
    const {post_id, user_id} = req.body
    try {
        await db.like.create({post_id, user_id})
        res.status(201).json({msg: "Like created", created: true})
    } catch (error) {
        console.log(`LIKE CREATION ERROR: ${error}`);
    }
})

// get all likes for post
router.get('/book-post/:post_id', async (req, res) => {
    const { post_id } = req.params
    try {
        let likes = await db.like.findAll({where: {post_id: post_id}})
        res.status(200).json({likes})
    } catch (error) {
        console.log(`LIKE FETCH ERROR: ${error}`);
    }
})

// delete a like
router.delete('/delete', async (req, res) => {
    const {post_id, user_id} = req.body
    console.log(req.body);
    try {
        await db.like.destroy({
            where: {
                post_id: post_id,
                user_id: user_id
            }
        })
        res.status(200).json({msg: "Like removed", removed: true})
    } catch (error) {
        console.log(`LIKE DELETION ERROR: ${error}`);
    }
})



module.exports = router