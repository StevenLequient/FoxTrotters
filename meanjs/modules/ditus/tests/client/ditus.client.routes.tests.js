(function () {
  'use strict';

  describe('Ditus Route Tests', function () {
    // Initialize global variables
    var $scope,
      DitusService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DitusService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DitusService = _DitusService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ditus');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ditus');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DitusController,
          mockDitu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ditus.view');
          $templateCache.put('modules/ditus/client/views/view-ditu.client.view.html', '');

          // create mock Ditu
          mockDitu = new DitusService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ditu Name'
          });

          // Initialize Controller
          DitusController = $controller('DitusController as vm', {
            $scope: $scope,
            dituResolve: mockDitu
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:dituId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.dituResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            dituId: 1
          })).toEqual('/ditus/1');
        }));

        it('should attach an Ditu to the controller scope', function () {
          expect($scope.vm.ditu._id).toBe(mockDitu._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ditus/client/views/view-ditu.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DitusController,
          mockDitu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ditus.create');
          $templateCache.put('modules/ditus/client/views/form-ditu.client.view.html', '');

          // create mock Ditu
          mockDitu = new DitusService();

          // Initialize Controller
          DitusController = $controller('DitusController as vm', {
            $scope: $scope,
            dituResolve: mockDitu
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.dituResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ditus/create');
        }));

        it('should attach an Ditu to the controller scope', function () {
          expect($scope.vm.ditu._id).toBe(mockDitu._id);
          expect($scope.vm.ditu._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ditus/client/views/form-ditu.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DitusController,
          mockDitu;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ditus.edit');
          $templateCache.put('modules/ditus/client/views/form-ditu.client.view.html', '');

          // create mock Ditu
          mockDitu = new DitusService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ditu Name'
          });

          // Initialize Controller
          DitusController = $controller('DitusController as vm', {
            $scope: $scope,
            dituResolve: mockDitu
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:dituId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.dituResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            dituId: 1
          })).toEqual('/ditus/1/edit');
        }));

        it('should attach an Ditu to the controller scope', function () {
          expect($scope.vm.ditu._id).toBe(mockDitu._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ditus/client/views/form-ditu.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
