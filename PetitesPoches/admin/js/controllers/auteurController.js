var Auteur = function () {
    this.Nom = "";
    this.Prenom = "";
    this.Photo = "";
    this.LienBiblio = "";
};

var Update = function () {
    this.Type = "";
    this.Name = "";
};


app.controller("auteurController", ['$scope', '$rootScope', '$http', '$filter', '$upload', '$state', '$modal', function ($scope, $rootScope, $http,$filter, $upload, $state, $modal) {
    $scope.entityName = "Auteur"
    $scope.itemsPool = [];
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.container = $('.tilesContainer');
    $scope.menuShown = true;
   // $scope.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  


    $scope.init = function () {
        itemAdded = 0;
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/' + $scope.entityName + '?start=0&pageSize=200&sort=-Nom&_=' + Date.now() }).
            success(function (data, status, headers, config) {
                $scope.itemsPool = data.Results;
                //for (var i = 0; i < 100; i++) {
                //    var livre = new Livre();
                //    livre['@metadata'] ="";
                //    livre['@metadata']['@id'] = 0;
                //    data.Results.push(livre);
                //}

                //delayLoop(data.Results, 0, function (item) {
                //    item.Id = item['@metadata']['@id'];
                //    $scope.items.push(item);
                //    $scope.$apply();
                //});

                angular.forEach(data.Results, function (item, index) {
                    item.Id = item['@metadata']['@id'];
                    $scope.items.unshift(item);
                });
               // $scope.AZArray = $filter('orderByDisplayOrder')($scope.items);


            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };

    
    $scope.filterByLetter = function (item) {
        var $container = $('.tilesContainer');
        var test = '[class*=\'filter-' + item.toLowerCase() + '\']';
        $container.isotope({ filter: test });
    }
    $scope.unFilter = function (item) {
        $container.isotope({ filter: '*' });
    }

    $scope.select = function (item, $event) {
        $scope.selectedItem = item;
        //  $($event.target).parent().css({ width: '200px' });
        // $scope.container.isotope('reLayout');
        // prevent the modal to show if we click on a nested link
        if (!$($event.target).closest('a').length) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                //size: 'lg',
                resolve: {
                    selectedItem: function () {
                        return $scope.selectedItem;
                    },
                    parentScope: function () {
                        return $scope;
                    },
                }
            });

            modalInstance.result.then(function () {
                $scope.save($scope.selectedItem);
            }, function () {
                //   $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }


    $scope.add = function () {
        var item = new Auteur;
        $scope.selectedItem = item;
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
            data: angular.toJson(item)
        }).success(function (data, status, headers, config) {
            item.Id = data.Key;
            item.new = true;

            $scope.itemsPool.unshift(item);
            $scope.items.unshift(item);

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                //size: size,
                resolve: {
                    selectedItem: function () {
                        return $scope.selectedItem;
                    },
                    parentScope: function () {
                        return $scope;
                    },
                }
            });

            modalInstance.result.then(function () {
                $scope.save($scope.selectedItem);
            }, function () {
                // delete on dismiss
                $scope.delete($scope.selectedItem);
            });
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }


    $scope.updatePhoto = function ($files, $event) {
        var file = $files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            $scope.upload =
                $upload.http({
                    url: $rootScope.apiRootUrl + '/static/' + $scope.selectedItem.Id + '/' + file.name,
                    method: "PUT",
                    headers: { 'Content-Type': file.type },
                    data: e.target.result
                }).progress(function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    //   $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    // mise à jour du livre avec l'URI de l'image
                    $scope.addPhotoToAuteur(file.name, $scope.selectedItem);

                }).error(function (err) {
                    alert('Error occured during upload');
                });
        }
        fileReader.readAsArrayBuffer(file);

    };
    $scope.addPhotoToAuteur = function (fileName, item) {
        var imageUrl = $rootScope.apiRootUrl +'/static/' + item.Id + '/' + fileName;
        var update = new Update();
        update.Type = 'Set';
        update.Name = 'Photo';
        update.Value = imageUrl;


        $http({
            method: 'PATCH',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(new Array(update))
        }).
            success(function (data, status, headers, config) {
                item.Photo = imageUrl;
            }).
            error(function (data, status, headers, config) {

            });

        //}).
        //error(function (data, status, headers, config) {

        //});
    };

    $scope.addDragAndDrop = function ($files, $event, $rejectedFiles) {
        var file = $files[0];
        // add the new item with the last index :
        var item = new Auteur;
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
            data: angular.toJson(livre)
        }).
            success(function (data, status, headers, config) {
                livre.Id = data.Key;
                livre.new = true;
                $scope.items.push(livre);
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    $scope.upload =
                        $upload.http({
                            url: $rootScope.apiRootUrl + '/static/' + livre.Id + '/' + file.name,
                            method: "PUT",
                            headers: { 'Content-Type': file.type },
                            data: e.target.result
                        }).progress(function (evt) {
                            // Math.min is to fix IE which reports 200% sometimes
                            //   $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                        }).success(function (data, status, headers, config) {
                            // mise à jour du livre avec l'URI de l'image
                            $scope.addImageToLivre(file.name, livre);

                        }).error(function (err) {
                            alert('Error occured during upload');
                        });
                }
                fileReader.readAsArrayBuffer(file);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };

    $scope.delete = function (item, $event) {
        if ($event) {
            $event.stopPropagation();
            $event.stopImmediatePropagation();
        }

        if (item.Photo) {
            $http({
                method: 'DELETE',
                url: $rootScope.apiRootUrl + '/' + item.Photo
            }).
              success(function (data, status, headers, config) {
              }).
              error(function (data, status, headers, config) {
                  console.log(data);
              });
        }
        $http({
            method: 'DELETE',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
        }).
          success(function (data, status, headers, config) {
              $scope.items.splice($scope.items.indexOf(item), 1);
              setTimeout(function () {
                  $scope.container.isotope('reLayout');
              }, 100);
          }).
          error(function (data, status, headers, config) {
              console.log(data);
          });
    }

    $scope.save = function (item) {
        delete item.new;
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {
            $scope.container.isotope('updateSortData', $scope.container.find(".isotopey"))
            $scope.container.isotope({sortBy: 'nom'});
            
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.sort = function () {
        console.log("sort");
        $scope.container.isotope('updateSortData', $scope.container.find(".isotopey"))
        $scope.container.isotope({
            sortBy: 'nom',
        });
    }
}]);