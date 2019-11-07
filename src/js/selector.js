//TODO actualizar highlighted
angular.module('SER.selector', []).directive('selector', [
    '$rootScope',
    '$filter',
    '$timeout',
    '$window',
    '$http',
    '$q',
    '$templateCache',
    function ($rootScope, $filter, $timeout, $window, $http, $q, $templateCache) {

        return {
            restrict: 'EC',
            replace: true,
            transclude: true,
            scope: {
                value: '=model',
                disabled: '=?disable',
                disableSearch: '=?',
                required: '=?require',
                multiple: '=?multi',
                placeholder: '@?',
                valueAttr: '@',
                labelAttr: '@?',
                options: '=?',
                dropdownClass: '@?',
                limit: '=?',
                rtl: '=?',
                api: '=?',
                change: '&?',
                removeButton: '=?',
                softDelete: '=?',
                closeAfterSelection: '=?'
            },
            link: function (scope, element, attrs, controller, transclude) {
            
                var dropdown = angular.element(element[0].querySelector('.selector-dropdown'));
                var selectInput = angular.element(element[0].querySelector('select'));
                var originParents = element.parents();
                var namespace = 'selector-' + Math.round(Math.random() * 1000000);
                dropdown.attr('id', namespace);

                transclude(scope, function (clone, scope) {
                    var filter = $filter('filter'),
                        input = angular.element(element[0].querySelector('.selector-input input')),
                        inputCtrl = input.controller('ngModel'),
                        selectCtrl = element.find('select').controller('ngModel'),
                        defaults = {
                            api: {},
                            search: '',
                            disableSearch: false,
                            selectedValues: [],
                            highlighted: 0,
                            valueAttr: null,
                            labelAttr: 'label',
                            options: [],
                            limit: Infinity,
                            removeButton: true,
                            closeAfterSelection: true
                        };

                    dropdown.detach();

                    // Default attributes
                    if (!angular.isDefined(scope.value) && scope.multiple) scope.value = [];

                    for (var defaultsKey in defaults) {
                        if (!angular.isDefined(scope[defaultsKey])) scope[defaultsKey] = defaults[defaultsKey];
                    }

                    // Options' utilities
                    scope.getObjValue = function (obj, path) {
                        var key;
                        if (!angular.isDefined(obj) || !angular.isDefined(path)) return obj;
                        path = angular.isArray(path) ? path : path.split('.');
                        key = path.shift();

                        if (key.indexOf('[') > 0) {
                            var match = key.match(/(\w+)\[(\d+)\]/);
                            if (match !== null) {
                                obj = obj[match[1]];
                                key = match[2];
                            }
                        }
                        return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
                    };
                    scope.setObjValue = function (obj, path, value) {
                        var key;
                        if (!angular.isDefined(obj)) obj = {};
                        path = angular.isArray(path) ? path : path.split('.');
                        key = path.shift();

                        if (key.indexOf('[') > 0) {
                            var match = key.match(/(\w+)\[(\d+)\]/);
                            if (match !== null) {
                                obj = obj[match[1]];
                                key = match[2];
                            }
                        }
                        obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
                        return obj;
                    };
                    scope.optionValue = function (option) {
                        return scope.valueAttr === null ? option : scope.getObjValue(option, scope.valueAttr);
                    };
                    scope.optionEquals = function (option, value) {
                        return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
                    };

                    // Value utilities
                    scope.setValue = function (value) {
                        if (!scope.multiple) scope.value = scope.valueAttr === null ? value : scope.getObjValue(value || {}, scope.valueAttr);
                        else scope.value = scope.valueAttr === null ? value || [] : (value || []).map(function (option) { return scope.getObjValue(option, scope.valueAttr); });
                    };
                    scope.hasValue = function () {
                        return hasValue(scope.value);
                    };

                    // Fill with options in the select
                    scope.optionToObject = function (option) {
                        var object = {},
                            element = angular.element(option);

                        angular.forEach(option.dataset, function (value, key) {
                            if (!key.match(/^\$/)) object[key] = value;
                        });
                        if (option.value)
                            scope.setObjValue(object, scope.valueAttr || 'value', option.value);
                        if (element.text())
                            scope.setObjValue(object, scope.labelAttr, element.text().trim());
                        scope.options.push(object);

                        if (element.attr('selected') && (scope.multiple || !scope.hasValue()))
                            if (!scope.multiple) {
                                if (!scope.value) scope.value = scope.optionValue(object);
                            } else {
                                if (!scope.value) scope.value = [];
                                scope.value.push(scope.optionValue(object));
                            }
                    };
                    scope.fillWithHtml = function () {
                        scope.options = [];
                        angular.forEach(clone, function (element) {
                            var tagName = (element.tagName || '').toLowerCase();

                            if (tagName === 'option') scope.optionToObject(element);
                        });
                        scope.updateSelected();
                    };

                    // Initialization
                    scope.initialize = function () {
                        if (!angular.isArray(scope.options) || !scope.options.length)
                            scope.fillWithHtml();
                        if (scope.hasValue()) {
                            if (!scope.multiple) {
                                if (angular.isArray(scope.value)) scope.value = scope.value[0];
                            } else {
                                if (!angular.isArray(scope.value)) scope.value = [scope.value];
                            }
                            scope.updateSelected();
                            scope.filterOptions();
                            scope.updateValue();
                        }
                    };
                    scope.$watch('multiple', function () {
                        $timeout(scope.setInputWidth);
                    });

                    var dropdownPosition = function () {
                        var label = input.parent()[0];
                        var container = angular.element(element[0]);

                        var style = {
                            top: '',
                            bottom: '',
                            left: label.getBoundingClientRect().left + 'px',
                            width: label.offsetWidth + 'px'
                        };

                        if (angular.element(document.body).height() - (label.offsetHeight + label.getBoundingClientRect().top) >= 220) {
                            style.top = label.offsetHeight + label.getBoundingClientRect().top;
                            dropdown.removeClass('ontop');
                            container.removeClass('dropdown-ontop');
                        } else {
                        
                            style.bottom = angular.element(document.body).height() - label.getBoundingClientRect().top;
                            dropdown.addClass('ontop');
                            container.addClass('dropdown-ontop');
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
                        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;
                        scope.isOpen = true;
                        scope.showDropdown();
                        $timeout(scope.scrollToHighlighted);
                    };

                    scope.close = function () {
                        scope.isOpen = false;
                        dropdown.detach();
                        scope.resetInput()
                    };

                    var highlight = function (index) {
                        if (scope.filteredOptions.length)
                            scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                    };

                    var decrementHighlighted = function () {
                        highlight(scope.highlighted - 1);
                    };
                    
                    var incrementHighlighted = function () {
                        highlight(scope.highlighted + 1);
                    };

                    scope.set = function (option) {
                        if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) return;

                        if (!scope.multiple) scope.selectedValues = [option];
                        else {
                            if (!scope.selectedValues)
                                scope.selectedValues = [];
                            if (scope.selectedValues.indexOf(option) < 0)
                                scope.selectedValues.push(option);
                        }
                        if (!scope.multiple && scope.closeAfterSelection) input.blur();
                        highlight(scope.options.indexOf(option));
                        scope.resetInput();
                        selectCtrl.$setDirty();
                    };

                    scope.unset = function (index) {
                        if (!scope.multiple) scope.selectedValues = [];
                        else scope.selectedValues.splice(angular.isDefined(index) ? index : scope.selectedValues.length - 1, 1);
                        scope.resetInput();
                        selectCtrl.$setDirty();
                    };

                    scope.keydown = function (e) {
                        switch (e.keyCode) {
                            case KEYS.up:
                                if (!scope.isOpen) break;
                                decrementHighlighted();
                                e.preventDefault();
                                break;
                            case KEYS.down:
                                if (!scope.isOpen) scope.open();
                                else incrementHighlighted();
                                e.preventDefault();
                                break;
                            case KEYS.escape:
                                highlight(0);
                                scope.close();
                                break;
                            case KEYS.enter:
                                if (scope.isOpen) {
                                    if (scope.filteredOptions.length)
                                        scope.set();
                                    e.preventDefault();
                                }
                                break;
                            case KEYS.backspace:
                                if (!input.val()) {
                                    var search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                    scope.unset();
                                    scope.open();
                                    if (scope.softDelete && !scope.disableSearch)
                                        $timeout(function () {
                                            scope.search = search;
                                        });
                                    e.preventDefault();
                                }
                                break;
                            case KEYS.left:
                            case KEYS.right:
                            case KEYS.shift:
                            case KEYS.ctrl:
                            case KEYS.alt:
                            case KEYS.tab:
                            case KEYS.leftCmd:
                            case KEYS.rightCmd:
                                break;
                            default:
                                if (!scope.multiple && scope.hasValue()) {
                                    e.preventDefault();
                                } else {
                                    scope.open();
                                    highlight(0);
                                }
                                break;
                        }
                    };

                    // Filtered options
                    scope.inOptions = function (options, value) {
                        return options.indexOf(value) >= 0;
                    };

                    scope.filterOptions = function () {
                        scope.filteredOptions = filter(scope.options || [], scope.search);
                        if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
                        if (scope.multiple)
                            scope.filteredOptions = scope.filteredOptions.filter(function (option) {
                                return !scope.inOptions(scope.selectedValues, option);
                            });
                        else {
                            var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                            if (index >= 0) highlight(index);
                        }
                    };

                    // Input width utilities
                    scope.measureWidth = function () {
                        var width,
                            styles = getStyles(input[0]),
                            shadow = angular.element('<span class="selector-shadow"></span>');
                        shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                        angular.element(document.body).append(shadow);
                        angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                            shadow.css(style, styles[style]);
                        });
                        width = shadow[0].offsetWidth;
                        shadow.remove();
                        return width;
                    };

                    scope.setInputWidth = function () {
                        var width = scope.measureWidth() + 1;
                        input.css('width', width + 'px');
                    };

                    scope.resetInput = function () {
                        input.val('');
                        scope.setInputWidth();
                        $timeout(function () { scope.search = ''; });
                    };

                    scope.$watch('[search, options, value]', function () {
                        // hide selected items
                        scope.filterOptions();
                        $timeout(function () {
                            // set input width
                            scope.setInputWidth();
                            // repositionate dropdown
                            if (scope.isOpen) scope.showDropdown();
                        });
                    }, true);

                    // Update value
                    scope.updateValue = function (origin) {
                        if (!angular.isDefined(origin)) origin = scope.selectedValues || [];
                        scope.setValue(!scope.multiple ? origin[0] : origin);
                    };

                    scope.$watch('selectedValues', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateValue();
                        if (angular.isFunction(scope.change))
                            scope.change(scope.multiple
                                ? { newValue: newValue, oldValue: oldValue }
                                : { newValue: (newValue || [])[0], oldValue: (oldValue || [])[0] });
                    }, true);

                    scope.$watchCollection('options', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateSelected();
                    });

                    // Update selected values
                    scope.updateSelected = function () {
                        if (!scope.multiple) scope.selectedValues = (scope.options || []).filter(function (option) { return scope.optionEquals(option); }).slice(0, 1);
                        else
                            scope.selectedValues = (scope.value || []).map(function (value) {
                                return filter(scope.options, function (option) {
                                    return scope.optionEquals(option, value);
                                })[0];
                            }).filter(function (value) { return angular.isDefined(value); }).slice(0, scope.limit);
                    };

                    scope.$watch('value', function (newValue, oldValue) {
                        if (angular.equals(newValue, oldValue)) return;
                        scope.updateSelected();
                    }, true);

                    // DOM event listeners
                    input = angular.element(element[0].querySelector('.selector-input input'))
                        .on('focus', function () {
                            $timeout(function () {
                                scope.$apply(scope.open);
                            });
                        })
                        .on('blur', function () {
                            scope.close();
                        })
                        .on('keydown', function (e) {
                            scope.$apply(function () {
                                scope.keydown(e);
                            });
                        })
                        .on('input', function () {
                            scope.setInputWidth();
                        });

                    dropdown
                        .on('mousedown', function (e) {
                            e.preventDefault();
                        });

                    // scrolling may require the tooltip to be moved or even
                    // repositioned in some cases

                    originParents.each(function (i, parent) {
                        angular.element(parent).on('scroll.' + namespace, function (e) {
                            dropdownPosition();
                        });
                    });

                    // Update select controller
                    scope.$watch(function () { return inputCtrl.$pristine; }, function ($pristine) {
                        selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
                    });

                    scope.$watch(function () { return inputCtrl.$touched; }, function ($touched) {
                        selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
                    });

                    // Expose APIs
                    angular.forEach(['open', 'close'], function (api) {
                        scope.api[api] = scope[api];
                    });

                    scope.api.focus = function () {
                        input[0].focus();
                    };

                    scope.api.set = function (value) {
                        return scope.value = value;
                    };
                    
                    scope.api.unset = function (value) {
                        var values = !value ? scope.selectedValues : (scope.selectedValues || []).filter(function (option) { return scope.optionEquals(option, value); }),
                            indexes =
                                scope.selectedValues.map(function (option, index) {
                                    return scope.inOptions(values, option) ? index : -1;
                                }).filter(function (index) { return index >= 0; });

                        angular.forEach(indexes, function (index, i) {
                            scope.unset(index - i);
                        });
                    };

                    scope.isDirty = function () {
                        return selectInput.hasClass('ng-dirty');
                    };

                    scope.isInvalid = function () {
                        return selectInput.hasClass('ng-invalid');
                    };

                    scope.initialize();
                });

                scope.$on('$destroy', function () {
                    dropdown.remove();
                    dropdown.off('mousedown');
                    angular.element(element[0].querySelector('.selector-input input')).off('focus blur keydown input ');
                    angular.element(document.body).off('resize.' + namespace);
                    originParents.each(function (i, el) {
                        $(el).off('scroll.' + namespace  + ' resize.' + namespace);
                    });
                    // clear the array to prevent memory leaks
                    originParents = null;
                });
            },
            template: function (element, attrs) {

                var viewItemTemplate = $templateCache.get(attrs.viewItemTemplate) ? $templateCache.get(attrs.viewItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                var dropdownItemTemplate;

                if (attrs.labelAttr) {
                    dropdownItemTemplate = '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                } else {
                    dropdownItemTemplate = $templateCache.get(attrs.viewItemTemplate) ? $templateCache.get(attrs.viewItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                }

                if (attrs.dropdownItemTemplate) {
                    dropdownItemTemplate = $templateCache.get(attrs.dropdownItemTemplate) ? $templateCache.get(attrs.dropdownItemTemplate) : '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
                }

                var name = '';

                if (attrs.name) {
                    name = 'name="' + attrs.name + '"';
                }

                var template = $templateCache.get('selector/Base') ? $templateCache.get('selector/Base') : '' +
                    '<div class="selector-container" ng-attr-dir="{{rtl ? \'rtl\' : \'ltr\'}}" ng-class="{open: isOpen, empty: !filteredOptions.length && !search, \'ng-dirty\': isDirty(), \'ng-invalid\': isInvalid(),multiple: multiple, \'has-value\': hasValue(), rtl: rtl, \'remove-button\': removeButton, disabled: disabled}">' +
                        '<select ' + name + ' ng-required="required && !hasValue()" class="not-styled" ng-model="selectedValues" multiple style="display: none;"></select>' +
                        '<label class="selector-input">' +
                            '<ul class="selector-values">' +
                                '<li ng-repeat="(index, option) in selectedValues track by index">' +
                                    '<div>' + viewItemTemplate + '</div>' +
                                    '<div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">' +
                                        '<span class="selector-icon"></span>' +
                                    '</div>' +
                                '</li>' +
                            '</ul>' +
                            '<input ng-model="search" class="selector-search-input not-styled" placeholder="{{!hasValue() ? placeholder : \'\'}}"' +
                                'ng-disabled="disabled" ng-readonly="disableSearch" autocomplete="off">' +
                            '<div ng-if="!multiple" class="selector-helper selector-global-helper" ng-click="!disabled && removeButton && unset()">' +
                                '<span class="selector-icon"></span>' +
                            '</div>' +
                        '</label>' +
                        '<ul md-virtual-repeat-container md-auto-shrink md-top-index="highlighted" class="selector-dropdown ' + attrs.dropdownClass + '">' +
                            '<li md-virtual-repeat="option in filteredOptions" ng-class="{active: highlighted == $index}" class="selector-option" ng-click="set(option)">' + dropdownItemTemplate + '</li>' +
                        '</ul>' +
                    '</div>';

                return template;
            }
        };
    }
]);