angular.module('SER.datepicker', []);

angular.module('SER.datepicker').directive('weekDay', function () {
    return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '='
        },
        link: function (scope, element, attrs, controller) {

            scope.toggleDay = function (day) {

                if ('multiple' in attrs) {

                    if (notValue(scope.ngModel)) {
                        scope.ngModel = [];
                    }

                    if (notInArray(day, scope.ngModel)) {
                        scope.ngModel.push(day);
                    } else {
                        scope.ngModel.splice(scope.ngModel.indexOf(day), 1);
                    }

                } else {
                    scope.ngModel = day !== scope.ngModel ? day: null;
                }
                
            }

            scope.isSet = function (day) {
                if ('multiple' in attrs) {
                    return inArray(day, scope.ngModel);
                } else {
                    return day === scope.ngModel;
                }
            }

        },
        template: function () {
            return '' +
                '<div class="wrapper">' +
                '<div class="day" ng-click="toggleDay(1)" ng-class="{active: isSet(1)}">' + __('LUN') + '</div>' +
                '<div class="day" ng-click="toggleDay(2)" ng-class="{active: isSet(2)}">' + __('MAR') + '</div>' +
                '<div class="day" ng-click="toggleDay(3)" ng-class="{active: isSet(3)}">' + __('MIE') + '</div>' +
                '<div class="day" ng-click="toggleDay(4)" ng-class="{active: isSet(4)}">' + __('JUE') + '</div>' +
                '<div class="day" ng-click="toggleDay(5)" ng-class="{active: isSet(5)}">' + __('VIE') + '</div>' +
                '<div class="day" ng-click="toggleDay(6)" ng-class="{active: isSet(6)}">' + __('SAB') + '</div>' +
                '<div class="day" ng-click="toggleDay(7)" ng-class="{active: isSet(7)}">' + __('DOM') + '</div>' +
                '</div>'
        }
    };
});

