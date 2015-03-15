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
    



    $scope.$watch('themeMultiselectmodel.length', function (newValue) {
        $scope.filtreThemes();
        //console.log($scope.themeMultiselectmodel)
        //if ($scope.themeMultiselectmodel.length >=0) {
        //    var test = $('.dropdown-menu li');
        //    //test.attr('disabled', true); //add
           
        //    //test.unbind('click');
        //    //test.on('click', function (event) {
        //    //    // if we have no href url, then don't navigate anywhere.
        //    //    event.preventDefault();
        //    //    event.stopPropagation();
        //    //});

        //    var notSelected = test.not('.lx-select__choice--is-selected');
        //    notSelected.addClass("disabled")
        //    notSelected.unbind('click');
        //    notSelected.on('click', function (event) {
        //        // if we have no href url, then don't navigate anywhere.
        //            event.preventDefault();
        //            event.stopPropagation();
        //    });
        //} else {
        //}
    });


   
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

            $("#searchitem").removeClass("toggled");
            $(this).removeClass("toggled");
            $(this).find("#searchIcon").removeClass("toggled");
            $("#searchbutton").removeClass("toggled");
            $("#search2").removeClass("toggled");
            searchToggled = false;
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


    $scope.$watch('searchedText', function (newValue) {
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
      
        $scope.validateFilter();
    }

    
    $scope.removeFilter = function (searchItem) {
        switch (searchItem.key) {
            case "text":
                $scope.searchedText = "";
                $scope.searchPatternRecherche = null;
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
            case "theme":
                $scope.themeMultiselectmodel.splice($scope.themeMultiselectmodel.indexOf(searchItem.item), 1);
                $scope.searchPatternTheme = $scope.themeMultiselectmodel.map(function (val) {
                    return '.f-' + val.Name.toLowerCase().replace(/ /g, '');
                }).join('');
               // $rootScope.$broadcast('updateThemesFilter', searchItem.value);
                break;
        } 

        $scope.validateFilter();
    }
    $scope.validateFilter = function () {
        var searchPattern =
            ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')
            + ($scope.searchPatternTheme ? $scope.searchPatternTheme : '')
            + ($scope.searchPatternEBook ?  $scope.searchPatternEBook : '')
            + ($scope.searchPatternPrixLitteraires ? $scope.searchPatternPrixLitteraires : '')
            + ($scope.filterPatternNiveauLecture ? $scope.filterPatternNiveauLecture : '')
        
        
        $scope.searchItems.length = 0;
        if ($scope.searchedText) {
            $scope.searchItems.push(
            {
                key : "text",
                value: $scope.searchedText
            });
        }
        if ($scope.searchPatternEBook) {
            $scope.searchItems.push(
            {
                key: "ebook",
                value: "E-books"
            });
        }
        if ($scope.searchPatternPrixLitteraires) {
            $scope.searchItems.push(
               {
                   key: "prix",
                   value: "Prix Littéraires"
               });
        }
        if ($scope.filterPatternNiveauLecture) {
            var label;
            switch ($scope.niveauLecture) {
                case "premierspas":
                    label = "Premiers Pas";
                    break;
                case "debutants":
                    label = "Débutants";
                    break;
                case "confirmes":
                    label = "Confirmés";
                    break;
            }
            $scope.searchItems.push(
            {
                key: "niveau",
                value: label
            });
        }
        if ($scope.searchPatternTheme) {
            angular.forEach($scope.themeMultiselectmodel, function (theme) {
                $scope.searchItems.push(
                 {
                     key: "theme",
                     value: theme.Name,
                     item: theme
                 });
            });
         
        }



        $scope.container.isotope({ filter: searchPattern });

        var filterActive = searchPattern.length > 1;
        if (filterActive) {
            $("#clearFilter").addClass("toggled");
        }
        else {
            $("#clearFilter").removeClass("toggled");
        }
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
        console.log(text)
        console.log("text: " +$scope.searchedText)


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