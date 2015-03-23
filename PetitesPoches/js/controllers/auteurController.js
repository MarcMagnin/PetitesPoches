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



app.controller("auteurController", function ($scope, $rootScope, $http, $timeout, $state, $modal, $q, auteurService, $mdDialog) {
    $scope.entityName = "Auteur";
    $scope.items = [];
    $scope.tags = [];
    $scope.searchItems = [];
    $scope.selectedItem = "";
    $scope.container = $('.tilesContainer');


    $scope.closeSearch = function () {
        $("#searchitem, #searchbutton, #searchIcon, #search2").removeClass("toggled");
        searchToggled = false;
    }

    $scope.init = function () {

        $("#searchitem, #searchbutton").focusout(function ($event) {
            if ($event.relatedTarget && ($event.relatedTarget.id == "searchitem" || $event.relatedTarget.id == "searchbutton" || $event.relatedTarget.id == "search2")) {
                return;
            }
            $scope.closeSearch();
        });

        itemAdded = 0;
        auteurService.getAuteurs()
            .then(function (auteurs) {
                angular.forEach(auteurs, function (item, index) {
                    item.Id = item['@metadata']['@id'];
                    $scope.items.push(item);
                });

            })
    };

    $scope.voirTousSesLivres = function (auteur) {
        console.log(auteur)
        $rootScope.$broadcast('goToCollection', auteur);
    }

    var searchToggled = false;
    $scope.toggleSearch = function () {
        setTimeout(function () {
            $("#search2").focus();
        }, 150)
        if (searchToggled)
            return;
        searchToggled = true;
        $("#searchitem").addClass("toggled");
        $("#searchIcon").addClass("toggled");
        $("#searchbutton").addClass("toggled");
        $("#search2").addClass("toggled");


    }

    $scope.select = function (item, size, $event) {
        $scope.selectedItem = item;


        //// prevent the modal to show if we click on a nested link
        if (!$($event.target).closest('a').length) {

            $mdDialog.show({
                targetEvent: $event,
                templateUrl: 'templates/auteurDialog.tmpl.html',
                controller: 'ModalInstanceCtrl',
                onComplete: afterShowLivreDialog,
                locals: {
                    selectedItem: $scope.selectedItem,
                    parentScope: $scope
                }
            });

        }

    }

    function afterShowLivreDialog(scope, element, options) {
        // post-show code here: DOM element focus, etc.
    }


    var results = [];
    $scope.searchSuggestionsValue;
    $scope.searchSuggestions = function (value) {
        $scope.searchSuggestionsValue = value;
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
                return res.data.Results;
        });
    }

    var searchedTextItemFilterButton = {
        key: "text",
        value: ""
    }
    $scope.$watch('searchedText', function (newValue) {
        console.log(newValue)
        if ($scope.searchedText && $scope.searchItems.indexOf(searchedTextItemFilterButton) == -1) {
            $scope.searchItems.push(searchedTextItemFilterButton);


            $('#searchbutton').addClass("active");
        } else {
            if (!$scope.searchedText) {
                $scope.searchItems.splice($scope.searchItems.indexOf(searchedTextItemFilterButton), 1);
                $('#searchbutton').removeClass("active");
            }

        }
        searchedTextItemFilterButton.value = newValue;

        $scope.validateFilter();
    });

    $scope.$watch('searchSelectedItem', function (newValue) {
        if ($scope.searchSelectedItem && $scope.searchSelectedItem.Auteur
            && ($scope.searchSelectedItem.Auteur.Nom.toLowerCase().indexOf($scope.searchedText.toLowerCase()) > -1
            || $scope.searchSelectedItem.Auteur.Prenom.toLowerCase().indexOf($scope.searchedText.toLowerCase()) > -1)) {
            $scope.searchedText = $scope.searchSelectedItem.Auteur.Prenom + " " + $scope.searchSelectedItem.Auteur.Nom;
        }
        $scope.validateFilter();
    });

    $scope.validateSearchTextBox = function ($item, $model, $label) {
        if ($item.Nom) {
            $scope.searchedText = $item.Prenom + " " + $item.Nom;
        }
        else {
            $scope.searchedText = $item;
        }

        if ($scope.searchedText.length == 0) {
            $scope.searchPatternRecherche = '*';
        } else {
            $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                return '[class*=\'f-' + val.toLowerCase() + '\']';
            }).join('');
        }

        $scope.validateFilter();
        $scope.closeSearch();
    }

    $scope.removeFilterTheme = function (item) {
        //// trick to enable unselect on ms-select
        $scope.themeMultiselectmodel.splice($scope.themeMultiselectmodel.indexOf(item), 1);
        var back = $scope.themeMultiselectmodel;
        $scope.themeMultiselectmodel = undefined;
        $scope.themeMultiselectmodel = [];
        angular.forEach(back, function (theme) {
            $scope.themeMultiselectmodel.push(theme);
        });
        var backTags = [];
        angular.forEach($scope.tags, function (theme) {
            backTags.push(theme);
        });
        $scope.tags.length = 0;
        $scope.tags = backTags;
    }

    $scope.removeFilter = function (searchItem) {

        $scope.searchItems.splice($scope.searchItems.indexOf(searchItem), 1)

        switch (searchItem.key) {
            case "text":
                $scope.searchedText = "";
                $scope.searchPatternRecherche = null;
                break;
            case "fichePedago":
                $scope.searchPatternFichePedagogiques = null;
                $scope.checkboxFichePedagogiques = false;
                break;
            case "ebook":
                $scope.searchPatternEBook = null;
                $scope.checkboxSearchEBook = false;
                break;
            case "prix":
                $scope.searchPatternPrixLitteraires = null;
                $scope.checkboxPrixLitteraire = false;
                break;
            case "niveau":
                $scope.niveauLecture = "";
                $scope.filterPatternNiveauLecture = "";
                break;
        }

        $scope.validateFilter();
    }
    $scope.validateFilter = function () {
        var searchPattern =
            ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')
        console.log($scope.searchPatternRecherche);

        $scope.container.isotope({ filter: searchPattern });

    }

    $scope.filtreAuteur = function (auteur) {
        //$scope.openLeft();

        $scope.searchedText = auteur.Prenom + " " + auteur.Nom;
        $scope.validateSearch();
    }


    $scope.validateSearch = function () {
        if ($scope.searchTimeout) {
            clearTimeout($scope.searchTimeout);
        }


        $scope.searchTimeout = setTimeout(function () {
            var searchPattern;

            if ($scope.searchedText.length == 0) {
                $scope.searchPatternRecherche = '*';
            } else {
                $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                    return '[class*=\'f-' + val.toLowerCase() + '\']';
                }).join('');
            }

            $scope.validateFilter();
        }, 100);
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


    $scope.sort = function () {
        setTimeout(function () {
            $scope.container.isotope({ sortBy: 'date' });
        }, 100)

    }

});