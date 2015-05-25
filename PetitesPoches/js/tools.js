(function ($) {
    $.fn.hasVerticalScrollBar = function () {
        if (!this.get(0))
            return false;
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    }
})(jQuery);

function sortByDate(a, b) {
    var aVal = Date.parse(a.datePublication);
    var bVal = Date.parse(b.datePublication);
    return ((aVal < bVal) ? -1 : ((aVal > bVal) ? 1 : 0));
}

function delayLoop(collection, index, timer, action) {
    var i = 0;
    if (collection.length == 0)
        return;
    //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        action(collection[index]);
        index++;
        if (index % 26 == 0) {
            timer = 300;
        } else {
            timer = 0;
        }
        if (index < collection.length) {            //  if the counter < 10, call the loop function
            delayLoop(collection, index, timer, action);             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
    }, timer)
}


function cleanString(string) {
    return (string.replace(/[^\w\s-]/gi, '').toLowerCase().replace(/ /g, '') || "");
}

$(document).ready(function () {
    var orientation = "h";
    $('body, html').mousewheel(function (event) {
        var container = $('#Container');
        if (event.deltaY != 0) {
            // prevent scroll of content when select control is open
            if ($('.md-select-backdrop') && $('.md-select-backdrop').length != 0) {
                return;
            }
            if (($('.modal-backdrop') && $('.modal-backdrop').length == 0) && orientation == "h") {
                //$('#Container').scrollLeft($('#Container')container.scrollLeft() - (event.deltaY * 60));
                //TweenMax.to(container, 0.2, {
                //    scrollTo: {
                //        y:0,
                //        x: 400,
                //        autoKill: true
                //    }, ease: Power2.easeOut
                //});
              //  TweenLite.to(container, 0.4, { scrollTo: { x: container.scrollLeft() - (event.deltaY * 200), autoKill: true }, ease: Power4.easeOut })

                container.stop().animate({ scrollLeft: '-=' + (400 * event.deltaY) + 'px' }, 200);
                //TweenMax.to(container, 0.2, { scrollLeft: container.scrollLeft() - (event.deltaY * 300), ease: Linear.ease });
               
            }
            //else if ($('.modal-backdrop').length == 0 && orientation == "v") {
            ////    $('#booksContainer').stop().animate({ scrollLeft: '-=' + (400 * event.deltaX) + 'px' }, 200);
            //}
        }

    });
    var colW = 180;
    var maxWidth = 592;
    var orientation;


    
    var checkMasonryOrientation = function () {

        if ($(window).width() > maxWidth && orientation != "h") {
            orientation = "h"
        } else if ($(window).width() < maxWidth && orientation != "v") {
            orientation = "v";
        }
        if ($('#Container').mixItUp('isLoaded')) {
            if ($(window).width() < 1000) {
                $('#Container').mixItUp('setOptions', {
                    animation: {
                        enable: false
                    },
                });
            } else {
                $('#Container').mixItUp('setOptions', {
                    animation: {
                        enable: true
                    },
                });
            }
        }
    }
    $(window).resize(function () {
        checkMasonryOrientation();
    });

    setTimeout(function () {
        checkMasonryOrientation();
    }, 500)
});
