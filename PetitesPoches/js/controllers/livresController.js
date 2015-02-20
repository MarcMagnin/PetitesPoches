var Livre = function () {
    this.Index = 0;
    this.Titre = "";
    this.Couverture = "";
    this.Auteur = {
        Nom: "",
        Prenom: ""
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
    this.LienIssu = ""
};

app.controller("livreController", ['$scope', '$rootScope', '$http', '$timeout', '$state', '$modal', '$q', 'livreService', function ($scope, $rootScope, $http, $timeout, $state, $modal, $q, livreService) {
    $scope.entityName = "Livre";
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.searchedAuteur = "";
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
        livreService.getLivres()
            .then(function (livres) {

                for (var i = 0; i < 200; i++) {
                    var livre = new Livre();
                    livre['@metadata'] ="";
                    livre['@metadata']['@id'] = 0;
                    $scope.items.push(livre);
                }

                //delayLoop(data.Results, 0, function (item) {
                //    item.Id = item['@metadata']['@id'];
                //    $scope.items.push(item);
                //    $scope.$apply();
                //});


                angular.forEach(livres, function (item, index) {
                    item.Id = item['@metadata']['@id'];
                    $scope.items.push(item);
                });

            })


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


            modalInstance.result.then(function () {
            }, function () {
                //   $log.info('Modal dismissed at: ' + new Date());
            });
        }
    }

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
        $scope.searchPatternTheme = $scope.themeMultiselectmodel.map(function (val) {
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
        return $http({
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
            $scope.container.isotope({ sortBy: 'date' });
        }, 100)

    }
}]);