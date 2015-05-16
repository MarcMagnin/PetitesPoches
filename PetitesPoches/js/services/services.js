app.factory('livreService', function ($http, $log, $q, $rootScope) {
    return {
        getLivres: function() {
            return $http.get($rootScope.apiRootUrl + '/indexes/Livres?start=0&pageSize=250&sort=-datePublication&_=' + Date.now())
            .then(
             function (response) { return response.data.Results},
             function (httpError) {
                 throw httpError.status + " : " + 
                       httpError.data;
             });
        }
    }
});

app.factory('auteurService', function ($http, $log, $rootScope) {
    return {
        getAuteurs: function () {

            return $http.get($rootScope.apiRootUrl + '/indexes/Auteur?start=0&pageSize=200&sort=Nom&_=' + Date.now())
            .then(
             function (response) { return response.data.Results },
             function (httpError) {
                 throw httpError.status + " : " +
                       httpError.data;
             });
        }
    }
});



app.factory('contactService', function ($http, $log, $rootScope) {
    return {
        getContacts: function () {

            return $http.get($rootScope.apiRootUrl + '/docs/contact?start=0&pageSize=1&_=' + Date.now())
            .then(
             function (response) { return response.data },
             function (httpError) {
                 throw httpError.status + " : " +
                       httpError.data;
             });
        }
    }
});