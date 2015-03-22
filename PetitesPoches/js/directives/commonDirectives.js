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
            // $container.isotope('insert', elm);
            // advantage : don't filter
            //$container.isotope('appended', elm
            $container = $('.tilesContainer');

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
          

        }
    }
});

app.directive("bg", function ($window) {
    return {
        link: function (scope, elm, attrs) {
            var counter = 0;
            var previousRandom = 1;
            var previousLayer;
   
            scope.updateColor = function (i) {
                previousRandom = i;
                if (previousLayer)
                    previousLayer.removeClass("on");
                previousLayer = $(".bg-layer.color-" + i);
                previousLayer.addClass("on");
            };

            //scope.onScroll = function() {
            //    counter++;
            //    console.log(counter);
            //    if (counter % 50 === 0) {
            //        var random = Math.floor(Math.random() * 4) + 1;
            //        if (random == previousRandom) {
            //            if (random == 4){
            //                random = 1;
            //            }
            //            else {
            //                random = random++;
            //            }
            //        }
            //        scope.updateColor(random);
            //        counter = 0;
            //    }
            //};
            //elm.on("scroll", scope.$apply.bind(scope, scope.onScroll));
            setInterval(function () {
                var random = Math.floor(Math.random() * 4) + 1;
                if (random == previousRandom) {
                    if (random == 4) {
                        random = 1;
                    }
                    else {
                        random = random++;
                    }
                }
                scope.updateColor(random);
            }, 10000);


            scope.updateColor(1);
        }
    }
});