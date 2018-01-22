angular.module('SER.Clipboard', []);

angular.module('SER.Clipboard').service('CopyToClipboard', ['$window', function ($window) {
    var body = angular.element($window.document.body);
    var textarea = angular.element('<textarea/>');
    textarea.css({
        position: 'fixed',
        opacity: '0'
    });

    return function (toCopy, ShowAlert) {
        textarea.val(toCopy);
        body.append(textarea);
        textarea[0].select();

        try {
            var successful = document.execCommand('copy');
            if (!successful) throw successful;
            if (ShowAlert) alert(__('copy_success_clipboard'));
        } catch (err) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
        }

        textarea.remove();
    }
}]);

angular.module('SER.Clipboard').directive('serClickCopy', ['CopyToClipboard', function (CopyToClipboard) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function (e) {
                CopyToClipboard(attrs.serClickCopy, true);
            });
        }
    }
}]);