const express = require('express');
const router = express.Router();
const passport = require('passport');
//models
const User = require('../models/users');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect:'/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const{name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <=0 ){
        errors.push({text: 'Please insert your name'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not Match'});
    }
    if(password.length < 4) {
        errors.push({text: 'Password must be at least 4 characters'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'The email is allready in use');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are registered');
            res.redirect('/users/signin');
        }
                
    }
});

router.get('/users/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out now.');
    res.redirect('/users/signin');
  });
  
module.exports = router;