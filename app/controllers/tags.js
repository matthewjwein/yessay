
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Essay = mongoose.model('Essay')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Essay.list(options, function(err, essays) {
    if (err) return res.render('500')
    Essay.count(criteria).exec(function (err, count) {
      res.render('essays/index', {
        title: 'List of Essays',
        essays: essays,
        page: page,
        pages: count / perPage
      })
    })
  })
}
