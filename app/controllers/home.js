
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
    res.render('home/index', {
        title: 'Welcome to Yessay'
    })
}