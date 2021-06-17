(function () {
  'use strict';

  describe('Uses Route Tests', function () {
    // Initialize global variables
    var $scope,
      UsesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _UsesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      UsesService = _UsesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('uses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/uses');
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
          UsesController,
          mockUse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('uses.view');
          $templateCache.put('modules/uses/client/views/view-use.client.view.html', '');

          // create mock Use
          mockUse = new UsesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Use Name'
          });

          // Initialize Controller
          UsesController = $controller('UsesController as vm', {
            $scope: $scope,
            useResolve: mockUse
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:useId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.useResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            useId: 1
          })).toEqual('/uses/1');
        }));

        it('should attach an Use to the controller scope', function () {
          expect($scope.vm.use._id).toBe(mockUse._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/uses/client/views/view-use.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          UsesController,
          mockUse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('uses.create');
          $templateCache.put('modules/uses/client/views/form-use.client.view.html', '');

          // create mock Use
          mockUse = new UsesService();

          // Initialize Controller
          UsesController = $controller('UsesController as vm', {
            $scope: $scope,
            useResolve: mockUse
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.useResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/uses/create');
        }));

        it('should attach an Use to the controller scope', function () {
          expect($scope.vm.use._id).toBe(mockUse._id);
          expect($scope.vm.use._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/uses/client/views/form-use.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          UsesController,
          mockUse;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('uses.edit');
          $templateCache.put('modules/uses/client/views/form-use.client.view.html', '');

          // create mock Use
          mockUse = new UsesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Use Name'
          });

          // Initialize Controller
          UsesController = $controller('UsesController as vm', {
            $scope: $scope,
            useResolve: mockUse
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:useId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.useResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            useId: 1
          })).toEqual('/uses/1/edit');
        }));

        it('should attach an Use to the controller scope', function () {
          expect($scope.vm.use._id).toBe(mockUse._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/uses/client/views/form-use.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
