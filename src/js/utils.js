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
    } else if (angular.isDate(value)) {
        return true;
    } else if (angular.isObject(value)) {
        return !angular.element.isEmptyObject(value);
    } else {
        return ['', null, undefined, NaN].indexOf(value) === -1;
    }
}

function notValue(value) {
    if (angular.isArray(value)) {
        return 0 === value.length;
    } else if (angular.isDate(value)) {
        return false;
    } else if (angular.isObject(value)) {
        return angular.element.isEmptyObject(value);
    } else {
        return ['', null, undefined, NaN].indexOf(value) > -1;
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

function getObjIndexByValue(array, attr, value) {

    for (var i = 0; i < array.length; i++) {

        if (array[i].hasOwnProperty(attr)) {

            if (array[i][attr] === value) {

                return array[i];

            } else {

                for (var prop in array[i][attr]) {

                    if (array[i][attr][prop] === value) {

                        return i;

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

function hasFiles(Files) {
    
    var result = false;

    var isFile = function (file) {
        return file != null && (file instanceof window.Blob || (file.flashId && file.name && file.size));
    };

    for (var key in Files) {
        if (isFile(Files[key])) {
            result = true;
            break;
        }
    }

    return result;

}

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
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

function getLogo(name, version) {

    if (typeof name === 'string') {

        switch (name.toLowerCase().replace(/[0-9\. ]*/g, '')) {

            // Browser
            case 'chrome':
            case 'chromium':
                return AWS_S3_URL + 'images/logos/chrome.svg';
            case 'edge':
                return AWS_S3_URL + 'images/logos/edge.svg';
            case 'firefox':
                return AWS_S3_URL + 'images/logos/firefox.svg';
            case 'ie':
            case 'iemobile':
                return AWS_S3_URL + 'images/logos/ie.svg';
            case 'opera':
                return AWS_S3_URL + 'images/logos/opera.svg';
            case 'safari':
            case 'mobilesafari':
                return AWS_S3_URL + 'images/logos/safari.svg';
            case 'webkit':
                return AWS_S3_URL + 'images/logos/webkit.svg';

            // OS
            case 'android':
                return AWS_S3_URL + 'images/logos/android.svg';
            case 'ios':
            case 'macos':
                return AWS_S3_URL + 'images/logos/apple.svg';
            case 'debian':
                return AWS_S3_URL + 'images/logos/debian.svg';
            case 'linux':
                return AWS_S3_URL + 'images/logos/linux.svg';
            case 'ubuntu':
                return AWS_S3_URL + 'images/logos/ubuntu.svg';
            case 'windows':
                switch (version.toLowerCase()) {
                    case 'xp':
                    case '7':
                        return AWS_S3_URL + 'images/logos/windows-xp.svg';
                    case '8':
                    case '8.1':
                    case '10':
                        return AWS_S3_URL + 'images/logos/windows.svg';
                }
                break;
            case 'windowsphone':
                return AWS_S3_URL + 'images/logos/windows-phone.svg';
        }
    }
}