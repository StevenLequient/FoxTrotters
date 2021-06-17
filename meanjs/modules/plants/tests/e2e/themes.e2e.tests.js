'use strict';

describe('Themes E2E Tests:', function () {
  describe('Test Themes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/themes');
      expect(element.all(by.repeater('theme in themes')).count()).toEqual(0);
    });
  });
});
