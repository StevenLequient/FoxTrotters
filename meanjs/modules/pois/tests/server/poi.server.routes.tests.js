'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Poi = mongoose.model('Poi'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  poi;

/**
 * Poi routes tests
 */
describe('Poi CRUD tests', function () {

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

    // Save a user to the test db and create new Poi
    user.save(function () {
      poi = {
        name: 'Poi name',
        desc: 'desc',
        coords: { latitude: '0', longitude: '0' }
      };

      done();
    });
  });

  it('should be able to save a Poi if logged in', function (done) {
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

        // Save a new Poi
        agent.post('/api/pois')
          .send(poi)
          .expect(200)
          .end(function (poiSaveErr, poiSaveRes) {
            // Handle Poi save error
            if (poiSaveErr) {
              return done(poiSaveErr);
            }

            // Get a list of Pois
            agent.get('/api/pois')
              .end(function (poisGetErr, poisGetRes) {
                // Handle Pois save error
                if (poisGetErr) {
                  return done(poisGetErr);
                }

                // Get Pois list
                var pois = poisGetRes.body;

                // Set assertions
                (pois[0].user._id).should.equal(userId);
                (pois[0].name).should.match('Poi name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Poi if not logged in', function (done) {
    agent.post('/api/pois')
      .send(poi)
      .expect(403)
      .end(function (poiSaveErr, poiSaveRes) {
        // Call the assertion callback
        done(poiSaveErr);
      });
  });

  it('should not be able to save an Poi if no name is provided', function (done) {
    // Invalidate name field
    poi.name = '';

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

        // Save a new Poi
        agent.post('/api/pois')
          .send(poi)
          .expect(400)
          .end(function (poiSaveErr, poiSaveRes) {
            // Set message assertion
            (poiSaveRes.body.message).should.match('Please fill Poi name');

            // Handle Poi save error
            done(poiSaveErr);
          });
      });
  });

  it('should be able to update an Poi if signed in', function (done) {
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

        // Save a new Poi
        agent.post('/api/pois')
          .send(poi)
          .expect(200)
          .end(function (poiSaveErr, poiSaveRes) {
            // Handle Poi save error
            if (poiSaveErr) {
              return done(poiSaveErr);
            }

            // Update Poi name
            poi.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Poi
            agent.put('/api/pois/' + poiSaveRes.body._id)
              .send(poi)
              .expect(200)
              .end(function (poiUpdateErr, poiUpdateRes) {
                // Handle Poi update error
                if (poiUpdateErr) {
                  return done(poiUpdateErr);
                }

                // Set assertions
                (poiUpdateRes.body._id).should.equal(poiSaveRes.body._id);
                (poiUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pois if not signed in', function (done) {
    // Create new Poi model instance
    var poiObj = new Poi(poi);

    // Save the poi
    poiObj.save(function () {
      // Request Pois
      request(app).get('/api/pois')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Poi if not signed in', function (done) {
    // Create new Poi model instance
    var poiObj = new Poi(poi);

    // Save the Poi
    poiObj.save(function () {
      request(app).get('/api/pois/' + poiObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', poi.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Poi with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pois/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Poi is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Poi which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Poi
    request(app).get('/api/pois/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Poi with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Poi if signed in', function (done) {
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

        // Save a new Poi
        agent.post('/api/pois')
          .send(poi)
          .expect(200)
          .end(function (poiSaveErr, poiSaveRes) {
            // Handle Poi save error
            if (poiSaveErr) {
              return done(poiSaveErr);
            }

            // Delete an existing Poi
            agent.delete('/api/pois/' + poiSaveRes.body._id)
              .send(poi)
              .expect(200)
              .end(function (poiDeleteErr, poiDeleteRes) {
                // Handle poi error error
                if (poiDeleteErr) {
                  return done(poiDeleteErr);
                }

                // Set assertions
                (poiDeleteRes.body._id).should.equal(poiSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Poi if not signed in', function (done) {
    // Set Poi user
    poi.user = user;

    // Create new Poi model instance
    var poiObj = new Poi(poi);

    // Save the Poi
    poiObj.save(function () {
      // Try deleting Poi
      request(app).delete('/api/pois/' + poiObj._id)
        .expect(403)
        .end(function (poiDeleteErr, poiDeleteRes) {
          // Set message assertion
          (poiDeleteRes.body.message).should.match('User is not authorized');

          // Handle Poi error error
          done(poiDeleteErr);
        });

    });
  });

  it('should be able to get a single Poi that has an orphaned user reference', function (done) {
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

          // Save a new Poi
          agent.post('/api/pois')
            .send(poi)
            .expect(200)
            .end(function (poiSaveErr, poiSaveRes) {
              // Handle Poi save error
              if (poiSaveErr) {
                return done(poiSaveErr);
              }

              // Set assertions on new Poi
              (poiSaveRes.body.name).should.equal(poi.name);
              should.exist(poiSaveRes.body.user);
              should.equal(poiSaveRes.body.user._id, orphanId);

              // force the Poi to have an orphaned user reference
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

                    // Get the Poi
                    agent.get('/api/pois/' + poiSaveRes.body._id)
                      .expect(200)
                      .end(function (poiInfoErr, poiInfoRes) {
                        // Handle Poi error
                        if (poiInfoErr) {
                          return done(poiInfoErr);
                        }

                        // Set assertions
                        (poiInfoRes.body._id).should.equal(poiSaveRes.body._id);
                        (poiInfoRes.body.name).should.equal(poi.name);
                        should.equal(poiInfoRes.body.user, undefined);

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
      Poi.remove().exec(done);
    });
  });
});
