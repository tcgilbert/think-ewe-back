// imports
require("dotenv").config();
const express = require("express");
const passport = require("passport");

// database
const db = require("../models");

// router
const router = express.Router();

// create new following 
router.post('/follow/create', async (req, res) => {
    console.log(req.body);
    const { follower_id, following_id } = req.body
    try {
        let dbRes = await db.following.create({
            follower_id: follower_id,
            following_id: following_id
        })
        res.status(201).json({dbRes})
    } catch (error) {
       console.log(`CREATE FOLLOW ERROR: ${error}`); 
    }
})

// delete following
router.post('/follow/delete', async (req, res) => {
    console.log(req.body);
    const { follower_id, following_id } = req.body
    try {
        let dbRes = await db.following.destroy({ where: {
            follower_id: follower_id,
            following_id: following_id
        }})
        res.status(200).json({dbRes})
    } catch (error) {
       console.log(`DELETE FOLLOW ERROR: ${error}`); 
    }
})

// get all followers
router.get('/followers/:user_id', async (req, res) => {
    try {
        let followers = await db.following.findAll({ where: {
            following_id: req.params.user_id
        }})
        res.status(200).json({followers})
    } catch (error) {
        console.log(`GET FOLLOWERS ERROR: ${error}`); 
    }
})

// get all followings
router.get('/following/:user_id', async (req, res) => {
    try {
        let following = await db.following.findAll({ where: {
            follower_id: req.params.user_id
        }})
        res.status(200).json({following})
    } catch (error) {
        console.log(`GET FOLLOWERS ERROR: ${error}`); 
    }
})

module.exports = router