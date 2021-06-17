'use strict';

describe('Uses E2E Tests:', function () {
  describe('Test Uses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/uses');
      expect(element.all(by.repeater('use in uses')).count()).toEqual(0);
    });
  });
});
