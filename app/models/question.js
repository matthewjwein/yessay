
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
  q1: {type : String, default : '', trim : true},
  q2: {type : String, default : '', trim : true},
  q3: {type : String, default : '', trim : true}
})

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

  create: function (cb) {
    return this.save(cb)
  }
}

mongoose.model('Question', QuestionSchema)
