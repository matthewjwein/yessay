
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Question = mongoose.model('Question')

/**
 * Find question by id
 */

exports.question = function (req, res, next, id) {
  Question
    .findOne({ _id : id })
    .exec(function (err, question) {
      if (err) return next(err)
      if (!question) return next(new Error('Failed to load Question ' + id))
      req.question = question
      next()
    })
}

/**
 * Fetch question
 */

exports.fetch = function(req, res){
  //TODO: get from database
  Question
    .findOne()
    .exec(function (err, question) {
      if (err) return err
      if (!question) return new Error('Failed to load Question ' + question.id)

      res.redirect('brainstorm/question/'+question.id)
    })
}

/**
 * Display Question
 */

exports.display = function(req,res){
  var question = req.question
  res.render('brainstorm/question', {
    title: "Brainstorm",
    question: question
  })
}
