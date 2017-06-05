angular.module('SER.search', []);

angular.module('SER.search').directive('serAutocomplete', ['$http', '$compile', '$document', function ($http, $compile, $document) {

    return {
        restrict: 'E',
        scope: {
            remoteUrl: '=',
            keyword: '=?',
            keywordField: '@',
            placeholder: '=?',
            disabled: '=?',
            selectItem: '&?'
        },
        controller: ['$scope', function ($scope) {

            if (notValue($scope.placeholder)) {
                $scope.placeholder = __('search') + '...';
            }

            $scope.results = [];
            $scope.focus = false;
            $scope.blur = true;
            $scope.isFetching = false;
            $scope.showResults = false;

            $scope.searchFocus = function () {
                $scope.focus = true;
                $scope.showResults = true;
                $scope.blur = false;
                $document.bind('click', $scope.checkFocus);
            };

            $scope.searchBlur = function () {
                $scope.focus = false;
                $scope.blur = true;
            };

            $scope.selectInternalItem = function (item) {
                if (angular.isFunction($scope.selectItem)) {
                    $scope.selectItem({ newValue: item });
                }

                if (hasValue($scope.keywordField)) {
                    $scope.keyword = item[$scope.keywordField];
                }

                $scope.showResults = false;
            };

            //TODO mejorar deteccion de "Sin resultados"
            $scope.fetch = function () {

                $scope.isFetching = true;
                $scope.showResults = false;

                if ($scope.keyword) {

                    $http.get($scope.remoteUrl + $scope.keyword).then(function (response) {
                        $scope.results = response.data;
                        $scope.isFetching = false;
                        $scope.showResults = true;
                    });
                } else {
                    $scope.isFetching = false;
                    $scope.showResults = true;
                    $scope.results = [];
                }
            };

        }],
        link: function (scope, element) {

            var inputChangedPromise;

            scope.checkFocus = function () {
                var isChild = element[0].contains(event.target);
                var isSelf = element[0] == event.target;
                var isInside = isChild || isSelf;
                if (!isInside) {
                    scope.$apply(function () {
                        scope.showResults = false;
                        $document.unbind('click', scope.checkFocus);
                    });
                }
            };

            element.on('keyup', function (evt) {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }
                inputChangedPromise = setTimeout(function () {
                    scope.$apply(function () {
                        scope.fetch();
                    });
                }, 500);
            });

        },
        template: function (element, attr) {

            function getSpanAddon() {
                var addon = element.find('addon').detach();
                return addon.length ? '<span class="addon">' + addon.html() + '</span>': '';
            }

            function getTemplateTag() {
                var templateTag = element.find('ser-item-template').detach();
                return templateTag.length ? templateTag.html() : element.html();
            }

            function getEmptyTag() {
                var emptyTag = element.find('ser-empty-template').detach();
                return emptyTag.length ? emptyTag.html() : '<div class="align-center">' + __('no_results') + '</div>';
            }

            //TODO usar virtual-repeat
            return '' +
                '<div class="ser-autocomplete-wrapper" ng-class="{focus: focus, blur: blur}">' +

                    '<div class="input-group">' +
                        getSpanAddon() +
                        '<input placeholder="{{placeholder}}" ng-model="keyword" ng-disabled="disabled" ng-focus="searchFocus()" ng-blur="searchBlur()" />' +
                    '</div>' +

                    '<div class="fetching line-loader" ng-show="isFetching"></div>' +

                    '<div class="results" ng-show="showResults">' +
                        '<div class="item" ng-repeat="item in results" ng-click="selectInternalItem(item)">' + getTemplateTag() + '</div>' +

                        '<div class="not-results" ng-if="(results.length == 0) && keyword">' +
                            getEmptyTag() +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    };

    
}]);