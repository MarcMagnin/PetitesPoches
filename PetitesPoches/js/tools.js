(function ($) {
    $.fn.hasVerticalScrollBar = function () {
        if (!this.get(0))
            return false;
        return this.get(0).scrollHeight > this.get(0).clientHeight;
    }
})(jQuery);

function delayLoop(collection, index, action) {           //  create a loop function
    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
        action(collection[index]);
        //  your code here
        index++;                     //  increment the counter
        if (index < collection.length) {            //  if the counter < 10, call the loop function
            delayLoop(collection, index, action);             //  ..  again which will trigger another 
        }                        //  ..  setTimeout()
    }, 3)
}


$(document).ready(function () {
    $('body, html').mousewheel(function (event) {

        if (event.deltaY != 0)

            if ($('.modal-backdrop').length == 0) {
                $('#booksContainer').stop().animate({ scrollLeft: '-=' + (400 * event.deltaY) + 'px' }, 200);
            }
            
        //console.log(event.deltaX, event.deltaY, event.deltaFactor);

    });

   
       

    
});
