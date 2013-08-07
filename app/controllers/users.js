
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
        fromname: 'Jacqueline Abrams',
        subject: 'Thanks for signing up with Yessay!',
        text:'Dear ' + user.name.split(' ')[0] + ',' +
          '\n\nWelcome to Yessay!  Thanks for signing up to write your college application essay with us., ' +
          '\n\nHere’s what you can expect from this point on:' +
          '\n\nWe take you through a five-step process, where you’ll be shown videos, writing samples and prompts to do your own writing.' +
          '\n\nDo it all in one sitting, or take your time and move at your own pace!' +
          '\n\nStep 1: Brainstorm: Choose your best topic. (approx. 20 min.)' +
          '\n\nStep 2: Description: Bring your memories to life. (approx. 25 min.)' +
          '\n\nStep 3: Context: Tell your reader what they need to know. (approx. 20 min.)' +
          '\n\nStep 4: Reflection: Make observations about your experiences. (approx. 30 min.)' +
          '\n\nStep 5: Organization: Put it all together and send your draft to anyone you want for free. (approx. 30-45 min.)' +
          '\n\nWe know what you’re thinking: “OMG, five steps! This is going to take forever!”  Wrong. If you follow the Yessay process, you will write your essay faster, better, and without stress.' +
          '\n\nAnd, if you want a professional review, you’ll have the option to purchase reviews of your essays once you finish the process.' +
          '\n\nHappy writing!' +
          '\n\nJacqueline Abrams + The Yessay Team' +
          '\n\nSign in to your account: www.yessay.com/login' +
          '\n\nUsername: ' + user.email
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
