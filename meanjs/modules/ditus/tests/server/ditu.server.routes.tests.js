'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ditu = mongoose.model('Ditu'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ditu;

/**
 * Ditu routes tests
 */
describe('Ditu CRUD tests', function () {

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

    // Save a user to the test db and create new Ditu
    user.save(function () {
      ditu = {
        name: 'Ditu name'
      };
      done();
    });
  });

  it('should be able to save a Ditu if logged in', function (done) {


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

        // Save a new Ditu
        agent.post('/api/ditus')
          .send(ditu)
          .expect(200)
          .end(function (dituSaveErr, dituSaveRes) {
            // Handle Ditu save error
            if (dituSaveErr) {
              return done(dituSaveErr);
            }

            // Get a list of Ditus
            agent.get('/api/ditus')
              .end(function (ditusGetErr, ditusGetRes) {
                // Handle Ditus save error
                if (ditusGetErr) {
                  return done(ditusGetErr);
                }

                // Get Ditus list
                var ditus = ditusGetRes.body;

                // Set assertions
                (ditus[0].user._id).should.equal(userId);
                (ditus[0].name).should.match('Ditu name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ditu if not logged in', function (done) {
    agent.post('/api/ditus')
      .send(ditu)
      .expect(403)
      .end(function (dituSaveErr, dituSaveRes) {
        // Call the assertion callback
        done(dituSaveErr);
      });
  });

  it('should not be able to save an Ditu if no name is provided', function (done) {
    // Invalidate name field
    ditu.name = '';

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

        // Save a new Ditu
        agent.post('/api/ditus')
          .send(ditu)
          .expect(400)
          .end(function (dituSaveErr, dituSaveRes) {
            // Set message assertion
            (dituSaveRes.body.message).should.match('Please fill Ditu name');

            // Handle Ditu save error
            done(dituSaveErr);
          });
      });
  });

  it('should be able to update an Ditu if signed in', function (done) {
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

        // Save a new Ditu
        agent.post('/api/ditus')
          .send(ditu)
          .expect(200)
          .end(function (dituSaveErr, dituSaveRes) {
            // Handle Ditu save error
            if (dituSaveErr) {
              return done(dituSaveErr);
            }

            // Update Ditu name
            ditu.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ditu
            agent.put('/api/ditus/' + dituSaveRes.body._id)
              .send(ditu)
              .expect(200)
              .end(function (dituUpdateErr, dituUpdateRes) {
                // Handle Ditu update error
                if (dituUpdateErr) {
                  return done(dituUpdateErr);
                }

                // Set assertions
                (dituUpdateRes.body._id).should.equal(dituSaveRes.body._id);
                (dituUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ditus if not signed in', function (done) {
    // Create new Ditu model instance
    var dituObj = new Ditu(ditu);

    // Save the ditu
    dituObj.save(function () {
      // Request Ditus
      request(app).get('/api/ditus')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ditu if not signed in', function (done) {
    // Create new Ditu model instance
    var dituObj = new Ditu(ditu);

    // Save the Ditu
    dituObj.save(function () {
      request(app).get('/api/ditus/' + dituObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', ditu.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ditu with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ditus/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ditu is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ditu which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ditu
    request(app).get('/api/ditus/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ditu with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ditu if signed in', function (done) {
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

        // Save a new Ditu
        agent.post('/api/ditus')
          .send(ditu)
          .expect(200)
          .end(function (dituSaveErr, dituSaveRes) {
            // Handle Ditu save error
            if (dituSaveErr) {
              return done(dituSaveErr);
            }

            // Delete an existing Ditu
            agent.delete('/api/ditus/' + dituSaveRes.body._id)
              .send(ditu)
              .expect(200)
              .end(function (dituDeleteErr, dituDeleteRes) {
                // Handle ditu error error
                if (dituDeleteErr) {
                  return done(dituDeleteErr);
                }

                // Set assertions
                (dituDeleteRes.body._id).should.equal(dituSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ditu if not signed in', function (done) {
    // Set Ditu user
    ditu.user = user;

    // Create new Ditu model instance
    var dituObj = new Ditu(ditu);

    // Save the Ditu
    dituObj.save(function () {
      // Try deleting Ditu
      request(app).delete('/api/ditus/' + dituObj._id)
        .expect(403)
        .end(function (dituDeleteErr, dituDeleteRes) {
          // Set message assertion
          (dituDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ditu error error
          done(dituDeleteErr);
        });

    });
  });

  it('should be able to get a single Ditu that has an orphaned user reference', function (done) {
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

          // Save a new Ditu
          agent.post('/api/ditus')
            .send(ditu)
            .expect(200)
            .end(function (dituSaveErr, dituSaveRes) {
              // Handle Ditu save error
              if (dituSaveErr) {
                return done(dituSaveErr);
              }

              // Set assertions on new Ditu
              (dituSaveRes.body.name).should.equal(ditu.name);
              should.exist(dituSaveRes.body.user);
              should.equal(dituSaveRes.body.user._id, orphanId);

              // force the Ditu to have an orphaned user reference
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

                    // Get the Ditu
                    agent.get('/api/ditus/' + dituSaveRes.body._id)
                      .expect(200)
                      .end(function (dituInfoErr, dituInfoRes) {
                        // Handle Ditu error
                        if (dituInfoErr) {
                          return done(dituInfoErr);
                        }

                        // Set assertions
                        (dituInfoRes.body._id).should.equal(dituSaveRes.body._id);
                        (dituInfoRes.body.name).should.equal(ditu.name);
                        should.equal(dituInfoRes.body.user, undefined);

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
      Ditu.remove().exec(done);
    });
  });
});
