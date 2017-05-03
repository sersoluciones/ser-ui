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