'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Plander = mongoose.model('Plander');

/**
 * Globals
 */
var user,
  plander,
  credentials;

/**
 * Unit tests
 */
describe('Plander Model Unit Tests:', function() {
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
    user.save(function() {
      plander = new Plander({
        image: '/img/default.png',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      plander.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without image', function(done) {
      plander.image = '';

      plander.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Plander.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
