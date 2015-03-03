app.controller("mainController", function ($scope, $rootScope, $http, $timeout, $state) {
    $rootScope.apiRootUrl = "http://localhost:8088/databases/PetitesPoches";

    $scope.tabs = [
        { heading: "Collection", route: "collection", active: true },
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
            if (tab.active) {
                $('.' + tab.heading).addClass('active');
            } else {
                $('.' + tab.heading).removeClass('active');
            }
        });
    });
});


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

angular.$externalBroadcast = function (selector, event, message) {
    $rootscope.$broadcast(event, message);
};