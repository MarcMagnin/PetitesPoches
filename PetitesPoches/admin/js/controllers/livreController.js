
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
    this.LienIssu =""
};


var Update = function () {
    this.Type = "";
    this.Name = "";
};




app.controller("livreController", ['$scope', '$rootScope', '$http', '$timeout', '$upload', '$state', '$modal', '$q', '$filter', 'livreService', function ($scope, $rootScope, $http, $timeout, $upload, $state, $modal, $q, $filter, livreService) {
    $scope.itemsPool = [];
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
    $scope.menuShown = true;

    $scope.init = function () {
        itemAdded = 0;
        livreService.getLivres()
            .then(function (livres) {
                $scope.itemsPool = livres;

                angular.forEach(livres, function (item, index) {
                    item.Id = item['@metadata']['@id'];

                    item.filter = item.Titre.split(" ").map(function (val) {
                        return 'fil-' + cleanString(val);
                    }).join(' ');

                    if (item.Auteur.Nom) {
                        item.filter += " fil-" + item.Auteur.Nom.split(" ").map(function (val) {
                            return 'fil-' + cleanString(val);
                        }).join(' ');
                    }
                    if (item.Auteur.Prenom) {
                        item.filter += " fil-" + item.Auteur.Prenom.split(" ").map(function (val) {
                            return 'fil-' + cleanString(val);
                        }).join(' ');
                    }

                    if (item.PrixLitteraires)
                        item.filter += " f-prix";
                    
                    if (item.EBookUrl)
                        item.filter += " f-ebook";

                    if (item.FichePedago)
                        item.filter += " f-pedago";

                    if (item.NiveauLecture)
                        item.filter += " f-" + item.NiveauLecture;

                    if (item.Tags)
                        item.filter += " " + $filter('filterString')(item.Tags);


                    $scope.items.push(item);
                });
             
            })


        // Load tags
        $http({ method: 'GET', url: $rootScope.apiRootUrl + '/indexes/Tags?pageSize=200&sort=Name&noCache=1015157938&_=' + Date.now() }).
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
         
        
            modalInstance.result.then(function () {
                $scope.saveItem($scope.selectedItem);
            }, function () {
                //   $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }

    $scope.saveItem = function (item) {
        delete item.new;
        var filter = item.filter;
        delete item.filter;
        $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': 'Livre' },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(item)
        }).
        success(function (data, status, headers, config) {
            item.filter = filter;
            $scope.container.isotope('updateSortData', $scope.container.find(".isotopey"))
            $scope.container.isotope({ sortBy: 'date' });
        }).
        error(function (data, status, headers, config) {
            item.filter = filter;
            console.log(data);
        });
    }

    $scope.tryRemoveAttachment = function (item, field) {
        if (item[field]) {
            $http({
                method: 'DELETE',
                url: $rootScope.apiRootUrl + '/' + item[field]
            }).
              success(function (data, status, headers, config) {
              }).
              error(function (data, status, headers, config) {
                  console.log(data);
              });
        }
    }
    $scope.addFile = function ($files, $event, field) {
        var item = $scope.selectedItem;
        // clear up the previous attachment if it exist
        $scope.tryRemoveAttachment(item, field);

        var file = $files[0];
        var fileReader = new FileReader();
       
        fileReader.onload = function (e) {
            $scope.upload =
                $upload.http({
                    url: $rootScope.apiRootUrl + '/static/' + item.Id + '/' + file.name,
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
                        url: $rootScope.apiRootUrl + '/docs/' + item.Id,
                        data: angular.toJson(new Array(update))
                    }).
                    success(function (data, status, headers, config) {
                        item[field] = file.name;
                    }).
                    error(function (data, status, headers, config) {
                        console.log(data);
                    });
                }).error(function (err) {
                    alert('Error occured during upload');
                });
        }
        fileReader.readAsArrayBuffer(file);
    };



    $scope.updateAttachment = function ($files, $event, fieldName) {
        var item = $scope.selectedItem;
        $scope.tryRemoveAttachment(item, fieldName);

        var file = $files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            $scope.upload =
                $upload.http({
                    url: $rootScope.apiRootUrl + '/static/' + item.Id + '/' + file.name,
                    method: "PUT",
                    headers: { 'Content-Type': file.type },
                    data: e.target.result
                }).progress(function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    //   $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    // mise à jour du livre avec l'URI de l'image
                    $scope.setAttachment(file.name, item, fieldName);

                }).error(function (err) {
                    alert('Error occured during upload');
                });
        }
        fileReader.readAsArrayBuffer(file);

    };

    $scope.setAttachment = function (fileName, item, fieldName) {

        var attachmentUrl = 'static/' + item.Id + '/' + fileName;
        var update = new Update();
        update.Type = 'Set';
        update.Name = fieldName;
        update.Value = attachmentUrl;
        $http({
            method: 'PATCH',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + item.Id,
            data: angular.toJson(new Array(update))
        }).
            success(function (data, status, headers, config) {
                item[fieldName] = attachmentUrl;
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    };


    $scope.addLivre = function (livre) {
        return $http({
            method: 'PUT',
            headers: { 'Raven-Entity-Name': $scope.entityName },
            url: $rootScope.apiRootUrl + '/docs/' + $scope.entityName + '%2F',
            data: angular.toJson(livre)
        });
    }

    $scope.addLivreByDragAndDrop = function ($files, $event, $rejectedFiles) {
        var prom = [];
        angular.forEach($files, function (file, key) {
            var livre = new Livre;
            livre.datePublication = moment().format();
            var defer = $q.defer();
            prom.push(defer.promise);
            $scope.addLivre(livre).success(function (data, status, headers, config) {
                livre.Id = data.Key;
                $scope.itemsPool.push(livre);
                $scope.items.push(livre);
                defer.resolve();
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
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
                        $scope.setAttachment(file.name, livre, 'Couverture');

                    }).error(function (err) {
                        alert('Error occured during upload');
                    });
                }
                fileReader.readAsArrayBuffer(file);
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
        });
        $q.all(prom).finally(function () {
            $scope.sort();
        });
       
    };

    

    $scope.getPrixSuggestions = function (value) {
        $scope.loading = true;
        return $http.get($rootScope.apiRootUrl + '/indexes/PrixLitteraireSuggestions', {
            params: {
                query: "Value:" + value + "*",
                pageSize: 10,
                _: Date.now(),
            }
        }).then(function (res) {
            $scope.loading = false;
            return res.data.Results;
        });
    };
    $scope.cancel = function () {
        $scope.modalInstance.dismiss('cancel');
    }


    $scope.add = function () {
        var item = new Livre;
        item.datePublication = moment().format();
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
           
            TweenMax.to(".tile", 0.2, { opacity: 1 });

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
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
                $scope.saveItem($scope.selectedItem);
            }, function () {
                // delete on dismiss
                $scope.deleteLivre($scope.selectedItem);
            });
        }).
        error(function (data, status, headers, config) {
            console.log(data);
        });
    }


    $scope.deleteLivre = function (item, $event) {
        if ($event) {
            $event.stopPropagation();
            $event.stopImmediatePropagation();
        }
        
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
        if (item.FichePedago) {
            $http({
                method: 'DELETE',
                url: $rootScope.apiRootUrl + '/static/' + item.Id + '/' + item.FichePedago
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
              $scope.items.splice($scope.items.indexOf(item), 1);
              setTimeout(function () {
                  $scope.container.isotope('reLayout');
              }, 100);
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
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.f-' + $scope.niveauLecture : ''
        $scope.validateFilter();
    }


    $scope.searchEBook = function () {
        $scope.searchPatternEBook = $scope.checkboxSearchEBook ? '.f-ebook' : '';
        $scope.validateFilter();
    }

    $scope.searchPrixLitteraires = function () {
        $scope.searchPatternPrixLitteraires = $scope.checkboxPrixLitteraire ? '.f-prix' : '';
        $scope.validateFilter();
    }
    $scope.filtreThemes = function () {
        $scope.searchPatternTheme = $scope.themeMultiselectmodel.map(function (val) {
            return '.f-' + cleanString(val.Name);
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
              
                $scope.searchPatternRecherche = $scope.searchedText.Titre.split(" ").map(function (val) {
                    return '[class*=\'fil-' + cleanString(val) + '\']';
                }).join('');

                console.log($scope.searchPatternRecherche)
            } else {
                $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                    return '[class*=\'fil-' + cleanString(val) + '\']';
                }).join('');
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
        setTimeout(function () {
            $scope.container.isotope({sortBy: 'date'});
        }, 100)
        
    }
}]);