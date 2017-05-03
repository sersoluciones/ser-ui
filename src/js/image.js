angular.module('SER.image', []);

angular.module('SER.image').directive('callbackImage', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            element.on('dragstart', function (event) { event.preventDefault(); });

            element.bind('error', function () {
                element[0].src = attrs.callbackImage;
            });

        }
    };
});

angular.module('SER.image').directive('retryGetImage', function () {
    return {
        restrict: 'A',
        scope: {
            retryGetImage: '@',
            fallbackRetry: '='
        },
        link: function (scope, element, attrs) {

            var timeout;

            function retry() {
                timeout = setTimeout(function () {
                    element[0].src = scope.retryGetImage;
                }, 5000);
            }

            scope.$watch('retryGetImage', function (new_value) {

                clearTimeout(timeout);
                element.unbind('load');
                element.unbind('error');
                element[0].src = new_value;
                element.addClass('hidden');

                element.bind('load', function () {
                    element.removeClass('hidden');
                    scope.fallbackRetry = false;
                    clearTimeout(timeout);
                    scope.$apply();
                });

                element.bind('error', function () {
                    scope.fallbackRetry = true;
                    retry();
                });
            });

        }
    };
});

angular.module('SER.image').directive('imgZoom', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            options: '='
        },
        link: function (scope, element, attrs) {

            element.find('.target').on('load', function () {
                element.find('.loader').addClass('ng-hide');
            });

            element.find('.target').on('error', function () {
                element.find('.loader').addClass('ng-hide');
                scope.zoomReset();
            });

            scope.size = 'auto';

            var defaults = {
                'max-height': 'none'
            };

            angular.merge(defaults, scope.options);
            //var clicked = false, clickY;
            //$(element).on({
            //    'mousemove': function (e) {
            //        clicked && updateScrollPos(e);
            //    },
            //    'mousedown': function (e) {
            //        clicked = true;
            //        clickY = e.pageY;
            //    },
            //    'mouseup': function () {
            //        clicked = false;
            //    }
            //});

            //var updateScrollPos = function (e) {
            //    $(element).css('cursor', 'row-resize');
            //    $(element).scrollTop($(element).scrollTop() + (clickY - e.pageY));
            //}

            scope.zoomIn = function () {
                scope.size = element.find('.target').width() * 1.1;
                element.find('.target').css({
                    'max-height': 'none',
                    height: 'auto'
                });
            };

            scope.zoomOut = function () {
                scope.size = element.find('.target').width() / 1.1;
                element.find('.target').css({
                    'max-height': 'none',
                    height: 'auto'
                });
            };

            scope.zoomReset = function () {
                scope.size = 'auto';
                element.find('.target').css({
                    'max-height': defaults['max-height'],
                    height: 'auto'
                });
            };

            scope.zoomExpand = function () {
                scope.size = 'auto';
                element.find('.target').css({
                    'max-height': defaults['max-height'],
                    height: element.height() - 2
                });
            };

            $timeout(function () {
                scope.zoomExpand();
            }, 500);
        },
        template: function () {
            return '' +
                '<div class="controls">' +
                    '<button class="icon" ng-click="zoomOut()"><i class="icon-zoom-out"></i></button>' +
                    '<button class="icon" ng-click="zoomReset()"><i class="icon-zoom-actual"></i></button>' +
                    '<button class="icon" ng-click="zoomExpand()"><i class="icon-zoom-expand"></i></button>' +
                    '<button class="icon" ng-click="zoomIn()"><i class="icon-zoom-in"></i></button>' +
                '</div>' +
                '<div class="loader dots">' + __('loading') + '</div>' +
                '<img class="target" ng-src="{{ image }}" ng-style="{width: size}" callback-image="/images/' + __("no_image_available.svg") + '" />';
        }
    };
}]);

angular.module('SER.image').directive('zoomImage', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var defaultValues = {
                responsive: true,
                loadingIcon: true,
                tint: true,
                scrollZoom: true,
                zoomWindowWidth: 150,
                zoomWindowHeight: 150,
                imageSrc: attrs.ngSrc
            };

            angular.merge(defaultValues, scope.$eval(attrs.zoomImage));

            element.elevateZoom(defaultValues);

        }
    };
});