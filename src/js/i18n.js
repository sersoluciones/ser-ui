var i18n = {
    __DICT: undefined,
    loadJSON: function (locale_json) {
        this.__DICT = locale_json;
    },
    __: function (key) {
        if (typeof this.__DICT !== 'undefined') {

            if (key in this.__DICT) {
                return this.__DICT[key];
            } else {
                console.warn('Locale not found for: ' + key);
                return key;
            }
        } else {
            console.error('Locale JSON file not loaded | Locale not found for: ' + key);
        }

    }
};

var __ = function (key) {
    return i18n.__(key);
};

angular.module('SER.i18n', []);

angular.module('SER.i18n').filter('translate', function () {
    return function (input) {
        return i18n.__(input);
    };
});