angular.module('SER.chip', []);

angular.module('SER.chip').directive('serChips', ['$document', function ($document) {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            pattern: '=?'
        },
        link: function (scope, element, attrs, controller) {

            var regex = scope.pattern ? new RegExp(scope.pattern) : new RegExp(/^[\w\d].*$/);
            var input = element.find('input.chip-input');
            var formCtrl = element.find('select').controller('ngModel');

            if (notValue(scope.model)) {
                scope.model = [];
                scope.selectedValue = [];
            } else {
                formCtrl.$setViewValue(scope.model);
                formCtrl.$setDirty(true);
            }

            scope.addChip = function () {

                if (notValue(scope.model)) {
                    scope.model = [];
                }

                if (scope.chipInput) {
                    if (notInArray(scope.chipInput, scope.model) && regex.test(scope.chipInput)) {
                        scope.model.push(scope.chipInput);
                        formCtrl.$setViewValue(scope.model);
                        formCtrl.$validate();
                        formCtrl.$setDirty(true);
                    }

                    scope.chipInput = null;
                }

            };

            scope.removeChip = function (index) {
                scope.model.splice(index, 1);
                formCtrl.$setViewValue(scope.model);
                formCtrl.$validate();
            };

            scope.setFocus = function () {
                element.addClass('ng-focused');
                element.removeClass('ng-blur');
            };

            scope.setBlur = function () {
                element.addClass('ng-blur');
                element.removeClass('ng-focused');
                scope.addChip();
            };

            scope.checkKeypress = function (ev) {
                switch (ev.keyCode) {

                    case KEYS.backspace:
                        if (notValue(scope.chipInput) && hasValue(scope.model)) {
                            scope.removeChip(scope.model.length - 1);
                        }

                        break;

                    case KEYS.enter:
                        scope.addChip();
                        break;

                    default:

                }
            };

            //$scope.$watch('$destroy', function () {
            //    $document.unbind('click', $scope.checkFocus);
            //});

        },
        template: function (element, attrs) {

            var name = '';

            if (attrs.name) {
                name = 'name="' + attrs.name + '"';
            }

            return '<div class="chip" ng-repeat="chip in model track by $index">{{chip}}<md-icon class="remove" ng-click="removeChip($index)">close</md-icon></div> \
                <input class="chip-input not-styled s-flex" ng-model="chipInput" ng-keydown="checkKeypress($event)" ng-focus="setFocus()" ng-blur="setBlur()" /> \
                <select ' + name + ' style="display: none;" multiple ng-model="selectedValue" ' + (('required' in attrs) ? 'required': '') + ' ></select>';
        }
    };
}]);