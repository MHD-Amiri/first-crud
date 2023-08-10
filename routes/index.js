const fs = require('fs');
const express = require('express');
const app = express();
const router = express.Router();
const multer = require('multer');
const authenticate = require('../config/auth');

// User model
const User = require("../models/user");
const Article = require("../models/article");

// GET home page
router.get('/', async (req, res, next) => {
  try {
    // find all articles in database
    const articles = await Article.find({}).exec();
    console.log(articles);
    // render the page for the client with information the page needs
    res.render('pages/home', {
      title: 'MHD App',
      articles
    });
  } catch (err) {
    return res.status(400).send('Something went wrong');
  }
});

// GET Dashboard page
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    // if the cookie and session don't match, delete the cookie to force login again
    if (req.cookies.user_sid && !req.session.passport.user) {
      res.clearCookie('user_sid');
    }

    // find all articles of the user
    const articles = await Article.find({ author: req.session.passport.user }).exec();

    // render the page for the client with the information the page needs
    res.render('pages/dashboard', {
      title: 'Dashboard',
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      userName: req.user.userName,
      gender: req.user.gender,
      phoneNumber: req.user.phoneNumber,
      createdAt: req.user.createdAt,
      bio: req.user.bio,
      avatar: req.user.avatar,
      articles
    });
  } catch (err) {
    return res.status(400).send('Something went wrong');
  }
});


// Config storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const uploadAvatar = multer({
  storage: storage
});

// Handle avatar upload
router.post('/uploadAvatar', authenticate, (req, res) => {
  const upload = uploadAvatar.single('avatar');

  upload(req, res, (err) => {
    if (err) return res.status(400).send('err');
    User.findById(req.session.passport.user, (err, user) => {
      if (user.avatar) {
        console.log('exist avatar:', user.avatar);
        fs.unlinkSync(`public/images/${user.avatar}`);
      };
    });
    User.findByIdAndUpdate(req.session.passport.user, {
      avatar: req.file.filename
    }, {
      new: true
    }, (err, user) => {
      if (err) return res.status(400).send('User does not exist');
      req.session.passport.user.avatar = req.file.filename;
    });
    User.findById(req.session.passport.user, (err, user) => {
      if (err) return res.status(400).send('Something went wrong!');
      res.json(user);
      console.log(user.avatar);
    });
  })
})

module.exports = router;