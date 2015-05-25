
app.controller("contactController", function ($scope, $rootScope, $http, contactService) {
    $scope.items = "";
    $scope.showPastilleContact = false;
    $scope.init = function () {
        $(".contact pre").click(function () {
            //TweenMax.to(this, 0.5, { opacity: 0, y: -100, ease: Back.easeIn }, 0.1);
            TweenMax.fromTo(this, 1, { scale: 0.95, opacity: 0.5, ease: Elastic.easeOut, force3D: true }, { scale: 1, opacity: 1, ease: Elastic.easeOut, force3D: true });
        });
      
        TweenMax.to(".progressIndicator", 0.2, { opacity: 1, display: "block" });

        //itemAdded = 0;
        contactService.getContacts()
            .then(function (contact) {
                $scope.items = contact
                TweenMax.fromTo(".contact pre", 0.6, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, ease: Quart.easeOut, onComplete:function(){
                    $scope.showPastilleContact = true;
                    $scope.$apply();
                }, force3D: true, delay: 0.3  } );
                TweenMax.to(".progressIndicator", 0.2, { opacity: 0, display: "none"});
            })
    };
});