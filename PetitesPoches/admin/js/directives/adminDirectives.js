﻿
//app.directive('ngEnter', function () {
//    return function (scope, element, attrs) {
//        element.bind("keydown keypress", function (event) {
//            if (event.which === 13) {
//                scope.$apply(function () {
//                    scope.$eval(attrs.ngEnter);
//                });

//                event.preventDefault();
//            }
//        });
//    };
//});


app.directive('prixlitteraires', function ($http, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            entityName: '='
        },
        template:
             ' <label class="control-label">Prix Litteraires</label>' +
            '<div class="tags">' +
                '<button class="btn btn-info tag" ng-repeat="(idx, tag) in item.PrixLitteraires track by $index" ng-click="remove(idx)">{{tag}}</button>' +
            '</div>' +
             '<p><input type="text" ' +
                'ng-model="new_value"' +
                'typeahead="tags.Name for tags in getData($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loading" ' +
                'typeahead-on-select="onSelect($item, $model, $label)"' +
                'class="form-control"></input></p>',
        //'<i ng-show="loading" class="glyphicon glyphicon-refresh"></i> ' +
        //'<a class="btn" ng-click="add()">Ajouter</a>'

        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            //var input = angular.element($element.children()[1]);
            var input = $($element).first("input");
            // This adds the new tag to the tags array
            $scope.add = function () {
                if (!$scope.new_value)
                    return;
                if (!$scope.item.PrixLitteraires)
                    $scope.item.PrixLitteraires = new Array();
                if ($scope.item.PrixLitteraires.indexOf($scope.new_value) == -1) {
                    $scope.item.PrixLitteraires.push($scope.new_value);
                    $scope.update();
                }
                $scope.new_value = "";
            };
            $scope.onSelect = function ($item, $model, $label) {
                $scope.add();
            };
            $scope.tags = [];
            $scope.loading = false;
            $scope.getData = function (value) {
                $scope.loading = true;
                return $http.get($rootScope.apiRootUrl + '/indexes/PrixLitteraires', {
                    params: {
                        query: "Name:" + value + "*",
                        pageSize: 10,
                        _: Date.now(),
                    }
                }).then(function (res) {
                    $scope.loading = false;
                    //var tags = [];
                    //angular.forEach(res.data.Results, function (item) {
                    //    tags.push(item.Name);
                    //});
                    return res.data.Results;
                });
            };


            // This is the ng-click handler to remove an item
            $scope.remove = function (idx) {
                $scope.item.PrixLitteraires.splice(idx, 1);
                if ($scope.item.PrixLitteraires.length == 0) {
                    delete $scope.item.PrixLitteraires
                }
                $scope.update();
            };

            $scope.update = function () {
                // put tags before to get id back  
                $http({
                    method: 'PUT',
                    headers: { 'Raven-Entity-Name': $scope.entityName },
                    url: $rootScope.apiRootUrl + '/docs/' + $scope.item.Id,
                    data: angular.toJson($scope.item)
                }).
                    success(function (data, status, headers, config) {
                    }).
                    error(function (data, status, headers, config) {

                    });
            };

            // Capture all keypresses
            input.bind('keypress', function (event) {
                // But we only care when Enter was pressed
                if (event.keyCode == 13) {
                    // There's probably a better way to handle this...
                    $scope.add();
                }
            });
        }
    };
});



app.directive('tags', function ($http, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            item: '=',
            entityName: '='
        },
        template:
             ' <label class="control-label" for="Tags">Thèmes</label>' +
            '<div class="tags">' +
                '<button class="btn btn-info tag" ng-repeat="(idx, tag) in item.Tags track by $index" ng-click="remove(idx)">{{tag}}</button>' +
            '</div>' +
             '<p><input id="Tags" type="text" ' +
                'ng-model="new_value"' +
                'typeahead="tags.Name for tags in getTags($viewValue) | filter:$viewValue" ' +
                'typeahead-loading="loading" ' +
                'typeahead-on-select="onSelect($item, $model, $label)"'+
                'class="form-control"></input></p>',
        //'<i ng-show="loading" class="glyphicon glyphicon-refresh"></i> ' +
        //'<a class="btn" ng-click="add()">Ajouter</a>'

        link: function ($scope, $element) {
            // FIXME: this is lazy and error-prone
            //var input = angular.element($element.children()[1]);
            var input =$($element).first("input");
            // This adds the new tag to the tags array
            $scope.add = function () {
                if (!$scope.new_value)
                    return;
                if (!$scope.item.Tags)
                    $scope.item.Tags = new Array();
                if ($scope.item.Tags.indexOf($scope.new_value) == -1) {
                    $scope.item.Tags.push($scope.new_value);
                    $scope.update();
                }
                $scope.new_value = "";
            };
            $scope.onSelect = function ($item, $model, $label) {
                $scope.add();
            };
            $scope.tags = [];
            $scope.loading = false;
            $scope.getTags = function (value) {
                $scope.loading = true;
                return $http.get($rootScope.apiRootUrl + '/indexes/Tags', {
                    params: {
                        query: "Name:" + value + "*",
                        pageSize: 10,
                        _: Date.now(),
                    }
                }).then(function (res) {
                    $scope.loading = false;
                    //var tags = [];
                    //angular.forEach(res.data.Results, function (item) {
                    //    tags.push(item.Name);
                    //});
                    return res.data.Results;
                });
            };


            // This is the ng-click handler to remove an item
            $scope.remove = function (idx) {
                $scope.item.Tags.splice(idx, 1);
                $scope.update();
            };

            $scope.update = function () {
                // put tags before to get id back  
                $http({
                    method: 'PUT',
                    headers: { 'Raven-Entity-Name': $scope.entityName },
                    url: $rootScope.apiRootUrl + '/docs/' + $scope.item.Id,
                    data: angular.toJson($scope.item)
                }).
                    success(function (data, status, headers, config) {
                    }).
                    error(function (data, status, headers, config) {

                    });
            };

            // Capture all keypresses
            input.bind('keypress', function (event) {
                // But we only care when Enter was pressed
                if (event.keyCode == 13) {
                    // There's probably a better way to handle this...
                   $scope.add();
                }
            });
        }
    };
});