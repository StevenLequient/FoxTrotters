(function () {
  'use strict';

  describe('Themes Controller Tests', function () {
    // Initialize global variables
    var ThemesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ThemesService,
      mockTheme;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ThemesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ThemesService = _ThemesService_;

      // create mock Theme
      mockTheme = new ThemesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Theme Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Themes controller.
      ThemesController = $controller('ThemesController as vm', {
        $scope: $scope,
        themeResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleThemePostData;

      beforeEach(function () {
        // Create a sample Theme object
        sampleThemePostData = new ThemesService({
          name: 'Theme Name'
        });

        $scope.vm.theme = sampleThemePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ThemesService) {
        // Set POST response
        $httpBackend.expectPOST('api/themes', sampleThemePostData).respond(mockTheme);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Theme was created
        expect($state.go).toHaveBeenCalledWith('themes.view', {
          themeId: mockTheme._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/themes', sampleThemePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Theme in $scope
        $scope.vm.theme = mockTheme;
      });

      it('should update a valid Theme', inject(function (ThemesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/themes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('themes.view', {
          themeId: mockTheme._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ThemesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/themes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Themes
        $scope.vm.theme = mockTheme;
      });

      it('should delete the Theme and redirect to Themes', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/themes\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('themes.list');
      });

      it('should should not delete the Theme and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
