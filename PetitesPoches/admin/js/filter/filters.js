app.filter('orderByDisplayOrder', function () {
    return function (obj, scope) {
        //scope.letters;
        var array = [];
        Object.keys(obj).forEach(function (key) {
            var firstLetter = obj[key].Nom.charAt(0).toUpperCase();
            if (array.indexOf(firstLetter) == -1) {
                array.push(firstLetter);
            }
        });
       
        return array;
    }
});