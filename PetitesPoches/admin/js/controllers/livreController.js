﻿
var Livre = function () {
    this.Index = 0;
    this.Titre = "";
    this.Couverture = "";
    this.Auteur = {
        Nom: "",
        Prenom:""
    };
    this.Prix = "";
    this.ISBN = "";
    this.EBookUrl = "";
    this.NiveauLecture = "";
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



app.controller("livreController", ['$scope', '$rootScope', '$http', '$timeout', '$upload', '$state', '$modal', function ($scope, $rootScope, $http, $timeout, $upload, $state, $modal) {
    
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.searchedAuteur = "";
    $scope.entityName = "Livre";
    $scope.searchedText = "";
    $scope.whiteSpacePattern = '/ /g'
    $scope.searchTimeout;
    $scope.checkboxPrixLitteraire;
    $scope.container = $('.tilesContainer');
    $scope.niveauLecture = '';
    $scope.themeMultiselectSettings = { displayProp: 'Name', idProp: 'Name' };
    $scope.themeMultiselectmodel = [];

    $scope.init = function () {
        itemAdded = 0;
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Livres?start=0&pageSize=200&sort=-Index&_=' + Date.now() }).
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
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Tags?pageSize=30&sort=Name&noCache=1015157938&_=' + Date.now() }).
            success(function (data, status, headers, config) {
                $scope.tags = data.Results;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });

    };


    $scope.select = function (item, size, $event) {
        $scope.selectedItem = item;
      //  $($event.target).parent().css({ width: '200px' });
       // $scope.container.isotope('reLayout');
        // prevent the modal to show if we click on a nested link
        if (!$($event.target).closest('a').length) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    selectedItem: function () {
                        return $scope.selectedItem;
                    },
                    parentScope: function () {
                        return $scope;
                    },
                }
            });

            modalInstance.result.then(function (selectedItem) {
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

            }, function () {
                //   $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }
    $scope.addFile = function ($files, $event, field) {
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
                    // mise à jour de l'item
                    var update = new Update();
                    update.Type = 'Set';
                    update.Name = field;
                    update.Value = file.name;

                    $http({
                        method: 'PATCH',
                        headers: { 'Raven-Entity-Name': $scope.entityName },
                        url: $rootScope.apiRootUrl + '/docs/' + $scope.selectedItem.Id,
                        data: angular.toJson(new Array(update))
                    }).
                        success(function (data, status, headers, config) {
                            $scope.selectedItem[field] = file.name;
                        }).
                        error(function (data, status, headers, config) {

                        });


                }).error(function (err) {
                    alert('Error occured during upload');
                });
        }
        fileReader.readAsArrayBuffer(file);
    };



    $scope.addLivre = function ($files, $event, $rejectedFiles) {
        var file = $files[0];
        // get the last index of items 
        $http({
            method: 'GET',
            url: $rootScope.apiRootUrl + '/indexes/CountLivres?start=0&_=' + Date.now(),
        }).success(function (data, status, headers, config) {
            // add the new item with the last index :
            var livre = new Livre;
            livre.datePublication = moment().format();
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


    $scope.cancel = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.add = function (size) {
        var item = new Livre;
        item.datePublication = moment().format();
        $scope.selectedItem = item;
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                selectedItem: function () {
                    return $scope.selectedItem;
                },
                parentScope: function () {
                    return $scope;
                },
            }
        });

        modalInstance.result.then(function (selectedItem) {
            return $http({
                method: 'PUT',
                headers: { 'Raven-Entity-Name': $scope.entityName },
                url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
                data: angular.toJson($scope.selectedItem)
            }).
               success(function (data, status, headers, config) {
                   item.Id = data.Key;
                   item.new = true;
                   $scope.items.unshift(item);

               }).
               error(function (data, status, headers, config) {
                   console.log(data);
               });


        }, function () {
         //   $log.info('Modal dismissed at: ' + new Date());
        });

        //var test = $("#responsive").modal('show');
        //$('#responsive').on('show.bs.modal', function (e) {
        //    alert('modal show');
        //});
        //$("#responsive").modal('show').result.then(function () {
        //    alert("test");
       
        //});

    
    }
    $scope.deleteLivre = function ($index, item, $event) {
        $event.stopPropagation();
        $event.stopImmediatePropagation();

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

    $scope.searchSuggestionsValue;
    $scope.searchLivreSuggestions = function (value) {
        $scope.searchSuggestionsValue = value;
        $scope.loadingSearchSuggestions = true;
        return $http({
            method: 'GET',
            url: $rootScope.apiRootUrl + '/indexes/LivreSearchSuggestions',
            params: {
                query: "Titre:" + value + "* OR Nom:" + value + "* OR Prenom:" + value + "*",
                //resultsTransformer: "AuteurSearchTransform",
                pageSize: 10
            }
        }).then(function (res) {
            $scope.loadingSearchSuggestions = false;
            res.data.Results.forEach(function (item) {
                item.imageUrl = $scope.apiRootUrl + "/" + item.Couverture;
            });
            return res.data.Results;
        });
    }
    $scope.validateSearchFromLivre = function ($item, $model, $label) {
        if ($item.Auteur && $item.Auteur.Nom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1 || $item.Auteur.Prenom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1) {
            $scope.searchedText = $item.Auteur.Prenom + " " + $item.Auteur.Nom;
        }
    }


    $scope.validateFilter = function () {
        var searchPattern = ($scope.searchPatternEBook ? $scope.searchPatternEBook : '')
        + ($scope.searchPatternPrixLitteraires ? $scope.searchPatternPrixLitteraires : '')
        + ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')
        + ($scope.filterPatternNiveauLecture ? $scope.filterPatternNiveauLecture : '')
        + ($scope.searchPatternTheme ? $scope.searchPatternTheme : '');
        $scope.container.isotope({ filter: searchPattern });
    }

    $scope.filtreNiveauLecture = function () {
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.fil-' + $scope.niveauLecture : ''
        $scope.validateFilter();
    }


    $scope.searchEBook = function () {
        $scope.searchPatternEBook = $scope.checkboxSearchEBook ? '.fil-ebook' : '';
        $scope.validateFilter();
    }

    $scope.searchPrixLitteraires = function () {
        $scope.searchPatternPrixLitteraires = $scope.checkboxPrixLitteraire ? '.fil-prix' : '';
        $scope.validateFilter();
    }
    $scope.filtreThemes = function () {
        $scope.searchPatternTheme =   $scope.themeMultiselectmodel.map(function (val) {
            return '.f-' + val.Name.toLowerCase().replace(/ /g, '');
        }).join('');
        $scope.validateFilter();
    }

    

    $scope.validateSearch = function (keyEvent) {
        if ($scope.searchTimeout) {
            clearTimeout($scope.searchTimeout);
        }

        $scope.searchTimeout = setTimeout(function () {
            var searchPattern;
            if ($scope.searchedText.Titre) {
                $scope.searchPatternRecherche = '[class*=\'fil-' + $scope.searchedText.Titre.toLowerCase().replace(/ /g, '') + '\']';
            } else {
                $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                    return '[class*=\'fil-' + val.toLowerCase() + '\']';
                }).join(',');
            }

            $scope.validateFilter();
        }, 300);
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


    $scope.clear = function () {
        $scope.selectedItem.datePublication = null;
    };

    $scope.toggleMin = function () {
        $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'dd/MM/yyyy', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.sort = function () {
        $scope.container.isotope({ 
            sortBy: 'date',
            sortAscending : false
        });
    }
}]);