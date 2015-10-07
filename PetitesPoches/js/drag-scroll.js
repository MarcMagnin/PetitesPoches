const THRESHOLD = 25; // Distance from either axis before movement in that direction is allowed
//const ENABLE_HORIZ_LOCK = false; // Allow locking to x axis
//const ENABLE_VERT_LOCK = true; // Allow locking to y axis

var dragged = false;
var dragging = false;

$(document).ready(function () {
   
    var el;
    var downX, downY;
    var initialScrollX, initialScrollY;
    var lockX, lockY;
    var previousItem;

    $(window).on('mousedown', function (e) {
        //if ($(e.target).closest('.mix').length) {
        //    previousItem = $(e.target).closest('.mix')[0];
        //    var item = angular.element(previousItem);
        //    console.log(item)
        //    item.bind('click', function (evt) {
        //        console.log("test")
        //        evt.stopPropagation();
        //        evt.preventDefault();
        //    });
        //}
        dragged = false;
        el = document.getElementById('Container');
        downX = e.pageX;
        downY = e.pageY;
        initialScrollX = el.scrollLeft;
        initialScrollY = el.scrollTop;
        dragging = true;
        return false;
    });

    $(window).on('mouseup', function () {
        dragging = false;
    }).on('mousemove', function (e) {
        if (dragging) {
            // Get distance travelled since mousedown
            var distX = e.pageX - downX;
            var distY = e.pageY - downY;
            // Check if we've crossed threshold in either direction
            lockX = lockX && Math.abs(distX) < THRESHOLD;
            lockY = lockY && Math.abs(distY) < THRESHOLD;

            if (Math.abs(distX) > THRESHOLD || Math.abs(distY) > THRESHOLD) {
                dragged = true;
                //// Restrict movement in locked directions unless still in center region
                //if (lockX && !lockY) distX = 0;
                //if (lockY && !lockX) distY = 0;
                // Adjust scroll position
                el.scrollLeft = initialScrollX - distX;
                el.scrollTop = initialScrollY - distY;
            }
               

         
            return false;
        }
    });
});