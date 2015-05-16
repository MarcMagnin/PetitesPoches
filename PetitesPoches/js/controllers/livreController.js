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

function cleanString(string) {
    return string.replace(/[^\w\s]/gi, '').toLowerCase().replace(/ /g, '');
}

app.controller("livreController", function ($scope, $rootScope, $stateParams, $http, $timeout, $state, $q, livreService, $mdDialog, $filter) {
    $scope.entityName = "Livre";
    $scope.items = [];
    $scope.itemsPool = [];
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
    $scope.dataReady = false;

    $scope.loadMore = function () {
        alert('test');
    }
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

        //$("#searchitem").on("click", function () {
        //   $(this).addClass("toggled");
        //   $("#searchIcon").addClass("toggled");
        //   $("#search2").addClass("toggled");
        //    //$("#search2").focus();


        //});


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
        $scope.menuShown = false;


        itemAdded = 0;
        livreService.getLivres()
            .then(function (livres) {
                $scope.itemsPool = livres;


                //for (var i = 0; i < 200; i++) {
                //    var livre = new Livre();
                //    livre['@metadata'] ="";
                //    livre['@metadata']['@id'] = 0;
                //    livres.push(livre);
                //}


                delayLoop(livres, 0, 0, function (item) {
                    item.Id = item['@metadata']['@id'];

                    //item.filter = "fil-" + cleanString(item.Titre);

                    item.filter = item.Titre.split(" ").map(function (val) {
                        return '[class*=\'fil-' + cleanString(val) + '\']';
                    }).join('');

                    if (item.Auteur.Nom)
                        item.filter += " fil-" + cleanString(item.Auteur.Nom);
                    if (item.Auteur.Prenom)
                        item.filter += " fil-" + cleanString(item.Auteur.Prenom);

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
                        
                    //{{::item.PrixLitteraires && 'fil-prix' || ''}}
                    //{{::item.EBookUrl && 'fil-ebook' || ''}}
                    //{{::item.FichePedago && 'fil-pedago' || ''}}
                    //{{::item.NiveauLecture && 'fil-'+item.NiveauLecture || '' | lowercase | nospace}}
                    //{{::item.Tags && item.Tags || '' | filterString}} "


                    $scope.items.unshift(item);
                    if ($scope.items.length == livres.length) {
                        $scope.dataReady = true;
                        
                    }
                    $scope.$apply();

                });

                //$timeout(function () {
                //    //angular.forEach(livres, function (item, index) {
                //    //    item.Id = item['@metadata']['@id'];
                //    //    $scope.items.push(item);
                //    //});
                //    $scope.items = livres;
                //    $(".progressIndicator").addClass("toggled");

                //}, 1000);

                if ($stateParams.auteur) {
                    $scope.searchedText = $stateParams.auteur;
                    $scope.setSearchPattern();
                }

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
                pageSize: 6,
                foobar: new Date().getTime() 
            }
        }).then(function (res) {
            $scope.loadingSearchSuggestions = false;
            results.length = 0;
            res.data.Results.forEach(function (item) {
                results.push({
                    Titre: item.Titre, Auteur: {
                        Nom: item.Auteur.Nom,
                        Prenom: item.Auteur.Prenom
                    },
                    imageUrl: $scope.apiRootUrl + "/" + item.Couverture
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
      
    });

 

    var preventSearchFocusIn = false;
    $scope.validateSearchFromLivre = function ($item, $model, $label) {
        preventSearchFocusIn = true;
        setTimeout(function () {
            preventSearchFocusIn = false;
        } , 200);
        
        if ($item.Auteur && $item.Auteur.Nom  && ($item.Auteur.Nom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1 || $item.Auteur.Prenom.toLowerCase().indexOf($scope.searchSuggestionsValue.toLowerCase()) > -1)) {
            $scope.searchedText = $item.Auteur.Prenom + " " + $item.Auteur.Nom;
        }
        else {
            $scope.searchedText = $item.Titre;
        }
       

        $scope.validateSearch();
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
                $("#search2").val('');
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
        //if (!$scope.dataReady)
        //    return;


        var searchPattern =
            ($scope.searchPatternRecherche ? $scope.searchPatternRecherche : '')
            + ($scope.searchPatternTheme ? $scope.searchPatternTheme : '')
            + ($scope.searchPatternFichePedagogiques ? $scope.searchPatternFichePedagogiques : '')
            + ($scope.searchPatternEBook ? $scope.searchPatternEBook : '')
            + ($scope.searchPatternPrixLitteraires ? $scope.searchPatternPrixLitteraires : '')
            + ($scope.filterPatternNiveauLecture ? $scope.filterPatternNiveauLecture : '')

        $scope.container.isotope({ filter: searchPattern });


        // enable to fix an offset bug when filtering
        // set the offset to 0 directly
        $scope.searchTimeout = setTimeout(function () {
            $('#booksContainer').stop().animate({ scrollLeft: '-=' + (1) + 'px' }, 200);
        }, 200);

    }

    $scope.niveauLecture = "";
    var filterItemNiveau = {
        key: "niveau",
        value: ""
    };
    $scope.$watch('niveauLecture', function (newValue) {
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.f-' + $scope.niveauLecture : ''
        $scope.validateFilter();

        if ($scope.searchItems.indexOf(filterItemNiveau) != -1)
            $scope.searchItems.splice($scope.searchItems.indexOf(filterItemNiveau), 1);
        if ($scope.filterPatternNiveauLecture) {
            $('#NiveauxButton').addClass("active");
            var label
            switch ($scope.niveauLecture) {
                case "premierspas":
                    label = "lecteur *";
                    break;
                case "debutants":
                    label = "lecteur **";
                    break;
                case "confirmes":
                    label = "lecteur ***";
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
        $scope.searchPatternEBook = $scope.checkboxSearchEBook ? '.f-ebook' : '';
        $scope.validateFilter();
    }

    $scope.searchFichePedagogiques = function () {
        $scope.searchPatternFichePedagogiques = $scope.checkboxFichePedagogiques ? '.f-pedago' : '';
        $scope.validateFilter();
    }

    $scope.searchPrixLitteraires = function () {
        $scope.searchPatternPrixLitteraires = $scope.checkboxPrixLitteraire ? '.f-prix' : '';
        $scope.validateFilter();
    }


    $scope.filtreNiveauLecture = function () {
        $scope.filterPatternNiveauLecture = $scope.niveauLecture ? '.f-' + $scope.niveauLecture : ''
        $scope.validateFilter();
    }



    var selectedFromLivre = { Name: "" };
    $scope.filtreThemes = function (tag) {
        if (tag) {
            tag = tag.toLowerCase();
            selectedFromLivre.Name = tag;
            if ($.grep($scope.themeMultiselectmodel, function (e) { return e.Name == tag; }).length == 0) {
                $scope.themeMultiselectmodel.push(selectedFromLivre)
            }
        }

        $scope.searchPatternTheme = $scope.themeMultiselectmodel.map(function (val) {
            return '.f-' + cleanString(val.Name);
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


    $scope.$on('FilterAvecAuteur', function (event, args) {
        var test = $stateParams.auteur;
        console.log(test);
        if (args) {
            $scope.searchedText = args.Prenom + " " + args.Nom;
            $scope.validateSearch();
        }
    });

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


    $scope.setSearchPattern = function () {


        if ($scope.searchedText.Titre) {
            $scope.searchPatternRecherche = '[class*=\'fil-' + cleanString($scope.searchedText.Titre) + '\']';
        } else {
            if ($scope.searchedText.length == 0) {
                $scope.searchPatternRecherche = '*';
            } else {
                //$scope.searchPatternRecherche = '[class*=\'fil-' + cleanString($scope.searchedText) + '\']';
                $scope.searchPatternRecherche = $scope.searchedText.split(" ").map(function (val) {
                    return '[class*=\'fil-' + cleanString(val) + '\']';
                }).join('');
            }
        }
        console.log("Search:" + $scope.searchPatternRecherche);
    }
    $scope.validateSearch = function (text) {
        if ($scope.searchTimeout) {
            clearTimeout($scope.searchTimeout);
        }


        $scope.searchTimeout = setTimeout(function () {

            $scope.setSearchPattern();

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