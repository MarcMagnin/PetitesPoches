(function ($) {
    $.fn.hasVerticalScrollBar = function () {
        if (!this.get(0))
            return false;
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    }
})(jQuery);

function delayLoop(collection, index, timer, action) {
    var i = 0;
    //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        action(collection[index]);
        index++;

        if (index < collection.length) {            //  if the counter < 10, call the loop function
            delayLoop(collection, index, timer, action);             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
    }, timer)
}


$(document).ready(function () {
    var orientation = "h";
    $('body, html').mousewheel(function (event) {
        if (event.deltaY != 0) {
            if (($('.modal-backdrop') && $('.modal-backdrop').length == 0) && orientation == "h") {
                $('#booksContainer').stop().animate({ scrollLeft: '-=' + (400 * event.deltaY) + 'px' }, 200);
            } else if ($('.modal-backdrop').length == 0 && orientation == "v") {
            //    $('#booksContainer').stop().animate({ scrollLeft: '-=' + (400 * event.deltaX) + 'px' }, 200);
            }
        }
        //console.log(event.deltaX, event.deltaY, event.deltaFactor);

    });
    var colW = 180;
    var maxWidth = 500;
    var orientation;



    var checkMasonryOrientation = function () {
        console.log($('md-tabs').outerHeight()  + $('.menuBar').outerHeight() + $('.filter-terms').outerHeight() +100);
        $('#booksContainer').height($('body').height() - ($('md-tabs').outerHeight() + $('.menuBar').outerHeight() + $('.filter-terms').outerHeight() + 100));


        if ($(window).width() > maxWidth && orientation != "h") {
            orientation = "h"
            var $container = $('.tilesContainer');

            // change layout mode
            $container.isotope({
                layoutMode: 'masonryHorizontal',
                masonry: { rowHeight: 230 },
            });

            // correct a bug where the relayout will prevent a correct redesign of the content
            setTimeout(function () {
                $('#booksContainer').stop().animate({ scrollLeft: '-=' + (1) + 'px' }, 200);
            }, 500);
            
            return;
        } else if ($(window).width() < maxWidth && orientation != "v") {
            orientation = "v";
            var $container = $('.tilesContainer');

            // change layout mode
            $container.isotope({
                layoutMode: 'masonry',

            });

            // correct a bug where the relayout will prevent a correct redesign of the content
            setTimeout(function () {
                $('#booksContainer').stop().animate({ scrollLeft: '-=' + (1) + 'px' }, 200);
            }, 500);
            
        }
        
    }
    $(window).resize(function () {
        checkMasonryOrientation();
    });

    setTimeout(function () {
        checkMasonryOrientation();
    }, 1200)


    //$.Isotope.prototype._getCenteredMasonryColumns = function () {

    //    this.width = this.element.width();

    //    var parentWidth = this.element.parent().width();

    //    var colW = this.options.masonry && this.options.masonry.columnWidth || // i.e. options.masonry && options.masonry.columnWidth

    //    this.$filteredAtoms.outerWidth(true) || // or use the size of the first item

    //    parentWidth; // if there's no items, use size of container

    //    var cols = Math.floor(parentWidth / colW);

    //    cols = Math.max(cols, 1);

    //    this.masonry.cols = cols; // i.e. this.masonry.cols = ....
    //    this.masonry.columnWidth = colW; // i.e. this.masonry.columnWidth = ...
    //};

    //$.Isotope.prototype._masonryReset = function () {

    //    this.masonry = {}; // layout-specific props
    //    this._getCenteredMasonryColumns(); // FIXME shouldn't have to call this again

    //    var i = this.masonry.cols;

    //    this.masonry.colYs = [];
    //    while (i--) {
    //        this.masonry.colYs.push(0);
    //    }
    //};

    //$.Isotope.prototype._masonryResizeChanged = function () {

    //    var prevColCount = this.masonry.cols;

    //    this._getCenteredMasonryColumns(); // get updated colCount
    //    return (this.masonry.cols !== prevColCount);
    //};

    //$.Isotope.prototype._masonryGetContainerSize = function () {

    //    var unusedCols = 0,

    //    i = this.masonry.cols;
    //    while (--i) { // count unused columns
    //        if (this.masonry.colYs[i] !== 0) {
    //            break;
    //        }
    //        unusedCols++;
    //    }

    //    return {
    //        height: Math.max.apply(Math, this.masonry.colYs),
    //        width: (this.masonry.cols - unusedCols) * this.masonry.columnWidth // fit container to columns that have been used;
    //    };
    //};
});
