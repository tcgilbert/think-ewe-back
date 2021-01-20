// Setup Passport Jwt
require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// require db models
const db = require('../models')

// Establish Options
const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
options.secretOrKey = process.env.JWT_SECRET

// Export Jwt Strategy
module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        db.user.findOne({ where: {id: jwt_payload.id}})
        .then((user) => {
            if (user) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
        .catch((error) => {
            console.log(`PASSPORT ERROR: ${error}`);
        })
    }))
}