angular.module('SER.datepicker').directive('serDate', ['$filter', function ($filter) {

	return {
        restrict: 'E',
        require: ['ngModel'],
        scope: {
            ngModel: '=',
            time: '=?',
            endOfDay: '=?',
            remove: '=?',
            disabled: '=?',
            min: '=',
            max: '=',
        },
        controller: ['$scope', function ($scope) {

            $scope.placeholder = __('select_date');
            $scope.remove = $scope.remove ? $scope.remove : false;
            $scope.endOfDay = $scope.endOfDay ? $scope.endOfDay : false;

        }],
        link: function (scope, element, attrs, controller) {

            var formatDate = attrs.formatDate ? attrs.formatDate: 'MMMM D, YYYY';
            var formatTime = attrs.formatTime ? attrs.formatTime: 'hh:mm A';
						
            var setLabelHtml = function (date1) {
                if (hasValue(date1)){
                    
                    if ('time' in attrs) {
                        element.find('.value-wrapper').html(
                            '<span>' + moment(date1).format(formatDate) + '<br>' + moment(date1).format(formatTime) + '</span>'
                        );
                    } else {
                        element.find('.value-wrapper').html(
                            '<span>' + moment(date1).format(formatDate) + '</span>'
                        );
                    }

                } else {
                    element.find('.value-wrapper').html(__('select_date'));
                }
            }

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true,
                functionBefore: function (instance, helper) {
                        element.addClass('ng-focused');
                        element.removeClass('ng-blur');
                        element.triggerHandler('focus');
                },
                functionAfter: function (instance, helper) {
                        element.removeClass('ng-focused');
                        element.addClass('ng-blur');
                        element.triggerHandler('blur');
                }
            });

            var notProcessing = true;
            var clearResizeTimeout;

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                separator: ' - ',
                startOfWeek: 'monday',
                customArrowPrevSymbol: '<i class="icon-left-open-mini"></i>',
                customArrowNextSymbol: '<i class="icon-right-open-mini"></i>',
                alwaysOpen: true,
                highlightToday: false,
                language: currentLanguageUI ? currentLanguageUI: 'es',
                showTopbar: false,
                singleDate: true,
                singleMonth: true,
                monthSelect: true,
                yearSelect: true,
                startDate: hasValue(scope.min) ? moment(scope.min).format('YYYY-MM-DD'): false,
                endDate: hasValue(scope.max) ? moment(scope.max).format('YYYY-MM-DD'): false,
                time: {
                    enabled: 'time' in attrs
                },
                defaultTime: moment()[scope.endOfDay ? 'endOf': 'startOf']('day').toDate()
            }).bind('datepicker-change', function (event, obj) {

                notProcessing = false;

                if (!('time' in attrs)){
                    element.find('.value-wrapper').tooltipster('close');
                }

                controller[0].$setViewValue(obj.date1);

                setLabelHtml(obj.date1);

                setTimeout(function () {
                    notProcessing = true;
                }, 1000);

            }).bind('datepicker-change-month', function (event) {
                clearTimeout(clearResizeTimeout);
                clearResizeTimeout = setTimeout(function () {
                    element.find('.value-wrapper').tooltipster('reposition');
                }, 50);
            });

            if (scope.ngModel) {
                picker_instance.data('dateRangePicker').setStart(scope.ngModel, true);
                setLabelHtml(scope.ngModel);
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (newValue && newValue !== oldValue && notProcessing) {
                    picker_instance.data('dateRangePicker').setStart(newValue, true);
                    setLabelHtml(scope.ngModel);
                }
            }, true);

            scope.clear = function () {
                setLabelHtml();
                controller[0].$setViewValue(null);
                picker_instance.data('dateRangePicker').clear();
            };

        },
        template: function (element, attr) {

                return '' +
                    '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +
                        '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                                '<button type="button" class="bttn value-wrapper">' + __('select_date') + '</button>' +
                                '<button type="button" ng-show="ngModel" class="bttn clear" ng-click="clear()">×</button>' +
                        '</div>' +

                        '<div class="tooltip-templates">' +
                                '<div class="picker-wrapper single">' +
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
            endOfDay: '=?',
            remove: '=?',
            disabled: '=?',
            min: '=',
            max: '=',
        },
        controller: ['$scope', function ($scope) {

        }],
        link: function (scope, element, attrs, controller) {

            var formatDate = attrs.formatDate ? attrs.formatDate: 'MMMM D, YYYY';
            var formatTime = attrs.formatTime ? attrs.formatTime: 'hh:mm A';
						
            var setLabelHtml = function (date1, date2) {
                if (hasValue(date1) && hasValue(date2)){
                    
                    if ('time' in attrs) {
                        element.find('.value-wrapper').html(
                            '<span>' + moment(date1).format(formatDate) + '<br>' + moment(date1).format(formatTime) + '</span>' + 
                            '<div class="separator"></div>' + 
                            '<span>' + moment(date2).format(formatDate) + '<br>' + moment(date2).format(formatTime) + '</span>'
                        );
                    } else {
                        element.find('.value-wrapper').html(
                            '<span>' + moment(date1).format(formatDate) + '</span>' + 
                            '<div class="separator"></div>' + 
                            '<span>' + moment(date2).format(formatDate) + '</span>'
                        );
                    }

                } else {
                    element.find('.value-wrapper').html(__('select_date_range'));
                }
            }

            var tooltip_instance = element.find('.value-wrapper').tooltipster({
                content: element.find('.picker-wrapper'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            });

            var notProcessing = true;
            var clearResizeTimeout;

            var picker_instance = element.find('.date-wrapper').dateRangePicker({
                inline: true,
                container: element.find('.date-wrapper'),
                separator: ' - ',
                startOfWeek: 'monday',
                customArrowPrevSymbol: '<i class="icon-left-open-mini"></i>',
                customArrowNextSymbol: '<i class="icon-right-open-mini"></i>',
                alwaysOpen: true,
                showTopbar: false,
                highlightToday: false,
                language: currentLanguageUI ? currentLanguageUI: 'es',
                monthSelect: true,
                yearSelect: true,
                startDate: hasValue(scope.min) ? moment(scope.min).format('YYYY-MM-DD'): false,
                endDate: hasValue(scope.max) ? moment(scope.max).format('YYYY-MM-DD'): false,
                time: {
                    enabled: 'time' in attrs
                },
                defaultTime: moment().startOf('day').toDate(),
                defaultEndTime: moment().endOf('day').toDate(),
                showShortcuts: true,
                shortcuts :
                {
                    'prev': ['week','month', '6month','year']
                }
            }).bind('datepicker-change', function (event, obj) {

                notProcessing = false;

                if (!('time' in attrs)){
                    element.find('.value-wrapper').tooltipster('close');
                }

                controller[0].$setViewValue({
                    FromDate: obj.date1,
                    ToDate: obj.date2
                });

                setLabelHtml(obj.date1, obj.date2);

                setTimeout(function () {
                    notProcessing = true;
                }, 1000);

            }).bind('datepicker-change-month', function (event) {
                clearTimeout(clearResizeTimeout);
                clearResizeTimeout = setTimeout(function () {
                    element.find('.value-wrapper').tooltipster('reposition');
                }, 50);
            });

            if (scope.ngModel && scope.ngModel.FromDate && scope.ngModel.ToDate) {
                picker_instance.data('dateRangePicker').setDateRange(scope.ngModel.FromDate, scope.ngModel.ToDate);
                setLabelHtml(scope.ngModel.FromDate, scope.ngModel.ToDate);
            }

            scope.$watch('ngModel', function (newValue, oldValue) {
                if (hasValue(newValue) && hasValue(newValue.FromDate) && hasValue(newValue.ToDate) && notProcessing) {
                    picker_instance.data('dateRangePicker').setDateRange(scope.ngModel.FromDate, scope.ngModel.ToDate);
                    setLabelHtml(scope.ngModel.FromDate, scope.ngModel.ToDate);
                }
            }, true);

            scope.clear = function () {
                controller[0].$setViewValue(null);
                picker_instance.data('dateRangePicker').clear();
                setLabelHtml();
            };

        },
        template: function (element, attr) {

            return '' +
                '<div class="ser-date-wrapper" ng-class="{open: open, \'has-value\': blur}">' +

                    '<div ng-class="{\'bttn-group\': ngModel}" class="row center-center">' +
                        '<button type="button" class="bttn value-wrapper">' + __('select_date_range') + '</button>' +
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