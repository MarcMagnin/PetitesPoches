var itemAdded = 0;
app.directive("isotopethis", function () {
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

app.directive("bg", function ($window) {
    return {
        link: function (scope, elm, attrs) {
            var counter = 0;
            var previousLayer;
   
            scope.updateColor = function (i) {
                if (previousLayer)
                    previousLayer.removeClass("on");
                previousLayer = $(".bg-layer.color-" + i);
                previousLayer.addClass("on");
                console.log(previousLayer);
            };

            scope.onScroll = function() {
                counter++;
                if (counter % 15 === 0) {
                    scope.updateColor(Math.floor(Math.random() * 4) + 1);
                    counter = 0;
                }
            };

            angular.element($window).on("scroll", scope.$apply.bind(scope, scope.onScroll));

            
          
        }
    }
});