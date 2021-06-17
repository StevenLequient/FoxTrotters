(function () {
  'use strict';

  describe('Plants Route Tests', function () {
    // Initialize global variables
    var $scope,
      PlantsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PlantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PlantsService = _PlantsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('plants');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/plants');
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
          PlantsController,
          mockPlant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('plants.view');
          $templateCache.put('modules/plants/client/views/view-plant.client.view.html', '');

          // create mock Plant
          mockPlant = new PlantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plant Name'
          });

          // Initialize Controller
          PlantsController = $controller('PlantsController as vm', {
            $scope: $scope,
            plantResolve: mockPlant
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:plantId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.plantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            plantId: 1
          })).toEqual('/plants/1');
        }));

        it('should attach an Plant to the controller scope', function () {
          expect($scope.vm.plant._id).toBe(mockPlant._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/plants/client/views/view-plant.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PlantsController,
          mockPlant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('plants.create');
          $templateCache.put('modules/plants/client/views/form-plant.client.view.html', '');

          // create mock Plant
          mockPlant = new PlantsService();

          // Initialize Controller
          PlantsController = $controller('PlantsController as vm', {
            $scope: $scope,
            plantResolve: mockPlant
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.plantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/plants/create');
        }));

        it('should attach an Plant to the controller scope', function () {
          expect($scope.vm.plant._id).toBe(mockPlant._id);
          expect($scope.vm.plant._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/plants/client/views/form-plant.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PlantsController,
          mockPlant;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('plants.edit');
          $templateCache.put('modules/plants/client/views/form-plant.client.view.html', '');

          // create mock Plant
          mockPlant = new PlantsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Plant Name'
          });

          // Initialize Controller
          PlantsController = $controller('PlantsController as vm', {
            $scope: $scope,
            plantResolve: mockPlant
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:plantId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.plantResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            plantId: 1
          })).toEqual('/plants/1/edit');
        }));

        it('should attach an Plant to the controller scope', function () {
          expect($scope.vm.plant._id).toBe(mockPlant._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/plants/client/views/form-plant.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
