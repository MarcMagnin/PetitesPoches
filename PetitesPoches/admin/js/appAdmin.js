﻿var app = angular.module('PetitesPoches', ['angularFileUpload', 'multi-select', 'pretty-checkable', "ui.router", "ui.bootstrap"]);


app.config(function ($stateProvider, $urlRouterProvider) {

   // $urlRouterProvider.otherwise("main.livres");
    
    $stateProvider
            .state("livres", { url: "/livres", templateUrl: "/admin/livres.html" })
            .state("auteurs", { url: "/auteurs", templateUrl: "/admin/auteurs.html" })
            .state("contacts", { url: "/contacts", templateUrl: "/admin/contacts.html", controller:"contactController" });
});
