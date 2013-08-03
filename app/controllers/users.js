
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Essay = mongoose.model('Essay')
  , SendGrid = require('sendgrid').SendGrid
  , sendgrid = new SendGrid(
      process.env.SENDGRID_USERNAME,
      process.env.SENDGRID_PASSWORD
    )

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/users/'+req.user.id)
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  if (req.user){
    return res.redirect('users/'+req.user.id)
  }
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  if (req.user){
    return res.redirect('users/'+req.user.id)
  }
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/users/'+req.user.id)
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user })
    }
    req.logIn(user, function(err) {
      if (err) return err

      sendgrid.send({
        to: user.email,
        from: 'jacqueline@yessay.com',
        subject: 'Thanks for signing up with Yessay!',
        text:'Thanks for signing up with Yessay!You’ve got a big year ahead of you with college applications, ' +
          'and we want to make the journey a little smoother. So, we’re sharing ' +
          'our best-kept secrets on writing a truly kickass admissions essay. ' +
          'These insights come from years of teaching writing at NYU and Emory University, ' +
          'and they’re designed to help you tell your own story in the most compelling way possible. ' +
          '\n\nWe’d love to hear from you, so feel free to email me directly with questions,' +
          'concerns, or suggestions\n(jabrams@yessay.com).' +
          '\n\nBest,' +
          '\n\nJacqueline Abrams' +
          '\n\nSign in to your account: www.yessay.com/login' +
          'Username: ' + user.email
      }, function(success, message) {
        if (!success) {
          console.log(message)
          return success
        }
      });

      return res.redirect('/users/'+user.id)
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.user

  if (!user) {
    return res.redirect('/')
  }

  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 50
  var options = {
    perPage: perPage,
    page: page,
    criteria: { 'user': user}
  }

  Essay.list(options, function(err, essays) {
    if (err) return res.render('500')
    Essay.find({ 'user': user }).count().exec(function (err, count) {
      res.render('users/show', {
        title: 'Profile',
        user: user,
        count: count,
        essays: essays,
        page: page,
        pages: count / perPage
      })
    })
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
