
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

exports.intro = function(req, res){
  res.render('brainstorm/intro', {
    title: 'Welcome.',
    essay: req.essay
  });
}

/**
 * Fetch question
 */

exports.start = function(req, res){
  Question
    .findOne()
    .exec(function (err, question) {
      if (err) return res.render('500')
      if (!question) return res.redirect('users/'+req.user.id)

      return res.redirect('brainstorm/question/'+question.id)
    })
}

exports.answer = function(req, res){
  var essay = new Essay()
  _.extend(essay, req.body)

  essay.user = req.user

  essay.save(function (err) {
    if (err) {
      return res.redirect('brainstorm/question/'+req.id);
    }

    var id = req.body.id;

    if (!id) return exports.start(req,res)

    Question
      .findOne({ _id : {$gt: id} })
      .exec(function (err, question) {
        if (err) return res.redirect('brainstorm/question/'+id)
        if (!question) return res.redirect('brainstorm/question/'+id)
        res.redirect('brainstorm/question/'+question.id)
      })
  })
}

exports.next = function(req, res){
  var id = req.body.id;

  Question
    .findOne({ _id : {$gt: id} }).sort({_id: 1 })
    .exec(function (err, question) {
      if (err) return res.redirect('brainstorm/question/'+id)

      if (!question) {
        Question
          .findOne().sort({_id: 1})
          .exec(function (err, question) {
            if (err) return res.redirect('brainstorm/question/'+id)

            if (!question) return res.redirect('brainstorm/question/'+id)

            res.redirect('brainstorm/question/'+question.id)
          })
      } else {
        res.redirect('brainstorm/question/'+question.id)
      }
    })
}

exports.prev = function(req, res){
  var id = req.body.id;

  Question
    .findOne({ _id : {$lt: id} }).sort({_id: -1 })
    .exec(function (err, question) {
      if (err) return res.redirect('brainstorm/question/'+id)

      if (!question) {
        Question
          .findOne().sort({_id: -1})
          .exec(function (err, question) {
            if (err) return res.redirect('brainstorm/question/'+id)

            if (!question) return res.redirect('brainstorm/question/'+id)

            return res.redirect('brainstorm/question/'+question.id)
          })
      } else {
        res.redirect('brainstorm/question/'+question.id)
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

exports.write_your_own = function(req, res){
  res.render('brainstorm/write-your-own', {
    title: "Write Your Own"
  })
}