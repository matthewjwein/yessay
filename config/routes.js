
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', users.user)

  // essay routes
  var essays = require('../app/controllers/essays');
  app.get('/essays', essays.index)
  app.get('/essays/intro', auth.requiresLogin, essays.intro)

  app.get('/essays/brainstorm/intro', essays.brainstorm.intro)
  app.get('/essays/brainstorm/samples', essays.brainstorm.samples)
  app.get('/essays/brainstorm/start', essays.brainstorm.start)
  app.post('/essays', auth.requiresLogin, essays.create)
  app.post('/essays/brainstorm/save', auth.requiresLogin, essays.brainstorm.save)

  // essay description routes
  app.get('/essays/:id/description/intro', auth.requiresLogin, essays.description.intro)
  app.get('/essays/:id/description/samples', auth.requiresLogin, essays.description.samples)
  app.get('/essays/:id/description/start', auth.requiresLogin, essays.description.start)
  app.put('/essays/:id/description/save', auth.requiresLogin, essays.description.save)

  // essay context routes
  app.get('/essays/:id/context/intro', auth.requiresLogin, essays.context.intro)
  app.get('/essays/:id/context/samples', auth.requiresLogin, essays.context.samples)
  app.get('/essays/:id/context/start', auth.requiresLogin, essays.context.start)
  app.put('/essays/:id/context/save', auth.requiresLogin, essays.context.save)

  // essay reflect routes
  app.get('/essays/:id/reflection/intro', auth.requiresLogin, essays.reflection.intro)
  app.get('/essays/:id/reflection/samples', auth.requiresLogin, essays.reflection.samples)
  app.get('/essays/:id/reflection/start', auth.requiresLogin, essays.reflection.start)
  app.put('/essays/:id/reflection/save', auth.requiresLogin, essays.reflection.save)

  // essay community routes
  app.get('/essays/:id/community/intro', auth.requiresLogin, essays.community.intro)
  app.put('/essays/:id/community/join', auth.requiresLogin,  essays.community.join_community)
  app.get('/essays/:id/community/review', auth.requiresLogin, essays.community.review)

  // essay organize routes
  app.get('/essays/:id/organization/intro', auth.requiresLogin, essays.organization.intro)
  app.get('/essays/:id/organization/samples', auth.requiresLogin, essays.organization.samples)
  app.get('/essays/:id/organization/samples-annotated', auth.requiresLogin, essays.organization.samples_annotated)
  app.get('/essays/:id/organization/idea-prompt', auth.requiresLogin, essays.organization.idea_prompt)
  app.put('/essays/:id/organization/save-idea-prompt', auth.requiresLogin, essays.organization.save_idea_prompt)
  app.put('/essays/:id/organization/save-review', auth.requiresLogin, essays.organization.save_review)
  app.get('/essays/:id/organization/start', auth.requiresLogin, essays.organization.start)
  app.put('/essays/:id/organization/save', auth.requiresLogin, essays.organization.save)

  app.get('/essays/:id', essays.show)
  app.get('/essays/:id/edit', auth.requiresLogin, auth.essay.hasAuthorization, essays.edit)
  app.put('/essays/:id', auth.requiresLogin, auth.essay.hasAuthorization, essays.update)
  app.del('/essays/:id', auth.requiresLogin, auth.essay.hasAuthorization, essays.destroy)

  app.param('id', essays.essay)

  // home route
  var home = require('../app/controllers/home');
  app.get('/', home.index)

  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/essays/:id/comments', auth.requiresLogin, comments.create)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
