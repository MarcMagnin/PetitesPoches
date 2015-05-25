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


app.controller("auteurController", ['$scope', '$rootScope', '$http', '$filter', '$upload', '$state', '$modal', 'auteurService', function ($scope, $rootScope, $http, $filter, $upload, $state, $modal, auteurService) {
    $scope.entityName = "Auteur"
    $scope.itemsPool = [];
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.container = $('.tilesContainer');
    $scope.menuShown = true;
   // $scope.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    $scope.searchPattern = "*";
  
    $scope.userLeft = false;

    // permet de verifier si l'utilisateur s'en va pour annuler toutes les taches 
    $scope.$on("tabChanged", function (event, args) {
        $scope.userLeft = true;
    })

    $scope.init = function () {
        itemAdded = 0;
       

        auteurService.getAuteurs()
          .then(function (auteurs) {
              $scope.itemsPool = auteurs;
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

                var $container = $('#Container');
                if ($container.mixItUp('isLoaded')) {
                    $container.mixItUp('destroy')
                }
                delayLoop(auteurs, 0, 0, function (item) {
                    if ($scope.userLeft) {
                        // abort the delayed process
                        auteurs.length = 0;
                    }

                    item.Id = item['@metadata']['@id'];
                    item.filter = "";

                    if (item.Nom) {
                        item.filter += item.Nom.split(" ").map(function (val) {
                            return 'f-' + cleanString(val);
                        }).join(' ');
                    }
                    if (item.Prenom) {
                        item.filter += " " + item.Prenom.split(" ").map(function (val) {
                            return 'f-' + cleanString(val);
                        }).join(' ');
                    }

                    $scope.items.push(item);
                    if ($scope.items.length == 23) {
                        $scope.$apply();
                        if (!$container.mixItUp('isLoaded')) {
                            $container.mixItUp({ animation: { enable: enableAnimation } });
                        }
                    }

                    if ($scope.items.length % 30 == 0) {
                        $scope.$apply();
                        if ($container.mixItUp('isLoaded')) {
                            $container.mixItUp('filter', $scope.searchPattern);
                        }
                    }


                    if ($scope.items.length == auteurs.length) {

                        $scope.$apply();
                        $scope.dataReady = true;
                        $container.mixItUp('filter', $scope.searchPattern);
                    }

                });
               // $scope.AZArray = $filter('orderByDisplayOrder')($scope.items);


            })

    };

   
    var filter = function () {
        if (!$('#Container').mixItUp('isLoaded')) {
            return;
        }
        if ($('#Container').mixItUp('isMixing')) {
            setTimeout(function () {
                filter();
            }, 200);
        } else {
            var state = $('#Container').mixItUp('getState');
            if (state.activeFilter != $scope.searchPattern) {
                $('#Container').mixItUp('filter', $scope.searchPattern);
            } else {
                // skip filter
            }
        }
    }

    

    $scope.filterByLetter = function (item) {
        $scope.searchPattern = '[class*=\'filter-' + item.toLowerCase() + '\']';
        filter();


    }
    $scope.unFilter = function (item) {
        $scope.searchPattern = "*"
        filter();
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
                  $scope.sort();


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
            $scope.sort();
            
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }

    $scope.sort = function () {
        $("#Container").mixItUp('sort', 'nom:asc');
    }
}]);