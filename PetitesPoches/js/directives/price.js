app.directive('price', function () {
    return {
        scope: {
            value: '=',
        },
        template:
          '<div class="pastille-prix">' +
          '<div class="pastille-container">' +
           '<div class="inner-pastille-container">' +
            '<div class="pastille-first-value">' +
                '{{firstValue}}' +
            '</div>' +
            '<div class="pastille-right-part">' +
                '<div class="symbol">' +
                '€' +
                '</div>' +
                 '<div class="second-value">' +
                    '{{secondValue}}' +
                '</div>' +
            '</div>' +
             '</div>' +
        '</div>' +
          '</div>',
        link: function ($scope, elm, attrs) {
            $scope.secondValue = 0;

            $scope.format = function () {
                var value = $scope.value;
                if (!$scope.value || $scope.value.length == 0) {
                    value = 3.90;
                }
                else {
                    value = parseFloat($scope.value.replace(',', '.'))
                }
                $scope.firstValue = Math.floor(value)
                $scope.secondValue = (value % 1).toFixed(2) * 100
               
            };
            //scope.onScroll = function() {
            //    counter++;
            //    console.log(counter);
            //    if (counter % 50 === 0) {
            //        var random = Math.floor(Math.random() * 4) + 1;
            //        if (random == previousRandom) {
            //            if (random == 4){
            //                random = 1;
            //            }
            //            else {
            //                random = random++;
            //            }
            //        }
            //        scope.updateColor(random);
            //        counter = 0;
            //    }
            //};
            //elm.on("scroll", scope.$apply.bind(scope, scope.onScroll));
           
            $scope.format();
        }
    }
});