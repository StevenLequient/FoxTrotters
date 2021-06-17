(function () {
  'use strict';

  describe('Planders Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlandersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlandersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlandersService = _PlandersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('planders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/planders');
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
          PlandersController,
          mockPlander;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('planders.view');
          $templateCache.put('modules/planders/client/views/view-plander.client.view.html', '');

          // create mock Plander
          mockPlander = new PlandersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plander Name'
          });

          // Initialize Controller
          PlandersController = $controller('PlandersController as vm', {
            $scope: $scope,
            planderResolve: mockPlander
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:planderId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.planderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            planderId: 1
          })).toEqual('/planders/1');
        }));

        it('should attach an Plander to the controller scope', function () {
          expect($scope.vm.plander._id).toBe(mockPlander._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/planders/client/views/view-plander.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlandersController,
          mockPlander;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('planders.create');
          $templateCache.put('modules/planders/client/views/form-plander.client.view.html', '');

          // create mock Plander
          mockPlander = new PlandersService();

          // Initialize Controller
          PlandersController = $controller('PlandersController as vm', {
            $scope: $scope,
            planderResolve: mockPlander
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.planderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/planders/create');
        }));

        it('should attach an Plander to the controller scope', function () {
          expect($scope.vm.plander._id).toBe(mockPlander._id);
          expect($scope.vm.plander._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/planders/client/views/form-plander.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlandersController,
          mockPlander;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('planders.edit');
          $templateCache.put('modules/planders/client/views/form-plander.client.view.html', '');

          // create mock Plander
          mockPlander = new PlandersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plander Name'
          });

          // Initialize Controller
          PlandersController = $controller('PlandersController as vm', {
            $scope: $scope,
            planderResolve: mockPlander
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:planderId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.planderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            planderId: 1
          })).toEqual('/planders/1/edit');
        }));

        it('should attach an Plander to the controller scope', function () {
          expect($scope.vm.plander._id).toBe(mockPlander._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/planders/client/views/form-plander.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
