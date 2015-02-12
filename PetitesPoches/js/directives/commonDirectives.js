var itemAdded = 0;
app.directive('isotopethis', function () {
    return {
        link: function (scope, elm, attrs) {
            //elm.find("a").click(function (event) {
            //    event.preventDefault();
            //    event.stopPropagation();
            //    event.stopImmediatePropagation();
            //    window.open($(this).attr("href"), $(this).attr("target"));
            //});
            itemAdded++;
            var tileImage = elm.find(".tileHeroImage");
            // $container.isotope('insert', elm);
            // advantage : don't filter
            //$container.isotope('appended', elm


            // just add the item to the isotope collection without any layout modification
            //$container.isotope('appended2', elm);
            $container.isotope('appended2', elm);

            if (scope.items.length == itemAdded) {
                $container.isotope({ sortBy: attrs.sort});
            }

            // get a reference for 
            //scope.item.DOMelement = elm;

            //if (scope.item.new) {
            //    console.log("SORT : " + attrs.sort)
            //    $container.isotope({ sortBy: attrs.sort });
            //}
            tileImage.load(function () {
                
               // $container.isotope('reLayout');
            });
          

        }
    }
});