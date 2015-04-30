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
            $container = $('.tilesContainer')

            // just add the item to the isotope collection without any layout modification
            //$container.isotope('appended2', elm);
            $container.isotope('appended2', elm);
            if (scope.itemsPool.length == itemAdded) {
                scope.dataReady = true;
    
                console.log(scope.itemsPool.length)
                var delay = 100;
                if (!scope.menuShown) {
                    delay = 500;
                }
                setTimeout(function () {
                    $container.isotope({ sortBy: attrs.sort });
                    TweenMax.to(".tile", 0.2, { opacity: 1 });
                    //$(".tile").click(function () {
                    //    //TweenMax.to(this, 0.5, { opacity: 0, y: -100, ease: Back.easeIn }, 0.1);
                    //    TweenMax.from(this, 2, { scale: 0.3, ease: Elastic.easeOut, force3D: true });
                    //});

                    // correct a bug where the relayout will prevent a correct redesign of the content
                    setTimeout(function () {
                        $('#booksContainer').css('display', 'none');//.stop().animate({ scrollLeft: '+=' + (20) + 'px' }, 200);
                        $('#booksContainer').css('display', 'block')
                    }, 1500);
                    
                    setTimeout(function () {
                        scope.validateFilter();
                    }, 100)
                }, delay)

               
               
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
            var random = 1;
            var previousRandom = 0;
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
                if ($(window).width() <= 699) {
                    return;
                }
                while (random == previousRandom){
                    random = Math.floor(Math.random() * 4) + 1;
                }
                scope.updateColor(random);
            }, 10000);

     
            scope.updateColor(2);
        }
    }
});