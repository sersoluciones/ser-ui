angular.module('SER.search', []);

angular.module('SER.search').directive('serAutocomplete', ['$http', '$timeout', function ($http, $timeout) {
    
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            remoteUrl: '=',
            keywordField: '@',
            ngRequired: '=?',
            ngDisabled: '=?',
            selectItem: '&?',
            dropdownClass: '@?',
        },
        link: function (scope, element, attrs, controller, transclude) {

            var inputChangedPromise, input;
            var dropdown = angular.element(element[0].querySelector('.ser-autocomplete-results'));
            var originParents = element.parents();
            var namespace = 'autocomplete-results-' + Math.round(Math.random() * 1000000);
            dropdown.attr('id', namespace);
            dropdown.detach();

            scope.results = [];
            scope.isFetching = false;

            scope.selectInternalItem = function (item) {
                if (angular.isFunction(scope.selectItem)) {
                    scope.selectItem({ newValue: item });
                }

                if (hasValue(scope.keywordField)) {
                    scope.ngModel = item[scope.keywordField];
                }

                scope.close();
            };

            var dropdownPosition = function () {
                var label = element[0];

                var style = {
                    top: '',
                    bottom: '',
                    left: label.getBoundingClientRect().left + 'px',
                    width: label.offsetWidth + 'px'
                };

                if (angular.element(document.body).height() - (label.offsetHeight + label.getBoundingClientRect().top) >= 220) {
                    style.top = label.offsetHeight + label.getBoundingClientRect().top;
                    dropdown.removeClass('ontop');
                } else {

                    style.bottom = angular.element(document.body).height() - label.getBoundingClientRect().top;
                    dropdown.addClass('ontop');
                }

                dropdown.css(style);
            };

            // Dropdown utilities
            scope.showDropdown = function () {
                dropdownPosition();
                angular.element(document.body).append(dropdown);

                $timeout(function () {
                    angular.element(window).triggerHandler('resize');
                }, 50);
            };

            scope.open = function () {
                scope.isOpen = true;
                scope.showDropdown();
            };

            scope.close = function () {
                scope.isOpen = false;
                dropdown.detach();
            };

            originParents.each(function (i, parent) {
                angular.element(parent).on('scroll.' + namespace, function (e) {
                    dropdownPosition();
                });
            });

            var keyup = function (evt) {
                if (inputChangedPromise) {
                    clearTimeout(inputChangedPromise);
                }

                inputChangedPromise = setTimeout(function () {
                    scope.$apply(function () {
                        scope.isFetching = true;
                        scope.results = [];
                        scope.close();

                        if (scope.ngModel) {
                            $http.get(scope.remoteUrl + scope.ngModel).then(function (response) {

                                scope.results = response.data;
                                scope.isFetching = false;
                                if (hasValue(scope.results)) {
                                    scope.open();
                                }

                            });
                        } else {
                            scope.isFetching = false;
                            scope.close();
                        }
                    });
                }, 500);
            };

            input = angular.element(element[0].querySelector('.ser-autocomplete-wrapper input'))
                .on('focus', function () {
                    if (hasValue(scope.results)) {
                        $timeout(function () {
                            scope.open();
                        });
                    }
                })
                .on('blur', function () {
                    scope.close();
                })
                .on('keyup', function (e) {
                    keyup(e);
                });

            dropdown
                .on('mousedown', function (e) {
                    e.preventDefault();
                });

        },
        template: function (element, attrs) {

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
                '<div class="ser-autocomplete-wrapper" ng-class="{open: isOpen}">' +

                    '<div class="input-group">' +
                        getSpanAddon() +
                        '<input placeholder="{{placeholder}}" ' + (attrs.name ? 'name="' + attrs.name + '"' : '') + ' ng-model="ngModel" ' + (attrs.disabled ? 'disabled' : 'ng-disabled="ngDisabled"') + ' ng-focus="ngFocus" ng-blur="searchBlur()" ' + (attrs.required ? 'required' : 'ng-required="ngRequired"') + ' />' +
                    '</div>' +

                    '<div class="fetching line-loader" ng-show="isFetching"></div>' +
                
                    '<ul md-virtual-repeat-container md-auto-shrink md-top-index="highlighted" class="ser-autocomplete-results ' + attrs.dropdownClass + '">' +
                        '<li class="item" md-virtual-repeat="item in results" ' + (attrs.mdItemSize ? 'md-item-size="' + attrs.mdItemSize + '"' : '') + ' ng-click="selectInternalItem(item)">' + getTemplateTag() + '</li>' +
                    '</ul>' +
                '</div>';
        }
    };
    
}]);