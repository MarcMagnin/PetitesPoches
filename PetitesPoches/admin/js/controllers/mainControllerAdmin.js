app.controller("mainControllerAdmin", ['$scope', '$rootScope', '$http', '$timeout', '$upload', '$state', function ($scope, $rootScope, $http, $timeout, $upload, $state) {
    $rootScope.apiRootUrl = "http://localhost:8088/databases/PetitesPoches";

    $scope.tabs = [
        { heading: "Livres", route: "livres", active: true },
        { heading: "Auteurs", route: "auteurs", active: false },
    ];

    $scope.go = function (route) {
        $state.go(route);
    };

    $scope.active = function (route) {
        return $state.is(route);
    };

    $scope.$on("$stateChangeSuccess", function () {
        $scope.tabs.forEach(function (tab) {
            tab.active = $scope.active(tab.route);
        });
    });
}]);