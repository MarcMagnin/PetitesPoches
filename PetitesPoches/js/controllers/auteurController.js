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



app.controller("auteurController", function ($scope, $rootScope, $window, $stateParams, $http, $state, $q, auteurService, $mdDialog) {
    $scope.entityName = "Auteur";
    $scope.items = [];
    $scope.itemsPool = [];
    $scope.tags = [];
    $scope.searchItems = [];
    $scope.selectedItem = "";
    $scope.container = $('.tilesContainer');
    $scope.dataReady = false;
    $scope.searchPattern = "*";
    $scope.userLeft = false;

    // permet de verifier si l'utilisateur s'en va pour annuler toutes les taches 
    $scope.$on("tabChanged", function (event, args) {
        $scope.userLeft = true;
    })


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
        $(".searchBar").focusin(function ($event) {
            if (preventSearchFocusIn) {
                $(".searchBar").blur();
                return
            }
            $scope.toggleSearch();
        });


        $(".searchBar").focusout(function ($event) {
            //// Can't rely on that, relatedTarget is null on firefox
            ////if ($event.relatedTarget && ($event.relatedTarget.id == "searchitem" || $event.relatedTarget.id == "searchbutton" || $event.relatedTarget.id == "search2")) {
            ////    return;
            ////}
            //if (preventFocusOut) {
            //    return
            //}
            $scope.closeSearch();
        });
        

        if ($stateParams.search) {
            $scope.searchedText = $stateParams.search.trim();
            $scope.setSearchPattern();

        }

        itemAdded = 0;
        auteurService.getAuteurs()
            .then(function (auteurs) {

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
                        item.filter +=item.Nom.split(" ").map(function (val) {
                            return 'f-' + cleanString(val);
                        }).join(' ');
                    }
                    if (item.Prenom) {
                        item.filter += " "+ item.Prenom.split(" ").map(function (val) {
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
                        $container.mixItUp('filter', $scope.searchPattern);
                    }


                    if ($scope.items.length == auteurs.length) {
                        $scope.$apply();
                        $scope.dataReady = true;
                        $container.mixItUp('filter', $scope.searchPattern);
                        TweenMax.to(".progressIndicator", 0.2, { opacity: 0, display: "none" });
                        // tell phantom crawler that content has loaded
                        if (typeof window.callPhantom === 'function') {
                            window.callPhantom();
                        }
                    }

                });
            })
    };

    $scope.setSearchPattern = function () {
        if ($scope.searchedText.length == 0) {
            $scope.searchPattern = '*';
        } else {
            $scope.searchPattern = tokenizeStringPattern($scope.searchedText);
        }
    }

   
    var searchToggled = false;
    var preventFocusOut = false;
    $scope.toggleSearch = function () {
        if (searchToggled)
            return;
        searchToggled = true;

        var searchWidth = $(window).width() < 630 ? 260 : 150;
        $("#searchitem").addClass("toggled");
        $("#searchIcon").addClass("toggled");
        TweenMax.fromTo(".searchBar", 0.2, { width: searchWidth+50, opacity: 0, ease: null }, { width: searchWidth, opacity: 1, ease: Linear.ease });
    }


    $scope.closeSearch = function () {
        var searchWidth = $(window).width() < 630 ? 260 : 150;
        $("#searchitem, #searchIcon, .searchBar").removeClass("toggled");
        TweenMax.to(".searchBar", 0.2, {
            width: searchWidth + 50, opacity: 0, ease: Linear.ease,
            onComplete:function(){
                $(".searchBar").width(45);
        }});
        searchToggled = false;
    }


    $scope.select = function (item, size, $event) {
        if ($window.dragged) {
            return;
        }

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
                return '[class*=\'f-' + cleanString(val) + '\']';
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
        //if(!$scope.dataReady)
        //    return;
        var searchPattern =
            ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')

        if (searchPattern.length == 0)
            $scope.searchPattern = "*"
        else {
            $scope.searchPattern = searchPattern;
        }
        console.log($scope.searchPattern)
        filter();
    }

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
                    return '[class*=\'f-' + cleanString(val) + '\']';
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
            $scope.container.isotope({ sortBy: 'nom' });
        }, 100)

    }

});