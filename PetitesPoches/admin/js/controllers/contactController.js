app.controller("contactController", function ($scope, $rootScope, $http, contactService) {
    $scope.items = "";
    $scope.init = function () {
        contactService.getContacts()
            .then(function (contact) {
                $scope.items = contact
            })
    };

    $scope.$watch('items.Value', function () {
        $scope.saveItem($scope.items)
    });

    $scope.saveItem = function (item) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'contact' },
            url: $rootScope.apiRootUrl + '/docs/contact'  ,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {
            ////
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }
});