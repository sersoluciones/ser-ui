﻿angular.module('SER.datepicker', []);

angular.module('SER.datepicker').directive('serDate', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            config: '='
        },
        controller: ['$scope', function ($scope) {

            $scope.placeholder = __('select_date');
            
            $scope.clear = function () {
                $scope.ngModel = null;
            };

        }],
        link: function (scope, element) {

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            });

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                alwaysOpen: true,
                language: 'es',
                singleDate: true,
                singleMonth: true
            }).bind('datepicker-change', function (event, obj) {

                scope.$apply(function () {
                    scope.ngModel = obj.date1;
                });

                element.find('.value-wrapper').tooltipster('close');

            }).bind('datepicker-next-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            }).bind('datepicker-prev-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            });

            if (scope.ngModel) {
                picker_instance.data('dateRangePicker').setStart(scope.ngModel, true);
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    picker_instance.data('dateRangePicker').setStart(newValue, true);
                }
            }, true);

        },
        template: function (element, attr) {

            return '' +
                '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +

                    '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                        '<button type="button" class="bttn value-wrapper">{{ (ngModel | date: \'longDate\') || placeholder }}</button>' +
                        '<button type="button" ng-show="ngModel" class="bttn clear" ng-click="clear()">×</button>' +
                    '</div>' +

                    '<div class="tooltip-templates">' +
                        '<div class="picker-wrapper">' +
                            '<div class="date-wrapper"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    };


}]);

angular.module('SER.datepicker').directive('serDateRange', ['$filter', function ($filter) {

    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            config: '='
        },
        controller: ['$scope', function ($scope) {

            $scope.placeholder = __('select_date_range');

            $scope.clear = function () {
                $scope.ngModel = null;
                $scope.placeholder = __('select_date_range');
            };

        }],
        link: function (scope, element) {

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            });

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                alwaysOpen: true,
                language: 'es'
            }).bind('datepicker-change', function (event, obj) {

                scope.$apply(function () {

                    obj.date1.setHours(0, 0, 0, 0);
                    obj.date2.setHours(23, 59, 59, 0);
                    scope.ngModel = {
                        FromDate: obj.date1,
                        ToDate: obj.date2
                    };

                    scope.placeholder = $filter('date')(obj.date1, 'longDate') + ' - ' + $filter('date')(obj.date2, 'longDate');
                });

                element.find('.value-wrapper').tooltipster('close');

            }).bind('datepicker-next-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            }).bind('datepicker-prev-month-finish-clicked', function (event) {
                element.find('.value-wrapper').tooltipster('reposition');
            });

            if (scope.ngModel && scope.ngModel.FromDate && scope.ngModel.ToDate) {
                picker_instance.data('dateRangePicker').setStart(scope.ngModel.FromDate, true);
                picker_instance.data('dateRangePicker').setEnd(scope.ngModel.ToDate, true);
                scope.placeholder = $filter('date')(scope.ngModel.FromDate, 'longDate') + ' - ' + $filter('date')(scope.ngModel.ToDate, 'longDate');
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (newValue && newValue != oldValue) {
                    picker_instance.data('dateRangePicker').setStart(scope.ngModel.FromDate, true);
                    picker_instance.data('dateRangePicker').setEnd(scope.ngModel.ToDate, true);
                }
            }, true);

        },
        template: function (element, attr) {

            return '' +
                '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +

                    '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                        '<button type="button" class="bttn value-wrapper">{{ placeholder }}</button>' +
                        '<button type="button" ng-show="ngModel" class="bttn clear" ng-click="clear()">×</button>' +
                    '</div>' +

                    '<div class="tooltip-templates">' +
                        '<div class="picker-wrapper">' +
                            '<div class="date-wrapper"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    };


}]);