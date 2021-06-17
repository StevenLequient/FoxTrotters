'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Theme = mongoose.model('Theme'),
  Use = mongoose.model('Use'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  use,
  theme;

/**
 * Use routes tests
 */
describe('Use CRUD tests', function () {

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
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });
    // Save a user to the test db and create new Use
    user.save(function () {

      theme = new Theme({ name: 'toxic' });

      theme.save(function () {
        use = {
          theme: theme.id,
          desc: 'desc'
        };
        done();
      });
    });
  });

  it('should be able to save a Use if logged in', function (done) {
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

        // Save a new Use
        agent.post('/api/uses')
          .send(use)
          .expect(200)
          .end(function (useSaveErr, useSaveRes) {
            // Handle Use save error
            if (useSaveErr) {
              return done(useSaveErr);
            }

            // Get a list of Uses
            agent.get('/api/uses')
              .end(function (usesGetErr, usesGetRes) {
                // Handle Uses save error
                if (usesGetErr) {
                  return done(usesGetErr);
                }

                // Get Uses list
                var uses = usesGetRes.body;

                // Set assertions
                (uses[0].user._id).should.equal(userId);
                (uses[0].desc).should.match('desc');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Use if not logged in', function (done) {
    agent.post('/api/uses')
      .send(use)
      .expect(403)
      .end(function (useSaveErr, useSaveRes) {
        // Call the assertion callback
        done(useSaveErr);
      });
  });

  it('should not be able to save an Use if no desc is provided', function (done) {
    // Invalidate desc field
    use.desc = '';

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

        // Save a new Use
        agent.post('/api/uses')
          .send(use)
          .expect(400)
          .end(function (useSaveErr, useSaveRes) {
            // Set message assertion
            (useSaveRes.body.message).should.match('Please fill desc');

            // Handle Use save error
            done(useSaveErr);
          });
      });
  });

  it('should be able to update an Use if signed in', function (done) {
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

        // Save a new Use
        agent.post('/api/uses')
          .send(use)
          .expect(200)
          .end(function (useSaveErr, useSaveRes) {
            // Handle Use save error
            if (useSaveErr) {
              return done(useSaveErr);
            }

            // Update Use desc
            use.desc = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Use
            agent.put('/api/uses/' + useSaveRes.body._id)
              .send(use)
              .expect(200)
              .end(function (useUpdateErr, useUpdateRes) {
                // Handle Use update error
                if (useUpdateErr) {
                  return done(useUpdateErr);
                }

                // Set assertions
                (useUpdateRes.body._id).should.equal(useSaveRes.body._id);
                (useUpdateRes.body.desc).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Uses if not signed in', function (done) {
    // Create new Use model instance
    var useObj = new Use(use);

    // Save the use
    useObj.save(function () {
      // Request Uses
      request(app).get('/api/uses')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Use if not signed in', function (done) {
    // Create new Use model instance
    var useObj = new Use(use);

    // Save the Use
    useObj.save(function () {
      request(app).get('/api/uses/' + useObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('desc', use.desc);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Use with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/uses/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Use is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Use which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Use
    request(app).get('/api/uses/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Use with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Use if signed in', function (done) {
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

        // Save a new Use
        agent.post('/api/uses')
          .send(use)
          .expect(200)
          .end(function (useSaveErr, useSaveRes) {
            // Handle Use save error
            if (useSaveErr) {
              return done(useSaveErr);
            }

            // Delete an existing Use
            agent.delete('/api/uses/' + useSaveRes.body._id)
              .send(use)
              .expect(200)
              .end(function (useDeleteErr, useDeleteRes) {
                // Handle use error error
                if (useDeleteErr) {
                  return done(useDeleteErr);
                }

                // Set assertions
                (useDeleteRes.body._id).should.equal(useSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Use if not signed in', function (done) {
    // Set Use user
    use.user = user;

    // Create new Use model instance
    var useObj = new Use(use);

    // Save the Use
    useObj.save(function () {
      // Try deleting Use
      request(app).delete('/api/uses/' + useObj._id)
        .expect(403)
        .end(function (useDeleteErr, useDeleteRes) {
          // Set message assertion
          (useDeleteRes.body.message).should.match('User is not authorized');

          // Handle Use error error
          done(useDeleteErr);
        });

    });
  });

  it('should be able to get a single Use that has an orphaned user reference', function (done) {
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

          // Save a new Use
          agent.post('/api/uses')
            .send(use)
            .expect(200)
            .end(function (useSaveErr, useSaveRes) {
              // Handle Use save error
              if (useSaveErr) {
                return done(useSaveErr);
              }

              // Set assertions on new Use
              (useSaveRes.body.desc).should.equal(use.desc);
              should.exist(useSaveRes.body.user);
              should.equal(useSaveRes.body.user._id, orphanId);

              // force the Use to have an orphaned user reference
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

                    // Get the Use
                    agent.get('/api/uses/' + useSaveRes.body._id)
                      .expect(200)
                      .end(function (useInfoErr, useInfoRes) {
                        // Handle Use error
                        if (useInfoErr) {
                          return done(useInfoErr);
                        }

                        // Set assertions
                        (useInfoRes.body._id).should.equal(useSaveRes.body._id);
                        (useInfoRes.body.desc).should.equal(use.desc);
                        should.equal(useInfoRes.body.user, undefined);

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
      Use.remove().exec(done);
    });
  });
});
