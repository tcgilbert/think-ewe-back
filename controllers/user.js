// imports
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const passport = require("passport");
const JWT_SECRET = process.env.JWT_SECRET;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// database
const db = require("../models");

// router
const router = express.Router();

// token checkpoint
router.post("/check-token", async (req, res) => {
    console.log("hit token checkpoint");
    const { token } = req.body;
    const payload = await jwt_decode(token);
    console.log(payload);
    try {
        const requestedUser = await db.user.findOne({
            where: {
                email: payload.email,
            },
        });
        if (requestedUser) {
            res.status(200).json({ user_found: requestedUser });
        } else {
            res.status(401).json({ user_found: false });
        }
    } catch (error) {
        console.log(`TOKEN CHECKPOINT ERROR: ${error}`);
    }
});

// get by ID
router.get("current/:id", async (req, res) => {
    console.log(req.params);
    try {
        const requestedUser = await db.user.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (requestedUser) {
            return res.status(200).json({ requestedUser });
        } else {
            return res
                .status(404)
                .json({ msg: "Could not find requested user" });
        }
    } catch (error) {
        console.log(`GET ERROR: ${error}`);
    }
});

// get by username or name search
router.get("/find/:user", async (req, res) => {
    const user = req.params.user;
    console.log(user);
    let matchesPayload = []
    try {
        let matches = await db.user.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${user}%`,
                        },
                    },
                    {
                        username: {
                            [Op.like]: `%${user}%`,
                        },
                    },
                ],
            },
            limit: 6
        });
        matches.forEach((user) => {
            let userInfo = {
                name: user.name,
                avatar: user.avatar,
                username: user.username
            }
            matchesPayload.push(userInfo)
        })
        res.status(201).json({ matchesPayload });
    } catch (error) {
        console.log(`GET ERROR: ${error}`);
    }
});

// sign up route
router.post("/signup", async (req, res) => {
    console.log("hit the signup route");
    console.log(req.body);
    try {
        const requestedUser = await db.user.findOne({
            where: { email: req.body.email },
        });
        // check for email
        if (requestedUser) {
            return res.status(400).json({ msg: "Email already in use" });
        } else {
            // create new user
            const newUser = await db.user.build({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                registered: false,
            });
            // create salt for password
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw Error;
                bcrypt.hash(newUser.password, salt, async (error, hash) => {
                    try {
                        if (error) throw Error;
                        // else hash password
                        newUser.password = hash;
                        const createdUser = await newUser.save();
                        res.status(201).json(createdUser);
                    } catch (error) {
                        console.log(`HASHING ERROR: ${error}`);
                    }
                });
            });
        }
    } catch (err) {
        console.log(`SIGNUP ERROR: ${err}`);
    }
});

// login route
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        // check for user with that email
        let requestedUser = await db.user.findOne({
            where: {
                email: identifier,
            },
        });
        if (!requestedUser) {
            requestedUser = await db.user.findOne({
                where: { username: identifier },
            });
        }
        if (!requestedUser) {
            res.status(400).json({ msg: "User not found" });
        } else {
            // login user
            const isMatch = await bcrypt.compare(
                password,
                requestedUser.password
            );
            if (isMatch) {
                // token payload
                const payload = {
                    id: requestedUser.id,
                    email: requestedUser.email,
                };
                // token signature
                jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: "1h" },
                    (error, token) => {
                        res.json({
                            success: true,
                            token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ msg: "Password is incorrect" });
            }
        }
    } catch (error) {
        return res.status(400).json({ msg: "Email or password incorrect" });
    }
});

// update from dashboard
router.put("/dashboard-update", async (req, res) => {
    const { username, bio, id, avatar } = req.body;
    console.log("hit the update route!!!!!!!!!1");
    console.log(req.body);
    try {
        const updatedUser = await db.user.update(
            {
                username: username,
                bio: bio,
                avatar: avatar,
                registered: true,
            },
            {
                where: {
                    id: id,
                },
            }
        );
        return res.status(204).json(updatedUser);
    } catch (error) {
        return res
            .status(400)
            .json({ msg: "Failed to update user", error: error });
    }
});

module.exports = router;
