angular.module('SER.sentry', []);

angular.module('SER.sentry').factory('$exceptionHandler', ['$window', '$log', function ($window, $log) {

    if ($window.Raven && RAVEN_CONFIG_DSN) {
        console.log('Using the RavenJS exception handler.');
        Raven.config(RAVEN_CONFIG_DSN).install();
        return function (exception, cause) {
            Raven.captureException(exception);
            Raven.showReportDialog();
        };
    } else {
        console.log('Using the default logging exception handler.');
        return function (exception, cause) {
            $log.error.apply($log, arguments);
        };
    }

}]);