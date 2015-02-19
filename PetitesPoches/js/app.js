var app = angular.module('PetitesPoches', ['multi-select', "ui.router", "ui.bootstrap"]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
            .state("livres", { url: "/livres", templateUrl: "/livres.html" })
            .state("auteurs", { url: "/auteurs", templateUrl: "/auteurs.html" })
});
