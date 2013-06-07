
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Essay = mongoose.model('Essay')

var count, cookies

/**
 * Essays tests
 */

describe('Essays', function () {
  before(function (done) {
    // create a user
    var user = new User({
      email: 'foobar@example.com',
      name: 'Foo bar',
      username: 'foobar',
      password: 'foobar'
    })
    user.save(done)
  })

  describe('GET /essays', function () {
    it('should respond with Content-Type text/html', function (done) {
      request(app)
      .get('/essays')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(/List of Essays/)
      .end(done)
    })
  })

  describe('GET /essays/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/essays/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      it('should respond with Content-Type text/html', function (done) {
        var req = request(app).get('/essays/new')
        req.cookies = cookies
        req
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/New Essay/)
        .end(done)
      })
    })
  })

  describe('POST /essays', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/essays/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })

    context('When logged in', function () {
      before(function (done) {
        // login the user
        request(app)
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(function (err, res) {
          // store the cookie
          cookies = res.headers['set-cookie'].pop().split(';')[0];
          done()
        })
      })

      describe('Invalid parameters', function () {
        before(function (done) {
          Essay.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          var req = request(app).post('/essays')
          req.cookies = cookies
          req
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Essay title cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Essay.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Essay.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new essay page', function (done) {
          var req = request(app).post('/essays')
          req.cookies = cookies
          req
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/essays\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should insert a record to the database', function (done) {
          Essay.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })

        it('should save the essay to the database', function (done) {
          Essay
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, essay) {
            should.not.exist(err)
            essay.should.be.an.instanceOf(Essay)
            essay.title.should.equal('foo')
            essay.body.should.equal('bar')
            essay.user.email.should.equal('foobar@example.com')
            essay.user.name.should.equal('Foo bar')
            done()
          })
        })
      })
    })
  })

  after(function (done) {
    require('./helper').clearDb(done)
  })
})
