app.controller("mainController", function ($scope, $rootScope, $http, $timeout, $state) {
    $rootScope.apiRootUrl = "http://localhost:8088/databases/PetitesPoches";

    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        console.log("tesdsfdsfsdfzefezfvzfaft" + toState.data.selectedTab)
        $scope.currentTab = toState.data.selectedTab;
    });

    //$scope.tabs = [
    //    { heading: "Collection", route: "collection", active: true },
    //    { heading: "Auteurs", route: "auteurs", active: false },
    //];

    //$scope.go = function (route) {
    //    $state.go(route);
    //};

    //$scope.active = function (route) {
    //    return $state.is(route);
    //};

    //$rootScope.$on('goToCollection', function (event, args) {
    //    if (args) {
    //        $state.go("collection",{ auteur :args});
    //      //  $timeout(function () { $rootScope.$broadcast('FilterAvecAuteur', args) }, 500);
            
    //    }
    //});

    //$scope.$on("$stateChangeSuccess", function () {
    //    $scope.tabs.forEach(function (tab) {
    //        tab.active = $scope.active(tab.route);
    //        if (tab.active) {
    //            $('.' + tab.heading).addClass('active');
    //        } else {
    //            $('.' + tab.heading).removeClass('active');
    //        }
    //    });
    //});
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
//app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, selectedItem, parentScope) {
//    $scope.$parent = parentScope;
//    $scope.selectedItem = selectedItem;


//    $scope.ok = function () {
//        $modalInstance.close($scope.selectedItem);
//    };

//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };
//});

angular.$externalBroadcast = function (selector, event, message) {
    $rootscope.$broadcast(event, message);
};