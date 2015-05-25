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
            return 'f-' + val.toLowerCase().replace(/[^\w\s-]/g, '').replace(/ /g, '');
        }).join(' ');
    };
});

app.filter('dateCleaner', function () {
    return function (date) {
        return moment(date).format('DD/MM/YYYY');
    };
});



app.filter('dateTicks', function () {
    return function (date) {
        return moment(date).valueOf();
    };
});


