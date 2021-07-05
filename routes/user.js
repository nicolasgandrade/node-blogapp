const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/User')
const User = mongoose.model('users')
const bcrypt  = require('bcryptjs')
const passport = require('passport')



router.get('/register', (req, res) => {
    res.render('users/register')
})










router.post('/register', (req, res) => {
    var errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
        errors.push({text: 'Invalid name'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        errors.push({text: 'Invalid email'})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        errors.push({text: 'Invalid password'})
    }

    if(req.body.password.length < 4){
        errors.push({text: 'Your password should have at least 4 charachters'})
    }

    if(req.body.password != req.body.password2){
        errors.push({text: 'Your passwords should match!'})
    }


    if(errors.length > 0){

        res.render('users/register', {errors: errors})

    }else{
        
        User.findOne({email: req.body.email}).lean().then((user) => {
            if(user){
                req.flash('error_msg', 'This email is already registered')
                res.redirect('/users/register')
            }else{

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error){
                            req.flash('error_msg', 'There was an error while saving the new user')
                            res.redirect('/')
                        }else{
                            newUser.password = hash

                            newUser.save().then(() => {
                                req.flash('success_msg', 'User created with success!')
                                res.redirect('/')
                            }).catch((err) =>{
                                req.flash('error_msg', 'There was an error while creating the user. Try again later or contact the support')
                                res.redirect('/users/register')
                            })
                        }
                    })
                })

            }
        }).catch((err) => {
            req.flash('error_msg', 'There was an internal error')
            res.redirect('/')
        })

    }

})


router.get('/login', (req, res) => {
    res.render('users/login')
})


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) =>{
    req.logout()
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/')
})


module.exports = router