﻿var app = angular.module('PetitesPoches', ["ui.router", "ui.bootstrap", "ngMaterial", 'ngAnimate', 'monospaced.mousewheel']);
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
   
    // for any unmatched url
    $urlRouterProvider.otherwise("/collection/");
   
    // https://github.com/angular-ui/ui-router/issues/372
    // http://www.yearofmoo.com/2012/11/angularjs-and-seo.html
    //$locationProvider//.hashPrefix('!')//.html5Mode(true)
    $locationProvider.html5Mode(true)

    $stateProvider.state('tabs', {
        abstract: true,
        url: '/',
        controller: "mainController"
    })
    .state('collection', {
        url: '/collection/:search',
        data: {
            'selectedTab': 0
        },
        templateUrl: "/livres.html",
        controller: "livreController"
    })
    .state('auteurs', {
        url: '/auteurs/:search',
        data: {
            'selectedTab': 1
        },
        templateUrl: "/auteurs.html",
        controller: "auteurController"
    })
    .state('contacts', {
        url: '/contacts/',
        data: {
            'selectedTab': 2
        },
        templateUrl: "/contacts.html",
        controller: "contactController"
    })


}).config(function ($mdThemingProvider) {
    $mdThemingProvider.definePalette('amazingPaletteName', {
        '50': 'E0F7FA',
        '100': 'B2EBF2',
        '200': '80DEEA',
        '300': '4DD0E1',
        '400': '26C6DA',
        '500': '26C6DA', // 
        '600': '00ACC1',
        '700': '0097A7',
        '800': '00838F',
        '900': '006064',
        'A100': '84FFFF',
        'A200': '26C6DA', // under
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
