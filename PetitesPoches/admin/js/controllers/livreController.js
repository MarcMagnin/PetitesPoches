
var Livre = function () {
    this.Index = 0;
    this.Titre = "";
    this.Couverture = "";
    this.Auteur = "";
    this.Prix = "";
    this.ISBN = "";
    this.EBookUrl = "";
    this.NiveauLecture = "premiersPas";
    this.PrixLitteraire = "";
    this.FichePedago = "";
    this.Extrait = "";
    this.SiteMarchand = "";
    this.LienVideo = "";
};


var Update = function () {
    this.Type = "";
    this.Name = "";
};




app.controller("livreController", ['$scope', '$rootScope', '$http', '$timeout', '$upload', '$state', function ($scope, $rootScope, $http, $timeout, $upload, $state) {
    $rootScope.apiRootUrl = "http://localhost:8086/databases/PetitesPoches";
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.searchedAuteur = "";


    $scope.init = function () {
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Livres?start=0&pageSize=200&sort=-Index' }).
            success(function (data, status, headers, config) {

                for (var i = 0; i < 100; i++) {
                    var livre = new Livre();
                    livre['@metadata'] ="";
                    livre['@metadata']['@id'] = 0;
                    data.Results.push(livre);
                }

                //delayLoop(data.Results, 0, function (item) {
                //    item.Id = item['@metadata']['@id'];
                //    $scope.items.push(item);
                //    $scope.$apply();
                //});



                angular.forEach(data.Results, function (item, index) {
                    item.Id = item['@metadata']['@id'];
                    $scope.items.push(item);
                });
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

        // Load tags
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Tags?pageSize=30&sort=Name&noCache=1015157938' }).
            success(function (data, status, headers, config) {



            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };


    $scope.select = function (item) {
        $scope.selectedItem = item;
    }

    $scope.addLivre = function ($files, $event, $rejectedFiles) {
        var file = $files[0];
        // get the last index of items 
        $http({
            method: 'GET',
            url: $rootScope.apiRootUrl + '/indexes/CountLivres?start=0&_=' + Date.now(),
        }).success(function (data, status, headers, config) {
            // add the new item with the last index :
            var livre = new Livre;
            if (data.Results[0])
                livre.Index = ++data.Results[0].Count;
            else
                livre.Index = 1;
            $http({
                method: 'PUT',
                headers: { 'Raven-Entity-Name': 'Livre' },
                url: $rootScope.apiRootUrl + '/docs/Livre%2F',
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
            headers: { 'Raven-Entity-Name': 'Livre' },
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

    $scope.deleteLivre = function ($index, item) {

        if (item.Couverture) {
            $http({
                method: 'DELETE',
                url: $rootScope.apiRootUrl + '/' + item.Couverture
            }).
              success(function (data, status, headers, config) {
              }).
              error(function (data, status, headers, config) {
                  console.log(data);
              });
        }
        $http({
            method: 'DELETE',
            headers: { 'Raven-Entity-Name': 'Livre' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
        }).
          success(function (data, status, headers, config) {
              $scope.items.splice($index, 1);
              setTimeout(function () {
                  $container.isotope('reLayout');
              }, 100);

              // decrement index of items with higher index
              angular.forEach($scope.items, function (itemWithHigherIndex, index) {

                  if (itemWithHigherIndex.Index > item.Index) {
                      itemWithHigherIndex.Index = --itemWithHigherIndex.Index;
                  }

                  $http({
                      method: 'PUT',
                      headers: { 'Raven-Entity-Name': 'Livre' },
                      url: $rootScope.apiRootUrl + '/docs/' + itemWithHigherIndex.Id,
                      data: angular.toJson(itemWithHigherIndex)
                  }).
                   success(function (data, status, headers, config) {

                   }).
                   error(function (data, status, headers, config) {
                       console.log(data);
                   });
              });
          }).
          error(function (data, status, headers, config) {
              console.log(data);
          });
    }


    $scope.searchAuteurSuggestions = function (value) {
        $scope.loadingSearchSuggestions = true;
        return   $http({
            method: 'GET', 
            url: $rootScope.apiRootUrl + '/indexes/AuteurSearchSuggestion',
            params: {
                query: "Nom:" + value + "* OR Prenom:" + value + "*",
                resultsTransformer: "AuteurSearchTransform",
                pageSize: 10
            }
        }).then(function (res) {
            $scope.loadingSearchSuggestions = false;
            //var tags = [];
            //angular.forEach(res.data.Results, function (item) {
            //    tags.push(item.Name);
            //});
            return res.data.Results;
        });
    };

    $scope.saveItem = function (item) {
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Livre' },
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