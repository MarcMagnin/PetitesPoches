
app.directive('isotopethis', function () {
    return {
        link: function (scope, elm) {
            //elm.find("a").click(function (event) {
            //    event.preventDefault();
            //    event.stopPropagation();
            //    event.stopImmediatePropagation();
            //    window.open($(this).attr("href"), $(this).attr("target"));
            //});

            var tileImage = elm.find(".tileHeroImage");
            // $container.isotope('insert', elm);
            // advantage : don't filter
            //$container.isotope('appended', elm);
            $container.isotope('insert', elm);
            if (scope.item.new) {
                $container.isotope({ sortBy: 'date' });
            }
            tileImage.load(function () {
                $container.isotope('reLayout');
            });


        }
    }
});
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});