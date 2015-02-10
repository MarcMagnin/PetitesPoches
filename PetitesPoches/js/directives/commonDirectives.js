var itemAdded = 0;
app.directive('isotopethis', function () {
  
    return {
        link: function (scope, elm) {
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
            $container.isotope('appended2', elm);

            if (scope.items.length == itemAdded) {
                $container.isotope({ sortBy: 'date' });
            }
          
            
            
            if (scope.item.new) {
           //     $container.isotope({ sortBy: 'date' });
            }
            tileImage.load(function () {
                
               // $container.isotope('reLayout');
            });
          

        }
    }
});