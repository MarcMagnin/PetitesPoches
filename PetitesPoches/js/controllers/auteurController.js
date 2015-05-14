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



app.controller("auteurController", function ($scope, $rootScope, $http, $state, $q, auteurService, $mdDialog) {
    $scope.entityName = "Auteur";
    $scope.items = [];
    $scope.itemsPool = [];
    $scope.tags = [];
    $scope.searchItems = [];
    $scope.selectedItem = "";
    $scope.container = $('.tilesContainer');
    $scope.dataReady = false;



    $scope.init = function () {
        //$("md-item").click(function () {
        //    //TweenMax.to(this, 0.5, { opacity: 0, y: -100, ease: Back.easeIn }, 0.1);
        //    TweenMax.fromTo(this, 2, { scale: 0.8, opacity: 0, ease: Elastic.easeOut, force3D: true }, { scale: 1, opacity: 1, ease: Elastic.easeOut, force3D: true });
        //});
        // delay rendering
        //$(".menuBar").addClass("toggled");
        var menuBarAnimation = TweenMax.staggerFrom("md-item", 2, { scale: 0.85, opacity: 0, ease: Elastic.easeOut, force3D: true }, 0.15,
          onCompleteAll = function () {
              $scope.menuShown = true;
          });
        TweenMax.to(".progressIndicator", 0.2, { opacity: 1, display: "block" });
        $("#search2").focusin(function ($event) {
            if (preventSearchFocusIn) {
                $("#search2").blur();
                return
            }
            $scope.toggleSearch();
        });


        $("#search2").focusout(function ($event) {
            //// Can't rely on that, relatedTarget is null on firefox
            ////if ($event.relatedTarget && ($event.relatedTarget.id == "searchitem" || $event.relatedTarget.id == "searchbutton" || $event.relatedTarget.id == "search2")) {
            ////    return;
            ////}
            //if (preventFocusOut) {
            //    return
            //}
            $scope.closeSearch();
        });

        itemAdded = 0;
        auteurService.getAuteurs()
            .then(function (auteurs) {
                $scope.itemsPool = auteurs;

                delayLoop(auteurs, 0, 0.0001, function (item) {
                    item.Id = item['@metadata']['@id'];

                    $scope.items.push(item);
                    if ($scope.items.length == auteurs.length) {
                        $scope.dataReady = true;
                        TweenMax.to(".progressIndicator", 0.2, { opacity: 0, display: "none" });
                    }
                    $scope.$apply();

                });

           

            })
    };

    $scope.voirTousSesLivres = function (auteur) {
        console.log(auteur)
        $rootScope.$broadcast('goToCollection', auteur);
    }

    var searchToggled = false;
    var preventFocusOut = false;
    $scope.toggleSearch = function () {
        if (searchToggled)
            return;
        searchToggled = true;
        $("#searchitem").addClass("toggled");
        $("#searchIcon").addClass("toggled");
        $("#search2").addClass("toggled");
    }


    $scope.closeSearch = function () {
        setTimeout(function () {
            $("#searchitem, #searchIcon, #search2").removeClass("toggled");
            searchToggled = false;
        }, 100)

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
                pageSize: 6,
                foobar: new Date().getTime()
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
        if ($scope.searchedText && $scope.searchItems.indexOf(searchedTextItemFilterButton) == -1) {
            $scope.searchItems.push(searchedTextItemFilterButton);

        } else {
            if (!$scope.searchedText) {
                $scope.searchItems.splice($scope.searchItems.indexOf(searchedTextItemFilterButton), 1);
            }

        }
        searchedTextItemFilterButton.value = newValue;

       // $scope.validateFilter();
    });

 
    var preventSearchFocusIn = false;
    $scope.validateSearchTextBox = function ($item, $model, $label) {
        preventSearchFocusIn = true;
        setTimeout(function () {
            preventSearchFocusIn = false;
        }, 200);

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

        $scope.closeSearch();
    }


    $scope.removeFilter = function (searchItem) {

        $scope.searchItems.splice($scope.searchItems.indexOf(searchItem), 1)

        switch (searchItem.key) {
            case "text":
                $scope.searchedText = "";
                $scope.searchPatternRecherche = null;
                break;
        }

        $scope.validateFilter();
    }
    $scope.validateFilter = function () {
        if(!$scope.dataReady)
            return;
        var searchPattern =
            ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')

        $scope.container.isotope({ filter: searchPattern });

    }

    $scope.filtreAuteur = function (auteur) {
        $scope.searchedText = auteur.Prenom + " " + auteur.Nom;
        $scope.validateSearch();
    }


    $scope.validateSearch = function ($item, $model, $label, $viewValue) {
        if ($scope.searchTimeout) {
            clearTimeout($scope.searchTimeout);
        }

        if ($item && $item.Nom) {
            $scope.searchedText = $item.Prenom + " " + $item.Nom;
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