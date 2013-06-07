
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var essay = req.essay
  var user = req.user

  if (!req.body.body) return res.redirect('/essays/'+ essay.id)

  essay.addComment(user, req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/essays/'+ essay.id)
  })
}
