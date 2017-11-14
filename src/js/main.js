angular.module('SER', [
    'SER.i18n',
    'SER.auth',
    'SER.selector',
    'SER.match',
    'SER.image',
    'SER.search',
    'SER.tooltipster',
    'SER.datepicker',
    'SER.loader',
    'SER.filters',
    'SER.barcode',
    'SER.diff',
    'SER.fullscreen',
    'SER.sentry'
]);

(function (url) {
    // Create a new `Image` instance
    var SerImagePowered = new Image();

    SerImagePowered.onload = function () {
        // Inside here we already have the dimensions of the loaded image
        var style = [
            // Hacky way of forcing image's viewport using `font-size` and `line-height`
            'font-size: 1px;',
            'line-height: ' + this.height + 'px;',

            // Hacky way of forcing a middle/center anchor point for the image
            'padding: ' + this.height * .5 + 'px ' + this.width * .5 + 'px;',

            // Set image dimensions
            'background-size: ' + this.width + 'px ' + this.height + 'px;',

            // Set image URL
            'background: url(' + url + ');'
        ].join(' ');
        
        console.log('');
        console.log('');
        console.log('%c', style);
        console.log('https://www.sersoluciones.com');
        console.log('');
        console.log('');
    };

    // Actually loads the image
    SerImagePowered.src = url;

})('https://s3.amazonaws.com/ser-ui/images/powered.jpg');


//Routes & Http
angular.module('SER').config([
    '$urlRouterProvider',
    '$urlMatcherFactoryProvider',
    '$compileProvider',
    '$resourceProvider',
    '$httpProvider',
    function ($urlRouterProvider, $urlMatcherFactoryProvider, $compileProvider, $resourceProvider, $httpProvider) {

        $httpProvider.defaults.paramSerialize = '$httpParamSerializerJQLike';
        $resourceProvider.defaults.stripTrailingSlashes = true;
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|skype|tel|chrome-extension):/);

        $urlRouterProvider.rule(function ($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = '/' === path[path.length - 1];

            if (hasTrailingSlash) {
                //if last charcter is a slash, return the same url without the slash
                return path.substr(0, path.length - 1);
            }

        });

        var GUID_REGEXP = /^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i;
        $urlMatcherFactoryProvider.type('guid', {
            encode: angular.identity,
            decode: angular.identity,
            is: function (item) {
                return GUID_REGEXP.test(item);
            }
        });

    }
]);

angular.module('SER').run(['$rootScope', '$sce', function ($rootScope, $sce) {

    $rootScope.backHistory = function () {
        $window.history.back();
    };

    $rootScope.__ = __;

    $rootScope.bodyHeight = function () {
        return angular.element('body').height();
    };

    $rootScope.browserWidth = browserWidth;

    $rootScope.trustAsHtml = function (string) {
        return $sce.trustAsHtml(string);
    };

}]);