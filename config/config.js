
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    db: 'mongodb://heroku_app16153775:a68v4bdu78217jaq2no6si9m32@ds029658.mongolab.com:29658/heroku_app16153775',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Yessay'
    },
    facebook: {
      clientID: "156025561245172",
      clientSecret: "bf2c40079c3dd26d1867e39d0f2e6c61",
      callbackURL: "http://yessay.herokuapp.com/auth/facebook/callback"
    },
    twitter: {
      clientID: "0FY8lCz1NerOIu3sioPe2w",
      clientSecret: "b4kjkEpcA2Uf1sLRsQiI72n071DJGgNW92yjhy1lxjY",
      callbackURL: "http://yessay.herokuapp.com/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {
    db: 'mongodb://localhost/noobjs_test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Yessay'
    },
    facebook: {
      clientID: "156025561245172",
      clientSecret: "bf2c40079c3dd26d1867e39d0f2e6c61",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  production: {}
}
