app.filter('nospace', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});

app.filter('filterString', function () {
    return function (array) {
        if (!array || array.length == 0)
            return '';
        return array.map(function (val) {
            return 'f-' + val.toLowerCase().replace(/ /g, '');
        }).join(' ');
    };
});
