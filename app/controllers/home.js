
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  res.render('landing/home/index', {
    title: 'Welcome to Yessay'
  })
}

exports.about = function (req, res) {
  res.render('landing/about/index', {
    title: 'Welcome to Yessay'
  })
}

exports.sample_essays = function (req, res) {
  res.render('landing/sample-essays/index', {
    title: 'Welcome to Yessay'
  })
}

exports.quick_tips = function (req, res) {
  res.render('landing/quick-tips/index', {
    title: 'Welcome to Yessay'
  })
}

exports.pricing = function (req, res) {
  res.render('landing/pricing/index', {
    title: 'Welcome to Yessay'
  })
}

