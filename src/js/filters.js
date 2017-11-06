angular.module('SER.filters', []);

angular.module('SER.filters').filter('PascalCase', [function () {
    return function (input) {

        return input
            // Look for long acronyms and filter out the last letter
            .replace(/([A-Z]+)([A-Z])/g, ' $1 $2')
            // Look for lower-case letters followed by upper-case letters
            .replace(/([a-z\d])([A-Z])/g, '$1 $2')
            // Look for lower-case letters followed by numbers
            .replace(/([a-zA-Z])(\d)/g, '$1 $2')
            .replace(/^./, function (str) { return str.toUpperCase(); })
            // Remove any white space left around the word
            .trim();
    };
}]);

angular.module('SER.filters').filter('getItem', ['$filter', function ($filter) {
    return function (input, array, field) {
        var fields = {};
        fields[field] = input;
        var resultArray = [];
        resultArray = $filter('filter')(array, fields, true);
        if (hasValue(resultArray) && 0 < resultArray.length) return resultArray[0];
        return null;
    };
}]);

angular.module('SER.filters').filter('minutesTime', [function () {
    /**
     * input should be a number of minutes to be parsed
     * @param {input} number of minutes
     * @param {type} true = 00:00:00 | false = 00:00 am or pm
     */
    return function (input, type) {
        var
            hours = parseInt(input / 60, 10),
            minutes = (input - (hours * 60)) < 10 ? '0' + (input - (hours * 60)) : input - (hours * 60),
            meridian = type ? ':00' : (hours >= 12 && hours !== 24 ? ' pm' : ' am');

        return (!type && hours > 12 ? (hours === 24 ? '00' : (hours - 12 < 10 ? '0' : '') + (hours - 12)) : (hours < 10 ? '0' : '') + hours) + ':' + minutes + meridian;
    };
}]);

angular.module('SER.filters').filter('timeMinutes', [function () {

    return function (input) {
        return (parseInt(input.split(':')[0]) * 60) + parseInt(input.split(':')[1]);
    };

}]);

angular.module('SER.filters').filter('leadingChar', function () {
    return function (input, width, char) {
        char = char || '0';
        if (hasValue(input)) {
            input = input + '';
            return input.length >= width ? input : new Array(width - input.length + 1).join(char) + input;
        } else {
            return '';
        }
    };
});