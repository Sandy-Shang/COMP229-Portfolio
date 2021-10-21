let express = require('express');
let route = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; //alias



module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'Home', displayName: req.user ? req.user.displayName : ''});
};

module.exports.displayAboutPage = (req, res, next) => {
    res.render('index', {title: 'About Me', displayName: req.user ? req.user.displayName : ''});
};

module.exports.displayProjectPage = (req, res, next) => {
    res.render('index', {title: 'Projects', displayName: req.user ? req.user.displayName : ''});
};

module.exports.displayServicesPage = (req, res, next) => {
    res.render('index', {title: 'Services', displayName: req.user ? req.user.displayName : ''});
};

module.exports.displayContactPage = (req, res, next) => {
    res.render('contact', {title: 'Contact Me', displayName: req.user ? req.user.displayName : ''});
};

module.exports.displayLoginPage = (req, res, next) => {
    if (!req.user)
    {
        res.render('auth/login',
        {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.userdisplayName: ''
        })
    }
    else
    {
        return res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
        if(err)
        {
            return next(err);
        }
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error' );
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err)
            {
                return next(err);
            }
            return res.redirect('/contact-list');
        });
    })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
    if(!req.user)
    {
        res.render('auth/register', 
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName: ''
        });
    }
    else
    {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) =>{
    //instantiate a user object
    let newUser = new User({
        username: req.body.username, 
        //password: req.body.password, 
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log("Error: Inserting New User");
            if(err.name == "UserExisitsError")
            {
                req.flash(
                    'registerMessage',
                    'Registeration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register', 
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        else
        {
            // if no error exists, then registration is successful

            //redirect the user and authenticate them
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/contact-list')
            });
        }
    });
}

module.exports.performLogout = (req, res, next) =>{
    req.logout();
    res.redirect('/');
}