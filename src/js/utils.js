angular.module('SER.utils', []);

// Key codes
var KEYS = { up: 38, down: 40, left: 37, right: 39, escape: 27, enter: 13, backspace: 8, delete: 46, shift: 16, leftCmd: 91, rightCmd: 93, ctrl: 17, alt: 18, tab: 9 };

function getStyles(element) {
    return !(element instanceof HTMLElement) ? {} :
        element.ownerDocument && element.ownerDocument.defaultView.opener
            ? element.ownerDocument.defaultView.getComputedStyle(element)
            : window.getComputedStyle(element);
}

function arrayGroupBy(array, field) {

    var array_group_by = {};

    for (var index = 0; index < array.length; ++index) {

        if (array_group_by[array[index][field]] === undefined)
            array_group_by[array[index][field]] = [];

        array_group_by[array[index][field]].push(array[index]);
    }

    return array_group_by;
}

function hasValue(value) {
    if (angular.isArray(value)) {
        return 0 < value.length;
    } else if (angular.isObject(value)) {
        return !angular.element.isEmptyObject(value);
    } else {
        return ['', null, undefined, {}].indexOf(value) === -1;
    }
}

function notValue(value) {
    if (angular.isArray(value)) {
        return 0 === value.length;
    } else if (angular.isObject(value)) {
        return angular.element.isEmptyObject(value);
    } else if (angular.isObject(value)) {
        return $.isEmptyObject(value);
    } else {
        return ['', null, undefined, {}, []].indexOf(value) > -1;
    }
}

function hasProperty(obj, key) {
    if (obj){
        return obj.hasOwnProperty(key);
    } else {
        return false;
    }
}

function inArray(value, array) {
    return array ? array.indexOf(value) !== -1 : false;
}

function notInArray(value, array) {
    return array ? array.indexOf(value) === -1 : false;
}

function getObjectByValue(array, attr, value) {

    for (var i = 0; i < array.length; i++) {

        if (array[i].hasOwnProperty(attr)) {

            if (array[i][attr] === value) {

                return array[i];

            } else {

                for (var prop in array[i][attr]) {

                    if (array[i][attr][prop] === value) {

                        return array[i];

                    }

                }

            }

        }

    }
}

function browserWidth() {
    return 0 < window.innerWidth ? window.innerWidth : screen.width;
}

function hasPdfViewer() {
    for (var index = 0; index < window.navigator.plugins.length; index++) {
        if (window.navigator.plugins[index].name.toLowerCase().indexOf("pdf") > -1) {
            return true;
        }
    }

    return false;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onbeforeprint = function () {
    console.log('Functionality to run before printing: ', window.location.href);
};
window.onafterprint = function () {
    console.log('Functionality to run after printing: ', window.location.href);
};

if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
            window.onbeforeprint();
        } else {
            window.onafterprint();
        }
    });
}