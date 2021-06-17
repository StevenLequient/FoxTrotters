(function () {
  'use strict';

  describe('Themes Route Tests', function () {
    // Initialize global variables
    var $scope,
      ThemesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ThemesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ThemesService = _ThemesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('themes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/themes');
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
          ThemesController,
          mockTheme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('themes.view');
          $templateCache.put('modules/themes/client/views/view-theme.client.view.html', '');

          // create mock Theme
          mockTheme = new ThemesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Theme Name'
          });

          // Initialize Controller
          ThemesController = $controller('ThemesController as vm', {
            $scope: $scope,
            themeResolve: mockTheme
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:themeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.themeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            themeId: 1
          })).toEqual('/themes/1');
        }));

        it('should attach an Theme to the controller scope', function () {
          expect($scope.vm.theme._id).toBe(mockTheme._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/themes/client/views/view-theme.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ThemesController,
          mockTheme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('themes.create');
          $templateCache.put('modules/themes/client/views/form-theme.client.view.html', '');

          // create mock Theme
          mockTheme = new ThemesService();

          // Initialize Controller
          ThemesController = $controller('ThemesController as vm', {
            $scope: $scope,
            themeResolve: mockTheme
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.themeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/themes/create');
        }));

        it('should attach an Theme to the controller scope', function () {
          expect($scope.vm.theme._id).toBe(mockTheme._id);
          expect($scope.vm.theme._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/themes/client/views/form-theme.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ThemesController,
          mockTheme;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('themes.edit');
          $templateCache.put('modules/themes/client/views/form-theme.client.view.html', '');

          // create mock Theme
          mockTheme = new ThemesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Theme Name'
          });

          // Initialize Controller
          ThemesController = $controller('ThemesController as vm', {
            $scope: $scope,
            themeResolve: mockTheme
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:themeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.themeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            themeId: 1
          })).toEqual('/themes/1/edit');
        }));

        it('should attach an Theme to the controller scope', function () {
          expect($scope.vm.theme._id).toBe(mockTheme._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/themes/client/views/form-theme.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
