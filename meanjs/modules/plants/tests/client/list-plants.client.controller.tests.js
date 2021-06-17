(function () {
  'use strict';

  describe('Plants List Controller Tests', function () {
    // Initialize global variables
    var PlantsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      PlantsService,
      mockPlant;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _PlantsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      PlantsService = _PlantsService_;

      // create mock plant
      mockPlant = new PlantsService({
        _id: '525a8422f6d0f87f0e407a33',
        commonName: 'Plant Common name',
        latinName: 'Plant Latin name',
        family: 'Plant Family name',
        genre: 'Plant Genre name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Plants List controller.
      PlantsListController = $controller('PlantsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockPlantList;

      beforeEach(function () {
        mockPlantList = [mockPlant, mockPlant];
      });

      it('should send a GET request and return all Plants', inject(function (PlantsService) {
        // Set POST response
        $httpBackend.expectGET('api/plants').respond(mockPlantList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.plants.length).toEqual(2);
        expect($scope.vm.plants[0]).toEqual(mockPlant);
        expect($scope.vm.plants[1]).toEqual(mockPlant);

      }));
    });
  });
}());
