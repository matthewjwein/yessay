
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Essay Schema
 */

var EssaySchema = new Schema({
  title: {type : String, default : '', trim : true},
  brainstorm: [{
    question: { type : String, default : '', trim: true},
    answer: { type : String, default : '', trim: true},
    time: { type : Date, default : Date.now }
  }],
  description: {type : String, default : '', trim: true},
  context: {type : String, default : '', trim: true},
  reflection: {type : String, default : '', trim: true},
  organization: {type : String, default : '', trim: true},
  ideaPrompt: {type : String, default : '', trim: true},
  review: {type : String, default : '', trim: true},
  body: {type : String, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  joined_community: {type : Boolean, default : false},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

EssaySchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Essay title cannot be blank')

/**
 * Pre-remove hook
 */

EssaySchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'essay')

  next()
})

/**
 * Methods
 */

EssaySchema.methods = {

  /**
   * Save essay and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb)
    }, 'essay')
  },

  create: function (cb) {
    return this.save(cb)
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      essay: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  },

  answerQuestions: function (questions, cb) {
    for (var question in questions) {
      this.brainstorm.push({
        question: question,
        answer: questions[question]
      });
    }

    this.save(cb);
  }

}

/**
 * Statics
 */

EssaySchema.statics = {

  /**
   * Find essay by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List essays
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}


    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Essay', EssaySchema)
