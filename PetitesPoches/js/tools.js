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
