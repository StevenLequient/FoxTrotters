'use strict';

describe('Planders E2E Tests:', function () {
  describe('Test Planders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/planders');
      expect(element.all(by.repeater('plander in planders')).count()).toEqual(0);
    });
  });
});
