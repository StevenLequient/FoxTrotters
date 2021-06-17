'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plant = mongoose.model('Plant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  plant;

/**
 * Plant routes tests
 */
describe('Plant CRUD tests', function () {

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

    // Save a user to the test db and create new Plant
    user.save(function () {
      plant = {
        'pois': [],
        'uses': [],
        'genre': 'Zinnia',
        'family': 'Asteraceae',
        'latinName': 'Zinnia haageana Regel',
        'commonName': 'Zinnia'
      };

      done();
    });
  });

  it('should be able to save a Plant if logged in', function (done) {
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

        // Save a new Plant
        agent.post('/api/plants')
          .send(plant)
          .expect(200)
          .end(function (plantSaveErr, plantSaveRes) {
            // Handle Plant save error
            if (plantSaveErr) {
              return done(plantSaveErr);
            }

            // Get a list of Plants
            agent.get('/api/plants')
              .end(function (plantsGetErr, plantsGetRes) {
                // Handle Plants save error
                if (plantsGetErr) {
                  return done(plantsGetErr);
                }

                // Get Plants list
                var plants = plantsGetRes.body;

                // Set assertions
                (plants[0].user._id).should.equal(userId);
                (plants[0].commonName).should.match('Zinnia');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Plant if not logged in', function (done) {
    agent.post('/api/plants')
      .send(plant)
      .expect(403)
      .end(function (plantSaveErr, plantSaveRes) {
        // Call the assertion callback
        done(plantSaveErr);
      });
  });

  it('should not be able to save an Plant if no name is provided', function (done) {
    // Invalidate name field
    plant.commonName = '';

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

        // Save a new Plant
        agent.post('/api/plants')
          .send(plant)
          .expect(400)
          .end(function (plantSaveErr, plantSaveRes) {
            // Set message assertion
            (plantSaveRes.body.message).should.match('Please fill Plant name');

            // Handle Plant save error
            done(plantSaveErr);
          });
      });
  });

  it('should be able to update an Plant if signed in', function (done) {
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

        // Save a new Plant
        agent.post('/api/plants')
          .send(plant)
          .expect(200)
          .end(function (plantSaveErr, plantSaveRes) {
            // Handle Plant save error
            if (plantSaveErr) {
              return done(plantSaveErr);
            }

            // Update Plant name
            plant.commonName = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Plant
            agent.put('/api/plants/' + plantSaveRes.body._id)
              .send(plant)
              .expect(200)
              .end(function (plantUpdateErr, plantUpdateRes) {
                // Handle Plant update error
                if (plantUpdateErr) {
                  return done(plantUpdateErr);
                }

                // Set assertions
                (plantUpdateRes.body._id).should.equal(plantSaveRes.body._id);
                (plantUpdateRes.body.commonName).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Plants if not signed in', function (done) {
    // Create new Plant model instance
    var plantObj = new Plant(plant);

    // Save the plant
    plantObj.save(function () {
      // Request Plants
      request(app).get('/api/plants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Plant if not signed in', function (done) {
    // Create new Plant model instance
    var plantObj = new Plant(plant);

    // Save the Plant
    plantObj.save(function () {
      request(app).get('/api/plants/' + plantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('commonName', plant.commonName);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Plant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/plants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Plant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Plant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Plant
    request(app).get('/api/plants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Plant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Plant if signed in', function (done) {
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

        // Save a new Plant
        agent.post('/api/plants')
          .send(plant)
          .expect(200)
          .end(function (plantSaveErr, plantSaveRes) {
            // Handle Plant save error
            if (plantSaveErr) {
              return done(plantSaveErr);
            }

            // Delete an existing Plant
            agent.delete('/api/plants/' + plantSaveRes.body._id)
              .send(plant)
              .expect(200)
              .end(function (plantDeleteErr, plantDeleteRes) {
                // Handle plant error error
                if (plantDeleteErr) {
                  return done(plantDeleteErr);
                }

                // Set assertions
                (plantDeleteRes.body._id).should.equal(plantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Plant if not signed in', function (done) {
    // Set Plant user
    plant.user = user;

    // Create new Plant model instance
    var plantObj = new Plant(plant);

    // Save the Plant
    plantObj.save(function () {
      // Try deleting Plant
      request(app).delete('/api/plants/' + plantObj._id)
        .expect(403)
        .end(function (plantDeleteErr, plantDeleteRes) {
          // Set message assertion
          (plantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Plant error error
          done(plantDeleteErr);
        });

    });
  });

  it('should be able to get a single Plant that has an orphaned user reference', function (done) {
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

          // Save a new Plant
          agent.post('/api/plants')
            .send(plant)
            .expect(200)
            .end(function (plantSaveErr, plantSaveRes) {
              // Handle Plant save error
              if (plantSaveErr) {
                return done(plantSaveErr);
              }

              // Set assertions on new Plant
              (plantSaveRes.body.commonName).should.equal(plant.commonName);
              should.exist(plantSaveRes.body.user);
              should.equal(plantSaveRes.body.user._id, orphanId);

              // force the Plant to have an orphaned user reference
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

                    // Get the Plant
                    agent.get('/api/plants/' + plantSaveRes.body._id)
                      .expect(200)
                      .end(function (plantInfoErr, plantInfoRes) {
                        // Handle Plant error
                        if (plantInfoErr) {
                          return done(plantInfoErr);
                        }

                        // Set assertions
                        (plantInfoRes.body._id).should.equal(plantSaveRes.body._id);
                        (plantInfoRes.body.commonName).should.equal(plant.commonName);
                        should.equal(plantInfoRes.body.user, undefined);

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
      Plant.remove().exec(done);
    });
  });
});
