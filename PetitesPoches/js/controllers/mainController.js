app.controller("mainController", function ($scope, $rootScope, $http, $timeout, $state) {
    $rootScope.apiRootUrl = "http://62.23.104.30:8181/databases/PetitesPoches";
   // $rootScope.apiRootUrl = "http://localhost:8088/databases/PetitesPoches";

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $scope.currentTab = toState.data.selectedTab;
    });

});

app.controller('ModalInstanceCtrl', function ($scope, $mdDialog, selectedItem, parentScope) {
    // Assigned from construction <code>locals</code> options...
    $scope.parentScope = parentScope;
    $scope.selectedItem = selectedItem;

    $scope.closeDialog = function () {
        // Easily hides most recent dialog shown...
        // no specific instance reference is needed.
        $mdDialog.hide();
    };

    $scope.modalMouseWheel = function (event) {
        event.stopPropagation();
    }

});

angular.$externalBroadcast = function (selector, event, message) {
    $rootscope.$broadcast(event, message);
};