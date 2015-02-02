var app = angular.module('PetitesPoches', ['angularFileUpload', 'pretty-checkable', "ui.router", "ui.bootstrap"]);


app.config(function ($stateProvider, $urlRouterProvider) {

   // $urlRouterProvider.otherwise("main.livres");
    
    $stateProvider
            .state("livres", { url: "/livres", templateUrl: "/admin/livres.html" })
            .state("auteurs", { url: "/auteurs", templateUrl: "/admin/auteurs.html" })
});
