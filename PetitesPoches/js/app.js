var app = angular.module('PetitesPoches', ['multi-select',"ui.router", "ui.bootstrap", "ngMaterial", 'ngMdIcons', 'ngAnimate', 'monospaced.mousewheel']);
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    // for any unmatched url
    //$urlRouterProvider.otherwise("/collection");

    //$locationProvider.html5Mode({
    //    enabled: true,
    //    requireBase: false
    //});
    

    $stateProvider.state('tabs', {
        abstract: true,
        url: '/tabs',
        controller: function ($scope) {
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                $scope.currentTab = toState.data.selectedTab;
            });
        }
    })
    .state('collection', {
        url: '/collection',
        data: {
            'selectedTab': 0
        },
        templateUrl: "/livres.html",
    })
    .state('auteurs', {
        url: '/auteurs',
        data: {
            'selectedTab': 1
        },
        templateUrl: "/auteurs.html",
    })


}).config(function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'E0F7FA',
        '100': 'B2EBF2',
        '200': '80DEEA',
        '300': '4DD0E1',
        '400': '26C6DA',
        '500': '00BCD4',
        '600': '00ACC1',
        '700': '0097A7',
        '800': '00838F',
        '900': '006064',
        'A100': '84FFFF',
        'A200': '18FFFF',
        'A400': '00E5FF',
        'A700': '00B8D4',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
         '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName')
     .accentPalette('amazingPaletteName')
    .backgroundPalette('amazingPaletteName')
});;
