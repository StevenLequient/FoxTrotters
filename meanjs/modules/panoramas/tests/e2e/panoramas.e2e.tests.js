'use strict';

describe('Panoramas E2E Tests:', function () {
  describe('Test Panoramas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/panoramas');
      expect(element.all(by.repeater('panorama in panoramas')).count()).toEqual(0);
    });
  });
});
