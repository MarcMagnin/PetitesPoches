app.controller("mainControllerAdmin", ['$scope', '$rootScope', '$http', '$timeout', '$upload', '$state', function ($scope, $rootScope, $http, $timeout, $upload, $state) {
    $rootScope.apiRootUrl = "http://localhost:8086/databases/PetitesPoches";

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


    $scope.add = function (item, $scope) {
        return $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
            data: angular.toJson(item)
        });
    };
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
