angular.module('SER.tooltipster', []);

angular.module('SER.tooltipster').directive('tooltipster', function () {
    return {
        restrict: 'A',
        scope: {
            tooltipsterOptions: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: attrs.tooltipster,
                maxWidth: 300,
                delay: 0,
                contentAsHTML: true,
                positionTracker: true,
                interactive: true,
                trigger: 'hover',
                theme: 'tooltipster-borderless'
            };

            angular.merge(tooltipster_default, scope.tooltipsterOptions);
            element.tooltipster(tooltipster_default);

        }
    };
});

angular.module('SER.tooltipster').directive('tooltipsterMenu', function () {
    return {
        restrict: 'A',
        scope: {
            tooltipsterMenu: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                trigger: 'click',
                theme: 'tooltipster-borderless',
                position: 'bottom',
                positionTracker: true,
                interactive: true
            };

            angular.merge(tooltipster_default, scope.tooltipsterMenu);
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
        scope: {
            tooltipsterHtml: '='
        },
        link: function (scope, element, attrs) {

            var tooltipster_default = {
                content: element.find('.tooltip-content'),
                delay: 0,
                trigger: 'hover',
                theme: 'tooltipster-borderless',
                position: 'top',
                positionTracker: true
            };

            angular.merge(tooltipster_default, scope.tooltipsterHtml);
            element.tooltipster(tooltipster_default);

        }
    };
});