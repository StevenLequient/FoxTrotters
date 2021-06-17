'use strict';

describe('Ditus E2E Tests:', function () {
  describe('Test Ditus page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ditus');
      expect(element.all(by.repeater('ditu in ditus')).count()).toEqual(0);
    });
  });
});
