'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Use = mongoose.model('Use');

/**
 * Globals
 */
var user,
  use;

/**
 * Unit tests
 */
describe('Use Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      use = new Use({
        user: user,
        desc: 'en salade',
        theme: '592c41c2d83b7e214064ee68'

      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      use.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without desc', function(done) {
      use.desc = '';

      use.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Use.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
