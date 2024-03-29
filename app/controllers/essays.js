
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

exports.brainstorm = {
  intro: function(req, res){
    res.render('essays/brainstorm/intro', {
      title: 'Welcome.',
      essay: req.essay
    });
  },
  samples: function(req, res){
    res.render('essays/brainstorm/samples', {
      title: 'Brainstorming Stage',
      essay: req.essay
    });
  },
  start: function(req, res){
    res.render('essays/brainstorm/start', {
      title: 'Brainstorming Stage',
      essay: req.essay
    });
  },
  save: function(req, res){
    var essay = req.essay
    _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/description/intro')
      }
    })
  }
}


exports.description = {
  intro: function(req, res){
    res.render('essays/description/intro', {
      title: req.essay.title,
      essay: req.essay
    })
  },
  samples: function(req, res){
    res.render('essays/description/samples', {
      title: req.essay.title,
      essay: req.essay
    })
  },
  start: function(req, res){
    res.render('essays/description/start', {
      title: req.essay.title,
      essay: req.essay
    })
  },
  save: function(req, res){
    var essay = req.essay

    if (!req.body.description) {
      return res.redirect('/essays/'+essay._id+'/description/start')
    }

    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/context/intro')
      }
    })
  }
}

exports.context = {
  intro: function(req, res){
    res.render('essays/context/intro', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  samples: function(req, res){
    res.render('essays/context/samples', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  start: function(req, res){
    res.render('essays/context/start', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  save: function(req, res){
    var essay = req.essay

    if (!req.body.context) {
      return res.redirect('/essays/'+essay._id+'/context/start')
    }

    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/reflection/intro')
      }
    })
  }
}

exports.reflection = {
  intro: function(req, res){
    res.render('essays/reflection/intro', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  samples: function(req, res){
    res.render('essays/reflection/samples', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  start: function(req, res){
    res.render('essays/reflection/start', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  save: function(req, res){
    var essay = req.essay

    if (!req.body.reflection) {
      return res.redirect('/essays/'+essay._id+'/reflection/start')
    }

    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/organization/intro')
      }
    })
  }
}

exports.connect = {
  intro: function(req, res){
    res.render('connect/intro', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  join: function(req, res){
    var essay = req.essay
    essay = _.extend(essay, {joined_community: true})
    essay.save(function (err) {
      if (err) {
        res.render('connect/start', {
          title: 'Student Writing',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/connect/review')
      }
    })
  },
  review: function(req, res){
    res.render('connect/review', {
      title: 'Student Writing',
      essay: req.essay
    });
  },
  reviewtwo: function(req, res){
    res.render('connect/review-two', {
      title: 'Student Writing',
      essay: req.essay
    });
  },
  save: function(req, res){
    var essay = req.essay
    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/organization/intro')
      }
    })
  }
}

exports.organization = {
  intro: function(req, res){
    res.render('essays/organization/intro', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  samples: function(req, res){
    res.render('essays/organization/samples', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  samples_annotated: function(req, res){
    res.render('essays/organization/samples-annotated', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  idea_prompt: function(req, res){
    res.render('essays/organization/idea-prompt', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  start: function(req, res){
    res.render('essays/organization/start', {
      title: req.essay.title,
      essay: req.essay
    });
  },
  save_idea_prompt: function(req, res){
    var essay = req.essay
    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/organization/start')
      }
    })
  },
  save_review: function(req, res){
    var essay = req.essay
    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/essay/show')
      }
    })
  },
  save: function(req, res){
    var essay = req.essay

    if (!req.body.organization) {
      return res.redirect('/essays/'+essay._id+'/organization/start')
    }

    essay = _.extend(essay, req.body)
    essay.save(function (err) {
      if (err) {
        res.render('essays/brainstorm/start', {
          title: 'New Essay',
          essay: essay,
          errors: err.errors
        })
      }
      else {
        res.redirect('/essays/'+essay._id+'/essay/show')
      }
    })
  }
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
      res.redirect('/essays/'+essay._id+'/essay/show')
    }
  })
}

/**
 * View an essay
 */

exports.show = function(req, res){
  res.render('essays/show', {
    title: 'Your Essay',
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
    res.redirect('/users/'+req.user.id)
  })
}

/**
 * List of Essays
 */

exports.index = function(req, res){
  var essay = new Essay(req.body)
  essay.user = req.user

  var page = req.param('page') > 0 ? req.param('page') : 0
  var perPage = 15
  var options = {
    perPage: perPage,
    page: page,
    criteria: { 'user': essay.user}
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
