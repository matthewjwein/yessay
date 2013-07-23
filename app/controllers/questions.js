
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Question = mongoose.model('Question')
  , _ = require('underscore')
  , Essay = mongoose.model('Essay')

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

exports.start = function(req, res){
  Essay.list({ criteria: { 'user': req.user} }, function(err, essays) {
    if (err) return res.render('500')

    var array = []
    for (var i = 0; i < essays.length; i++) {
      array.push(essays[i].title)
    }

    Question
      .findOne({ title : { $nin : array } })
      .exec(function (err, question) {
        if (err) return res.render('500')
        if (!question) return res.redirect('users/'+req.user.id)

        res.redirect('brainstorm/question/'+question.id)
      })
  })
}

exports.next = function(req, res){
  var essay = new Essay();

  essay.title = req.body.title
  essay.brainstorm = {
    q1: {
      question: req.body.q1,
      answer: req.body.a1
    },
    q2: {
      question: req.body.q2,
      answer: req.body.a2
    },
    q3: {
      question: req.body.q3,
      answer: req.body.a3
    }
  }

  essay.user = req.user

  essay.save(function (err) {
    if (err) {
      res.render('/', {
        errors: err.errors
      })
    }
    else {
      Essay.list({ criteria: { 'user': essay.user} }, function(err, essays) {
        if (err) return res.render('500')

        var array = []
        for (var i = 0; i < essays.length; i++) {
          array.push(essays[i].title)
        }

        Question
          .findOne({ title : { $nin : array } })
          .exec(function (err, question) {
            if (err) return res.render('500')
            if (!question) return res.redirect('users/'+req.user.id)

            res.redirect('brainstorm/question/'+question.id)
          })
      })
    }
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
