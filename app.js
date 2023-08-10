const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passportModule = require('passport');
const app = express();

// Passport Config
require('./config/passport')(passportModule);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// handle mongoose collection.ensureIndex warn
/*mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);*/

mongoose.connect('mongodb://localhost:27017/test-project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("mongoDB connected..."));

require('./tools/initialization')();

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(cookieParser());

// Passport Midlleware
app.use(passportModule.initialize());
app.use(passportModule.session());

// Connect flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const editRouter = require('./routes/edit');
const articleRouter = require('./routes/article');
const passport = require('./config/passport');
app.use('/dashboard/edit', editRouter);
app.use('/dashboard/article', articleRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;