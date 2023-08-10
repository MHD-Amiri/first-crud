const express = require('express');
const router = express.Router();
const authenticate = require('../config/auth');

// User & Article models
const User = require("../models/user");
const Article = require('../models/article');

// GET Article page
router.get('/', authenticate, (req, res, next) => {
  // if the cookie and session doesn't match delete cookie to force for login again
  if (req.cookies.user_sid && !req.session.passport.user) {
    res.clearCookie("user_sid");
  };
  res.render('pages/article', {
    title: 'New Article',
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    userName: req.user.userName,
    gender: req.user.gender,
    phoneNumber: req.user.phoneNumber,
    bio: req.user.bio
  });
});

// Save article
router.post('/', authenticate, async (req, res, next) => {
  try {
    const {
      title,
      content
    } = req.body;

    let errors = [];

    //Check required fields
    if (!title || !content) {
      errors.push({
        msg: "Please fill in all fields!"
      });
    }

    // Error handler
    if (errors.length > 0) {
      console.log(errors);
      res.render('pages/article', {
        title: "New Article",
        errors,
        title,
        content
      });
    } else {
      // Find the user who is writing the article
      await User.findById(req.session.passport.user, (err, user) => {
        if (err) return res.status(400).send('User does not exist');
        // Save the article
        const newArticle = new Article({
          author: user._id,
          title,
          content
        });
        newArticle.save()
          .then(user => {
            req.flash('success_msg', 'Your have successfully saved the article');
            res.redirect('/dashboard');
          })
      });
    }
    // catch the errors
  } catch (error) {
    errors.push({
      msg: "Something went wrong, please try again!"
    });
    res.render('pages/article', {
      title: "New Article",
      errors,
      title,
      content
    });
  }
});

module.exports = router;