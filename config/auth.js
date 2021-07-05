const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const User = mongoose.model('users')


module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {

        User.findOne({email: email}).lean().then((user) => {
            if (!user){
                return done(null, false, {message: "Wrong email and/or password"})
            } 

            bcrypt.compare(password, user.password, (error, match) => {

                if(match){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Wrong email and/or password"})
                }

            })

        })

    }))


    passport.serializeUser((user, done) => {

        done(null, user)

    })

    passport.deserializeUser((id, done) => {
        
        User.findById(id, (err, user) => {
            done(err, user)
        })
        
    })


}