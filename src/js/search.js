angular.module('SER.search').directive('remoteSearch', ['$http', function search($http) {

    return {
        restrict: 'A',
        require: ['ngModel'],
        scope: {
            remoteSearchResults: '=',
            remoteSearch: '=',
            model: '=ngModel'
        },
        link: function (scope, elem, attrs, ngModel) {

            var inputChangedPromise;

            var fetch = function () {

                scope.$apply(function () {
                    scope.remoteSearchResults = [];
                });
                
                if (scope.model) {
                    $http.get(scope.remoteSearch + scope.model).then(function (response) {
                        if (0 < response.data.length) {
                            scope.remoteSearchResults = response.data;
                        }
                    });
                }
            };

            elem.on('keyup', function (evt) {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }
                inputChangedPromise = setTimeout(function () {
                    fetch();
                }, 500);
            });

        }
    };

    
}]);

angular.module('SER.search').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind('keydown keypress', function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, { $event: event });
                });
                event.preventDefault();
                element.blur();
            }
        });
    };
});

angular.module('SER.search').directive('finishTyping', function search() {

    return {
        restrict: 'A',
        require: ['ngModel'],
        scope: {
            fetch: '='
        },
        link: function (scope, elem) {

            var inputChangedPromise;

            elem.on('keyup', function () {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }
                inputChangedPromise = setTimeout(function () {
                    scope.fetch();
                }, 500);
            });

        }
    };
  
});

//angular.module('SER.search').directive('highlightText', ['$interpolate', '$parse', function search($interpolate, $parse) {
//    return {
//        terminal: true,
//        controller: 'MdHighlightCtrl',
//        compile: function mdHighlightCompile(tElement, tAttr) {
//            var termExpr = $parse(tAttr.mdHighlightText);
//            var unsafeContentExpr = $interpolate(tElement.html());

//            return function mdHighlightLink(scope, element, attr, ctrl) {
//                ctrl.init(termExpr, unsafeContentExpr);
//            };
//        }
//    };
//}]);