const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passportModule = require('passport');

// User model
const User = require("../models/user");

// Login Page
router.get('/login', (req, res, next) => {
  res.render('pages/login', {
    title: "Login"
  });
});

// Register Page
router.get('/register', (req, res, next) => {
  res.render('pages/register', {
    title: "register"
  });
});

// Register Handler
router.post('/register', (req, res, next) => {
  //// ** Need to be async ** ////
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
    gender,
    phoneNumber
  } = req.body;

  let errors = [];

  //Check required fields
  if (!firstName || !lastName || !userName || !email || !password || !confirmPassword || !gender || !phoneNumber) {
    errors.push({
      msg: "Please fill in all required fields!"
    });
  }

  //Check passwords match
  if (password !== confirmPassword && confirmPassword) {
    errors.push({
      msg: "Passwords do not match!"
    });
  }

  //Check password length
  if (password.length < 8 && password) {
    errors.push({
      msg: "Password length is too short, it must be at least 8 characters"
    });
  }

  // Error handler
  if (errors.length > 0) {
    console.log(errors);
    res.render('pages/register', {
      title: "register",
      errors,
      firstName,
      lastName,
      userName,
      email,
      phoneNumber
    });
  } else {
    //Check user existance
    User.findOne({
      email: email
    }).then(user => {
      // If the user exists, then we show a error message
      if (user) {
        errors.push({
          msg: "User Exists! Please put another email"
        });
        res.render('pages/register', {
          title: "register",
          errors,
          firstName,
          lastName,
          userName,
          email,
          phoneNumber
        });
      } else {
        // The user does not exist, so we save the user
        const newBlogger = new User({
          firstName,
          lastName,
          userName,
          email,
          password,
          gender,
          phoneNumber
        });
        // Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newBlogger.password, salt, (err, hash) => {
          if (err) throw err;
          // Set the password to hashed password
          newBlogger.password = hash;
          //Save the user
          newBlogger.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered, and can log in');
              res.redirect('/users/login');
            })
            .catch(err => {
              errors.push({
                msg: "Something went wrong, please try again!"
              });
              res.render('pages/register', {
                title: "register",
                errors,
                firstName,
                lastName,
                userName,
                email,
                phoneNumber
              });
            });
        }))
      }
    });
  }
});

// Login Handler
router.post('/login', (req, res, next) => {
  passportModule.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout Handler
router.get('/logout', (req, res, next) => {
  req.logOut();
  req.flash('success_msg', 'You have successfully logged out');
  res.redirect('/users/login');
});

module.exports = router;