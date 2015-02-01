﻿
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




app.controller("auteurController", ['$scope', '$rootScope', '$http', '$upload', '$state', function ($scope, $rootScope, $http, $upload, $state) {
    $rootScope.apiRootUrl = "http://localhost:8086/databases/PetitesPoches";
    $scope.entityName = "Auteur"
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";


    $scope.init = function () {
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/' + $scope.entityName + '?start=0&pageSize=200&sort=-Nom' }).
            success(function (data, status, headers, config) {

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
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };


    $scope.select = function (item) {
        $scope.selectedItem = item;
    }
    $scope.add = function () {
        var item = new Auteur;
        return $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {
            item.Id = data.Key;
            item.new = true;
            $scope.items.unshift(item);
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
        var imageUrl = 'static/' + item.Id + '/' + fileName;
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


    $scope.addImageToLivre = function (fileName, item) {
        var couvertureUrl = 'static/' + item.Id + '/' + fileName;
        var update = new Update();
        update.Type = 'Set';
        update.Name = 'Couverture';
        update.Value = couvertureUrl;


        $http({
            method: 'PATCH',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(new Array(update))
        }).
            success(function (data, status, headers, config) {
                item.Couverture = couvertureUrl;
            }).
            error(function (data, status, headers, config) {

            });

        //}).
        //error(function (data, status, headers, config) {

        //});
    };

    $scope.delete = function ($index, item) {
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
              $scope.items.splice($index, 1);
              setTimeout(function () {
                  $container.isotope('reLayout');
              }, 100);
          }).
          error(function (data, status, headers, config) {
              console.log(data);
          });
    }

    $scope.save = function (item) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {

        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }


}]);