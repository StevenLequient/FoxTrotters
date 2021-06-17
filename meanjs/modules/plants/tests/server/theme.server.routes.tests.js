'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Theme = mongoose.model('Theme'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  theme;

/**
 * Theme routes tests
 */
describe('Theme CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };


    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Theme
    user.save(function () {
      theme = {
        name: 'Theme name'
      };

      done();
    });
  });

  it('should be able to save a Theme if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Theme
        agent.post('/api/themes')
          .send(theme)
          .expect(200)
          .end(function (themeSaveErr, themeSaveRes) {
            // Handle Theme save error
            if (themeSaveErr) {
              return done(themeSaveErr);
            }

            // Get a list of Themes
            agent.get('/api/themes')
              .end(function (themesGetErr, themesGetRes) {
                // Handle Themes save error
                if (themesGetErr) {
                  return done(themesGetErr);
                }

                // Get Themes list
                var themes = themesGetRes.body;

                // Set assertions
                (themes[0].user._id).should.equal(userId);
                (themes[0].name).should.match('Theme name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Theme if not logged in', function (done) {
    agent.post('/api/themes')
      .send(theme)
      .expect(403)
      .end(function (themeSaveErr, themeSaveRes) {
        // Call the assertion callback
        done(themeSaveErr);
      });
  });

  it('should not be able to save an Theme if no name is provided', function (done) {
    // Invalidate name field
    theme.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Theme
        agent.post('/api/themes')
          .send(theme)
          .expect(400)
          .end(function (themeSaveErr, themeSaveRes) {
            // Set message assertion
            (themeSaveRes.body.message).should.match('Please fill theme name');

            // Handle Theme save error
            done(themeSaveErr);
          });
      });
  });

  it('should be able to update an Theme if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Theme
        agent.post('/api/themes')
          .send(theme)
          .expect(200)
          .end(function (themeSaveErr, themeSaveRes) {
            // Handle Theme save error
            if (themeSaveErr) {
              return done(themeSaveErr);
            }

            // Update Theme name
            theme.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Theme
            agent.put('/api/themes/' + themeSaveRes.body._id)
              .send(theme)
              .expect(200)
              .end(function (themeUpdateErr, themeUpdateRes) {
                // Handle Theme update error
                if (themeUpdateErr) {
                  return done(themeUpdateErr);
                }

                // Set assertions
                (themeUpdateRes.body._id).should.equal(themeSaveRes.body._id);
                (themeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Themes if not signed in', function (done) {
    // Create new Theme model instance
    var themeObj = new Theme(theme);

    // Save the theme
    themeObj.save(function () {
      // Request Themes
      request(app).get('/api/themes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Theme if not signed in', function (done) {
    // Create new Theme model instance
    var themeObj = new Theme(theme);

    // Save the Theme
    themeObj.save(function () {
      request(app).get('/api/themes/' + themeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', theme.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Theme with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/themes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Theme is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Theme which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Theme
    request(app).get('/api/themes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Theme with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Theme if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Theme
        agent.post('/api/themes')
          .send(theme)
          .expect(200)
          .end(function (themeSaveErr, themeSaveRes) {
            // Handle Theme save error
            if (themeSaveErr) {
              return done(themeSaveErr);
            }

            // Delete an existing Theme
            agent.delete('/api/themes/' + themeSaveRes.body._id)
              .send(theme)
              .expect(200)
              .end(function (themeDeleteErr, themeDeleteRes) {
                // Handle theme error error
                if (themeDeleteErr) {
                  return done(themeDeleteErr);
                }

                // Set assertions
                (themeDeleteRes.body._id).should.equal(themeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Theme if not signed in', function (done) {
    // Set Theme user
    theme.user = user;

    // Create new Theme model instance
    var themeObj = new Theme(theme);

    // Save the Theme
    themeObj.save(function () {
      // Try deleting Theme
      request(app).delete('/api/themes/' + themeObj._id)
        .expect(403)
        .end(function (themeDeleteErr, themeDeleteRes) {
          // Set message assertion
          (themeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Theme error error
          done(themeDeleteErr);
        });

    });
  });

  it('should be able to get a single Theme that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Theme
          agent.post('/api/themes')
            .send(theme)
            .expect(200)
            .end(function (themeSaveErr, themeSaveRes) {
              // Handle Theme save error
              if (themeSaveErr) {
                return done(themeSaveErr);
              }

              // Set assertions on new Theme
              (themeSaveRes.body.name).should.equal(theme.name);
              should.exist(themeSaveRes.body.user);
              should.equal(themeSaveRes.body.user._id, orphanId);

              // force the Theme to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Theme
                    agent.get('/api/themes/' + themeSaveRes.body._id)
                      .expect(200)
                      .end(function (themeInfoErr, themeInfoRes) {
                        // Handle Theme error
                        if (themeInfoErr) {
                          return done(themeInfoErr);
                        }

                        // Set assertions
                        (themeInfoRes.body._id).should.equal(themeSaveRes.body._id);
                        (themeInfoRes.body.name).should.equal(theme.name);
                        should.equal(themeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Theme.remove().exec(done);
    });
  });
});
