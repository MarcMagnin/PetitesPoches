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
//app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet, parentScope) {
//    $scope.parentScope = parentScope;
//    $scope.listItemClick = function($index) {
//        var clickedItem = $scope.items[$index];
//        $mdBottomSheet.hide(clickedItem);
//    };
   
//})


app.controller("livreController", function ($scope, $rootScope, $mdBottomSheet, $http, $timeout, $state, $modal, $q, $mdSidenav, livreService, $mdDialog) {
    $scope.entityName = "Livre";
    $scope.items = [];
    $scope.tags = [];
    $scope.selectedItem = "";
    $scope.searchedAuteur = "";
    $scope.searchedText = "";
    $scope.searchSelectedItem = "";
    $scope.whiteSpacePattern = '/ /g'
    $scope.searchTimeout;
    $scope.container = $('.tilesContainer');
    $scope.niveauLecture = '';
    $scope.themeMultiselectSettings = { displayProp: 'Name', idProp: 'Name' };
    $scope.themeMultiselectmodel = [];
    $scope.searchItems = [];
    

    $scope.closeSearch = function () {
        $("#searchitem, #searchbutton, #searchIcon, #search2").removeClass("toggled");
        searchToggled = false;
    }
    $scope.init = function () {

        //$("#searchitem").on("click", function () {
        //   $(this).addClass("toggled");
        //   $("#searchIcon").addClass("toggled");
        //   $("#search2").addClass("toggled");
        //    //$("#search2").focus();
          

        //});
        $("#searchitem, #searchbutton").focusout(function ($event) {
            if ($event.relatedTarget && ($event.relatedTarget.id == "searchitem" || $event.relatedTarget.id == "searchbutton" || $event.relatedTarget.id == "search2")) {
                return;
            }
            $scope.closeSearch();
        });

        itemAdded = 0;
        livreService.getLivres()
            .then(function (livres) {

                //for (var i = 0; i < 200; i++) {
                //    var livre = new Livre();
                //    livre['@metadata'] ="";
                //    livre['@metadata']['@id'] = 0;
                //    $scope.items.push(livre);
                //}

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

    $scope.toggleLeft = function () {
        var leftSideNave = $mdSidenav('left');

        leftSideNave.toggle().then(function () {
            if (leftSideNave.isOpen()) {
                $('#search').focus();
            }
        });
    }

    $scope.showListBottomSheet = function ($event) {
        $mdBottomSheet.show({
            templateUrl: 'templates/bottomSheet.tmpl.html',
            controller: 'ListBottomSheetCtrl',
            targetEvent: $event,
            locals: {
                parentScope: $scope
            }
        }).then(function (clickedItem) {
            //$scope.alert = clickedItem.name + ' clicked!';
        });
    };

    $scope.sideNavIcon = "search";
    $scope.toggleLeft = function () {
        var leftSideNave = $mdSidenav('left');

        leftSideNave.toggle().then(function () {
            if (leftSideNave.isOpen()) {
                $('#search').focus();
            }
        }); 
    }
    $scope.closeLeft = function () {
        var leftSideNave = $mdSidenav('left');
        leftSideNave.close
        $(".clear-icon").removeClass("toggled");
    }
    $scope.openLeft = function () {
        var leftSideNave = $mdSidenav('left');
        leftSideNave.open();
    
        $(".clear-icon").addClass("toggled");
    }

    //$scope.$watch(function () { return $('.md-sidenav-left').attr('class'); }, function (newValue) {
    //    var leftSideNave = $mdSidenav('left');
    //    console.log(leftSideNave);
    //    if (leftSideNave.isOpen() && !$('.md-sidenav-left').hasClass('md-closed')) {
    //        //$scope.sideNavIcon = "chevron_left";
    //        $('#search').focus();
    //    } else {
    //        //$scope.sideNavIcon = "search";
    //        $(".clear-icon").removeClass("toggled");
    //    }
    //});


    $scope.select = function (item, size, $event) {
        $scope.selectedItem = item;

        
        //// prevent the modal to show if we click on a nested link
        if (!$($event.target).closest('a').length) {

            $mdDialog.show({
                targetEvent: $event,
                templateUrl: 'templates/livreDialog.tmpl.html',
                controller: 'ModalInstanceCtrl',
                onComplete: afterShowLivreDialog,
                locals: {
                    selectedItem: $scope.selectedItem,
                    parentScope: $scope
                }
            });
  

            //var modalInstance = $modal.open({
            //    templateUrl: 'myModalContent.html',
            //    controller: 'ModalInstanceCtrl',
            //    size: size,
            //    resolve: {
            //        selectedItem: function () {
            //            return $scope.selectedItem;
            //        },
            //        parentScope: function () {
            //            return $scope;
            //        },
            //    }
            //});



        }
      


        //    modalInstance.result.then(function () {
        //    }, function () {
        //        //   $log.info('Modal dismissed at: ' + new Date());
        //    });
        //}
    }

    function afterShowLivreDialog(scope, element, options) {
        // post-show code here: DOM element focus, etc.
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



    var results = [];
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
            results.length = 0;
            res.data.Results.forEach(function (item) {
                results.push({
                    Titre: item.Titre, Auteur: {
                        Nom: item.Auteur.Nom,
                        Prenom : item.Auteur.Prenom
                    },
                    imageUrl : $scope.apiRootUrl + "/" + item.Couverture
                })
            });
            return results;
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

    $scope.validateSearchFromLivre = function ($item, $model, $label) {
        if ($item.Auteur && $item.Auteur.Nom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1 || $item.Auteur.Prenom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1) {
            $scope.searchedText = $item.Auteur.Prenom + " " + $item.Auteur.Nom;
        }
        else {
            $scope.searchedText = $item.Titre;
        }
        $scope.validateFilter();
        $scope.closeSearch();
    }

    $scope.$watch('themeMultiselectmodel.length', function (items) {
        //if (previousThemeMultiselectmodel) {
        //    angular.forEach(items, function (item) {
        //        var found = false;
        //        for (var i = 0; i < previousThemeMultiselectmodel.length; i++) {
        //            if (previousThemeMultiselectmodel[i].Name == item.Name) {
        //                found = true;
        //            }
        //        }
        //    })
        //}
        //angular.forEach(items, function(item){
        //    var found = false;
        //    for (var i = 0; i < $scope.searchItems.length; i++) {
        //        if ($scope.searchItems[i].value == item.Name) {
        //            found = true;
        //            $scope.searchItems.splice($scope.searchItems[i], 1);
        //            break;
        //        }
        //    }
        //    if (!found) {
        //        $scope.searchItems.unshift(
        //        {
        //            key: "theme",
        //            value: item.Name,
        //            item: item
        //        });
        //    }
        //})


        $scope.filtreThemes();
    });

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
                $scope.searchPatternFichePedagogiques= null;
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
            + ($scope.searchPatternTheme ? $scope.searchPatternTheme : '')
            + ($scope.searchPatternFichePedagogiques ? $scope.searchPatternFichePedagogiques : '')
            + ($scope.searchPatternEBook ?  $scope.searchPatternEBook : '')
            + ($scope.searchPatternPrixLitteraires ? $scope.searchPatternPrixLitteraires : '')
            + ($scope.filterPatternNiveauLecture ? $scope.filterPatternNiveauLecture : '')
        
        $scope.container.isotope({ filter: searchPattern });
     
    }

    $scope.niveauLecture = "";
    var filterItemNiveau= {
        key: "niveau",
        value: ""
    };
    $scope.$watch('niveauLecture', function (newValue) {
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.fil-' + $scope.niveauLecture : ''
        $scope.validateFilter();

        if ($scope.searchItems.indexOf(filterItemNiveau) != -1)
            $scope.searchItems.splice($scope.searchItems.indexOf(filterItemNiveau), 1);
        if ($scope.filterPatternNiveauLecture) {
            $('#NiveauxButton').addClass("active");
            var label
            switch ($scope.niveauLecture) {
                case "premierspas":
                    label = "Premiers pas";
                    break;
                case "debutants":
                    label = "Débutants";
                    break;
                case "confirmes":
                    label = "Confirmés";
                    break;
            }
            filterItemNiveau = {
                key: "niveau",
                value: label
            };
            $scope.searchItems.push(filterItemNiveau);
        } else {
            $('#NiveauxButton').removeClass("active");
        }
    });

    $scope.searchEBook = function () {
        $scope.searchPatternEBook  = $scope.checkboxSearchEBook ? '.fil-ebook' : '';
        $scope.validateFilter();
    }

    $scope.searchFichePedagogiques = function () {
        $scope.searchPatternFichePedagogiques = $scope.checkboxFichePedagogiques ? '.fil-pedago' : '';
        $scope.validateFilter();
    }
    
    $scope.searchPrixLitteraires = function () {
        $scope.searchPatternPrixLitteraires = $scope.checkboxPrixLitteraire ? '.fil-prix' : '';
        $scope.validateFilter();
    }

 
    $scope.filtreNiveauLecture = function () {
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.fil-' + $scope.niveauLecture : ''
        $scope.validateFilter();
    }



    var selectedFromLivre = { Name: "" };
    $scope.filtreThemes = function (tag) {
        if (tag) {
            selectedFromLivre.Name = tag;
            if ($.grep($scope.themeMultiselectmodel, function (e) { return e.Name == tag; }).length == 0) {
                $scope.themeMultiselectmodel.push(selectedFromLivre)
            }
        }

        $scope.searchPatternTheme = $scope.themeMultiselectmodel.map(function (val) {
            return '.f-' + val.Name.toLowerCase().replace(/ /g, '');
        }).join('');

        if ($scope.searchPatternTheme) {
            $('#ThemesButton').addClass("active");
        } else {
            $('#ThemesButton').removeClass("active");
        }

        $scope.validateFilter();

    }


    $scope.filtreAuteur = function (auteur) {
        //$scope.openLeft();

        $scope.searchedText = auteur.Prenom + " " + auteur.Nom;
        $scope.validateSearch();
    }


    var previousTag;
    $scope.filtreTheme = function (tag) {
        tag = tag.toLowerCase();
        //if (previousTag && previousTag == tag) {
        //  //  $rootScope.$broadcast('updateThemesFilter', null);
        //  //  previousTag = null;
        //    return;
        //}
        //previousTag = tag;

       // $scope.openLeft();
        //$("#wrapper").addClass("toggled");
        //$("#search").addClass("toggled");
        //$(".searchSideBar").addClass("toggled");
        $rootScope.$broadcast('updateThemesFilter', tag);
    }
    $scope.clearFilters = function () {
        $scope.searchPatternEBook = "";
        $scope.searchPatternPrixLitteraires = "";
        $scope.searchPatternRecherche = "";
        $scope.filterPatternNiveauLecture = "";
        $scope.searchPatternTheme = "";
        $scope.searchedText = "";
        $scope.checkboxPrixLitteraire = false;
        $scope.checkboxSearchEBook = false;
        $scope.niveauLecture = '';
        $scope.filtreTheme('');

        $scope.validateFilter();
        $scope.closeLeft();
        //$("#wrapper").removeClass("toggled");
        //$("#search").removeClass("toggled");
        //$(".searchSideBar").removeClass("toggled");
    }

    $scope.validateSearch = function (text) {
        if ($scope.searchTimeout) {
            clearTimeout($scope.searchTimeout);
        }


        $scope.searchTimeout = setTimeout(function () {
            var searchPattern;
         
            if ($scope.searchedText.Titre) {
                $scope.searchPatternRecherche = '[class*=\'fil-' + $scope.searchedText.Titre.toLowerCase().replace(/ /g, '') + '\']';
            } else {
                if ($scope.searchedText.length == 0) {
                    $scope.searchPatternRecherche = '*';
                } else {
                    $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                        return '[class*=\'fil-' + val.toLowerCase() + '\']';
                    }).join('');
                }
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
});