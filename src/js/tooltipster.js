angular.module('SER.tooltipster', []);

angular.module('SER.tooltipster').directive('tooltipster', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: attrs.tooltipster,
                maxWidth: 300,
                delay: 0,
                contentAsHTML: true,
                positionTracker: true,
                trigger: 'hover',
                theme: 'tooltipster-borderless'
            };

            angular.merge(tooltipster_default, scope.$eval(attrs.tooltipsterOptions));
            element.tooltipster(tooltipster_default);

        }
    };
});

angular.module('SER.tooltipster').directive('tooltipsterMenu', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                positionTracker: true,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                interactive: true
            };

            angular.merge(tooltipster_default, scope.$eval(attrs.tooltipsterMenu));
            element.tooltipster(tooltipster_default);

            scope.closeTooltip = function () {
                element.tooltipster('close');
            };

            element.find('.action').on('click', function () {
                scope.closeTooltip();
            });

        }
    };
});

angular.module('SER.tooltipster').directive('tooltipsterHtml', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                positionTracker: true,
                trigger: 'hover',
                theme: 'tooltipster-borderless',
                position: 'top'
            };

            angular.merge(tooltipster_default, scope.$eval(attrs.tooltipsterHtml));
            element.tooltipster(tooltipster_default);

        }
    };
});