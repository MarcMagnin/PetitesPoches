
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