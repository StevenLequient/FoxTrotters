'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plander = mongoose.model('Plander'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  plander;

/**
 * Plander routes tests
 */
describe('Plander CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
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

    // Save a user to the test db and create new Plander
    user.save(function () {
      plander = {
        image: '/img/default.png'
      };

      done();
    });
  });
/*

  it('should be able to save a Plander if logged in', function (done) {
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

        // Save a new Plander
        agent.post('/api/planders')
          .send(plander)
          .expect(200)
          .end(function (planderSaveErr, planderSaveRes) {
            // Handle Plander save error
            if (planderSaveErr) {
              return done(planderSaveErr);
            }

            // Get a list of Planders
            agent.get('/api/planders')
              .end(function (plandersGetErr, plandersGetRes) {
                // Handle Planders save error
                if (plandersGetErr) {
                  return done(plandersGetErr);
                }

                // Get Planders list
                var planders = plandersGetRes.body;

                // Set assertions
                (planders[0].user._id).should.equal(userId);
                (planders[0].image).should.match('/img/default.png');

                // Call the assertion callback
                done();
              });
          });
      });
  });
*/

/*  it('should not be able to save an Plander if not logged in', function (done) {
    agent.post('/api/planders')
      .send(plander)
      .expect(403)
      .end(function (planderSaveErr, planderSaveRes) {
        // Call the assertion callback
        done(planderSaveErr);
      });
  });*/

/*  it('should not be able to save an Plander if no image is provided', function (done) {
    // Invalidate image field
    plander.image = '';

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

        // Save a new Plander
        agent.post('/api/planders')
          .send(plander)
          .expect(400)
          .end(function (planderSaveErr, planderSaveRes) {
            // Set message assertion
            (planderSaveRes.body.message).should.match('Please add an image');

            // Handle Plander save error
            done(planderSaveErr);
          });
      });
  });*/

  /*it('should be able to update an Plander if signed in', function (done) {
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

        // Save a new Plander
        agent.post('/api/planders')
          .send(plander)
          .expect(200)
          .end(function (planderSaveErr, planderSaveRes) {
            // Handle Plander save error
            if (planderSaveErr) {
              return done(planderSaveErr);
            }

            // Update Plander image
            plander.image = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Plander
            agent.put('/api/planders/' + planderSaveRes.body._id)
              .send(plander)
              .expect(200)
              .end(function (planderUpdateErr, planderUpdateRes) {
                // Handle Plander update error
                if (planderUpdateErr) {
                  return done(planderUpdateErr);
                }

                // Set assertions
                (planderUpdateRes.body._id).should.equal(planderSaveRes.body._id);
                (planderUpdateRes.body.image).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });*/

  it('should be able to get a list of Planders if not signed in', function (done) {
    // Create new Plander model instance
    var planderObj = new Plander(plander);

    // Save the plander
    planderObj.save(function () {
      // Request Planders
      request(app).get('/api/planders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Plander if not signed in', function (done) {
    // Create new Plander model instance
    var planderObj = new Plander(plander);

    // Save the Plander
    planderObj.save(function () {
      request(app).get('/api/planders/' + planderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('image', plander.image);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Plander with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/planders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Plander is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Plander which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Plander
    request(app).get('/api/planders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Plander with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

/*
  it('should be able to delete an Plander if signed in', function (done) {
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

        // Save a new Plander
        agent.post('/api/planders')
          .send(plander)
          .expect(200)
          .end(function (planderSaveErr, planderSaveRes) {
            // Handle Plander save error
            if (planderSaveErr) {
              return done(planderSaveErr);
            }

            // Delete an existing Plander
            agent.delete('/api/planders/' + planderSaveRes.body._id)
              .send(plander)
              .expect(200)
              .end(function (planderDeleteErr, planderDeleteRes) {
                // Handle plander error error
                if (planderDeleteErr) {
                  return done(planderDeleteErr);
                }

                // Set assertions
                (planderDeleteRes.body._id).should.equal(planderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });
*/
/*

  it('should not be able to delete an Plander if not signed in', function (done) {
    // Set Plander user
    plander.user = user;

    // Create new Plander model instance
    var planderObj = new Plander(plander);

    // Save the Plander
    planderObj.save(function () {
      // Try deleting Plander
      request(app).delete('/api/planders/' + planderObj._id)
        .expect(403)
        .end(function (planderDeleteErr, planderDeleteRes) {
          // Set message assertion
          (planderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Plander error error
          done(planderDeleteErr);
        });

    });
  });
*/

/*
  it('should be able to get a single Plander that has an orphaned user reference', function (done) {
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

          // Save a new Plander
          agent.post('/api/planders')
            .send(plander)
            .expect(200)
            .end(function (planderSaveErr, planderSaveRes) {
              // Handle Plander save error
              if (planderSaveErr) {
                return done(planderSaveErr);
              }

              // Set assertions on new Plander
              (planderSaveRes.body.image).should.equal(plander.image);
              should.exist(planderSaveRes.body.user);
              should.equal(planderSaveRes.body.user._id, orphanId);

              // force the Plander to have an orphaned user reference
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

                    // Get the Plander
                    agent.get('/api/planders/' + planderSaveRes.body._id)
                      .expect(200)
                      .end(function (planderInfoErr, planderInfoRes) {
                        // Handle Plander error
                        if (planderInfoErr) {
                          return done(planderInfoErr);
                        }

                        // Set assertions
                        (planderInfoRes.body._id).should.equal(planderSaveRes.body._id);
                        (planderInfoRes.body.image).should.equal(plander.image);
                        should.equal(planderInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });
*/

  afterEach(function (done) {
    User.remove().exec(function () {
      Plander.remove().exec(done);
    });
  });
});
