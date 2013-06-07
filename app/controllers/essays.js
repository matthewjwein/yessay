
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , async = require('async')
  , Essay = mongoose.model('Essay')
  , _ = require('underscore')

/**
 * Find essay by id
 */

exports.essay = function(req, res, next, id){
  var User = mongoose.model('User')

  Essay.load(id, function (err, essay) {
    if (err) return next(err)
    if (!essay) return next(new Error('Failed to load essay ' + id))
    req.essay = essay
    next()
  })
}

/**
 * New essay
 */

exports.new = function(req, res){
  res.render('essays/new', {
    title: 'New Essay',
    essay: new Essay({})
  })
}

/**
 * Create an essay
 */

exports.create = function (req, res) {
  var essay = new Essay(req.body)
  essay.user = req.user

  essay.uploadAndSave(req.files.image, function (err) {
    if (err) {
      res.render('essays/new', {
        title: 'New Essay',
        essay: essay,
        errors: err.errors
      })
    }
    else {
      res.redirect('/essays/'+essay._id)
    }
  })
}

/**
 * Edit an essay
 */

exports.edit = function (req, res) {
  res.render('essays/edit', {
    title: 'Edit '+req.essay.title,
    essay: req.essay
  })
}

/**
 * Update essay
 */

exports.update = function(req, res){
  var essay = req.essay
  essay = _.extend(essay, req.body)

  essay.uploadAndSave(req.files.image, function(err) {
    if (err) {
      res.render('essays/edit', {
        title: 'Edit Essay',
        essay: essay,
        errors: err.errors
      })
    }
    else {
      res.redirect('/essays/' + essay._id)
    }
  })
}

/**
 * View an essay
 */

exports.show = function(req, res){
  res.render('essays/show', {
    title: req.essay.title,
    essay: req.essay
  })
}

/**
 * Delete an essay
 */

exports.destroy = function(req, res){
  var essay = req.essay
  essay.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/essays')
  })
}

/**
 * List of Essays
 */

exports.index = function(req, res){
  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page
  }

  Essay.list(options, function(err, essays) {
    if (err) return res.render('500')
    Essay.count().exec(function (err, count) {
      res.render('essays/index', {
        title: 'List of Essays',
        essays: essays,
        page: page,
        pages: count / perPage
      })
    })
  })
}
