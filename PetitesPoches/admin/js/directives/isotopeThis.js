
app.directive('isotopethis', function () {
    return {
        link: function (scope, elm) {
           
            var tileImage = elm.find(".tileHeroImage");
            // $container.isotope('insert', elm);
            // advantage : don't filter
            $container.isotope('appended', elm);

            if (scope.item.new) {
                $container.isotope({ sortBy: 'weight' });
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