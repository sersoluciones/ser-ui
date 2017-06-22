angular.module('SER.barcode', []);

angular.module('SER.barcode').directive('barcode', function () {

    return {
        restrict: 'EA',
        scope: {
            model: '=',
            options: '='
        },
        link: function (scope, element, attrs) {
            
            var default_options = {
                format: "CODE128",
                lineColor: "#000000",
                width: 3,
                height: 110,
                displayValue: true
            };

            angular.merge(default_options, scope.options);

            scope.$watch('model', function (new_value) {
                JsBarcode(element[0], new_value, default_options);
            });

        }
    };

});