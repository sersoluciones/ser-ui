angular.module('SER.loader', []).service('afterPromises', [
    function () {

        var afterPromises = function (topCount, callbackFunction) {
            this.callback = callbackFunction;
            this.topCount = topCount;
            this.counter = 0;
        };

        afterPromises.prototype.notify = function () {
            this.counter += 1;
            if (this.counter == this.topCount) {
                this.callback();
            }
        };

        return afterPromises;
    }
]);
