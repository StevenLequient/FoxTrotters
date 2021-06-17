(function () {
  'use strict';

  describe('Ditus Controller Tests', function () {
    // Initialize global variables
    var DitusController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      DitusService,
      mockDitu;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _DitusService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      DitusService = _DitusService_;

      // create mock Ditu
      mockDitu = new DitusService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Ditu Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Ditus controller.
      DitusController = $controller('DitusController as vm', {
        $scope: $scope,
        dituResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleDituPostData;

      beforeEach(function () {
        // Create a sample Ditu object
        sampleDituPostData = new DitusService({
          name: 'Ditu Name'
        });

        $scope.vm.ditu = sampleDituPostData;
      });

    /*  it('should send a POST request with the form input values and then locate to new object URL', inject(function (DitusService) {
        // Set POST response
        $httpBackend.expectPOST('api/ditus', sampleDituPostData).respond(mockDitu);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Ditu was created
        expect($state.go).toHaveBeenCalledWith('ditus.view', {
          dituId: mockDitu._id
        });
      }));*/

      /* it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ditus', sampleDituPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }) */
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Ditu in $scope
        $scope.vm.ditu = mockDitu;
      });

      /* it('should update a valid Ditu', inject(function (DitusService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ditus\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('ditus.view', {
          dituId: mockDitu._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (DitusService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ditus\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));*/
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Ditus
        $scope.vm.ditu = mockDitu;
      });

     /* it('should delete the Ditu and redirect to Ditus', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/ditus\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('ditus.list');
      });*/

      it('should should not delete the Ditu and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
