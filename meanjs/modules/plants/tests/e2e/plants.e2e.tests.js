'use strict';

describe('Plants E2E Tests:', function () {
  describe('Test Plants page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/plants');
      expect(element.all(by.repeater('plant in plants')).count()).toEqual(0);
    });
  });
});
