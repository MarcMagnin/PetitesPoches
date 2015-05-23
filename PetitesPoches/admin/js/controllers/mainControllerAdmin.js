app.controller("mainControllerAdmin", ['$scope', '$rootScope', '$http', '$timeout', '$state', function ($scope, $rootScope, $http, $timeout, $state) {
//$rootScope.apiRootUrl = "http://62.23.104.30:8181/databases/PetitesPoches";
    $rootScope.apiRootUrl = "http://localhost:8086/databases/PetitesPoches";

    $scope.tabs = [
        { heading: "Livres", route: "livres", active: true },
        { heading: "Auteurs", route: "auteurs", active: false },
        { heading: "Contacts", route: "contacts", active: false },
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


app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, selectedItem, parentScope) {
    $scope.$parent = parentScope;
    $scope.selectedItem = selectedItem;


    $scope.ok = function () {
        $modalInstance.close($scope.selectedItem);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
