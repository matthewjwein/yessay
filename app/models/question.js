
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Question Schema
 */

var QuestionSchema = new Schema({
  title: {type : String, default : '', trim : true},
  prompt: {type : String, default : '', trim : true},
  q1: {type : String, default : '', trim : true},
  q2: {type : String, default : '', trim : true},
  q3: {type : String, default : '', trim : true}
})

/**
 * Validations
 */

QuestionSchema.path('q1').validate(function (title) {
  return title.length > 0
}, 'Brainstorm must have a question')

QuestionSchema.path('q2').validate(function (title) {
  return title.length > 0
}, 'Brainstorm must have a question')

QuestionSchema.path('q3').validate(function (title) {
  return title.length > 0
}, 'Brainstorm must have a question')

QuestionSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Brainstorm must have a title')

QuestionSchema.path('prompt').validate(function (title) {
  return title.length > 0
}, 'Brainstorm must have a prompt')

/**
 * Methods
 */

QuestionSchema.methods = {

  /**
   * Find question by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  save: function (cb) {
    return this.save(cb)
  }
}

mongoose.model('Question', QuestionSchema)
