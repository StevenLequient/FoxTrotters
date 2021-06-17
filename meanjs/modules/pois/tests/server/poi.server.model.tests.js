'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Poi = mongoose.model('Poi');

/**
 * Globals
 */
var user,
  poi;

/**
 * Unit tests
 */
describe('Poi Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      poi = new Poi({
        name: 'Poi Name',
        user: user,
        coords: { latitude: '0', longitude: '0' },
        desc: 'oi'
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      poi.save(function(err) {
        if (err)

          console.log(err);
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      poi.name = '';

      poi.save(function(err) {

        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Poi.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
