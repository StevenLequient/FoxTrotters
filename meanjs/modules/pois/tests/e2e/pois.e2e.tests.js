'use strict';

describe('Pois E2E Tests:', function () {
  describe('Test Pois page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pois');
      expect(element.all(by.repeater('poi in pois')).count()).toEqual(0);
    });
  });
});
