'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Theme = mongoose.model('Theme'),
  Plant = mongoose.model('Plant');

/**
 * Globals
 */
var user,
  theme,
  plant,
  credentials;

/**
 * Unit tests
 */

describe('Plant Model Unit Tests:', function() {
  beforeEach(function(done) {
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

    theme = new Theme({
      id: '592fd36fed765d27e0a2b331',
      name: 'edible',
      icon: '/modules/plants/server/img/edible.svg'

    });

    user.save(function () {
      plant = new Plant({
        'pois': [],
        'uses': [],
        'genre': 'Zinnia',
        'family': 'Asteraceae',
        'latinName': 'Zinnia haageana Regel',
        'commonName': 'Zinnia'
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      plant.save(function(err) {

        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without commonName', function (done) {
      plant.commonName = '';

      plant.save(function(err) {

        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Plant.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
