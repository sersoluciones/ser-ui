angular.module('SER.diff', []);

angular.module('SER.diff').factory('ObjectDiff', [
    '$sce',
    function objectDiff($sce) {

        var openChar = '{',
            closeChar = '}',
            service = {
                diff: diff,
                getPatchChanges: getPatchChanges
            };

        return service;


        /* service methods */

        /**
         * diff between object a and b
         * @param {Object} a
         * @param {Object} b
         * @param shallow
         * @param isOwn
         * @return {Object}
         */
        function diff(a, b, shallow, isOwn) {

            if (a === b) {
                return equalObj(a);
            }

            var diffValue = {};
            var equal = true;

            for (var key in a) {
                if ((!isOwn && key in b) || (isOwn && typeof b != 'undefined' && b.hasOwnProperty(key))) {
                    if (a[key] === b[key]) {
                        diffValue[key] = equalObj(a[key]);
                    } else {
                        if (!shallow && isValidAttr(a[key], b[key])) {
                            var valueDiff = diff(a[key], b[key], shallow, isOwn);
                            if (valueDiff.changed == 'equal') {
                                diffValue[key] = equalObj(a[key]);
                            } else {
                                equal = false;
                                diffValue[key] = valueDiff;
                            }
                        } else {
                            equal = false;
                            diffValue[key] = {
                                changed: 'primitive change',
                                removed: a[key],
                                added: b[key]
                            }
                        }
                    }
                } else {
                    equal = false;
                    diffValue[key] = {
                        changed: 'removed',
                        value: a[key]
                    }
                }
            }

            for (key in b) {
                if ((!isOwn && !(key in a)) || (isOwn && typeof a != 'undefined' && !a.hasOwnProperty(key))) {
                    equal = false;
                    diffValue[key] = {
                        changed: 'added',
                        value: b[key]
                    }
                }
            }

            if (equal) {
                return equalObj(a);
            } else {
                return {
                    changed: 'object change',
                    value: diffValue
                }
            }
        }


        /**
         * diff between object a and b own properties only
         * @param {Object} a
         * @param {Object} b
         * @return {Object}
         * @param deep
         */
        function getPatchChanges(init_obj, mod_obj, shallow, isOwn) {
            var _mod_obj = angular.fromJson(angular.toJson(mod_obj));
            var _diff = diff(angular.fromJson(angular.toJson(init_obj)), _mod_obj, shallow, isOwn);
            var result = [];

            if (_diff.changed !== 'equal') {
                angular.forEach(_diff.value, function (value, key) {
                    if (value.changed !== 'equal') {
                        result.push({
                            "op": "replace",
                            "path": "/" + key,
                            "value": _mod_obj[key]
                        });
                    }
                });
            }

            return result;

        }

        /**
         * @param obj
         * @returns {{changed: string, value: *}}
         */
        function equalObj(obj) {
            return {
                changed: 'equal',
                value: obj
            }
        }

        /**
         * @param a
         * @param b
         * @returns {*|boolean}
         */
        function isValidAttr(a, b) {
            var typeA = typeof a;
            var typeB = typeof b;
            return (a && b && (typeA == 'object' || typeA == 'function') && (typeB == 'object' || typeB == 'function'));
        }

        /**
         * @param {string} key
         * @return {string}
         */
        function stringifyObjectKey(key) {
            return /^[a-z0-9_$]*$/i.test(key) ?
                key :
                JSON.stringify(key);
        }

        /**
         * @param {string} string
         * @return {string}
         */
        function escapeHTML(string) {
            return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        /**
         * @param {Object} obj
         * @return {string}
         * @param shallow
         */
        function inspect(obj, shallow) {

            return _inspect('', obj, shallow);

            /**
             * @param {string} accumulator
             * @param {object} obj
             * @see http://jsperf.com/continuation-passing-style/3
             * @return {string}
             * @param shallow
             */
            function _inspect(accumulator, obj, shallow) {
                switch (typeof obj) {
                    case 'object':
                        if (!obj) {
                            accumulator += 'null';
                            break;
                        }
                        if (shallow) {
                            accumulator += '[object]';
                            break;
                        }
                        var keys = Object.keys(obj);
                        var length = keys.length;
                        if (length === 0) {
                            accumulator += '<span>' + openChar + closeChar + '</span>';
                        } else {
                            accumulator += '<span>' + openChar + '</span>\n<div class="diff-level">';
                            for (var i = 0; i < length; i++) {
                                var key = keys[i];
                                accumulator = _inspect(accumulator + stringifyObjectKey(escapeHTML(key)) + '<span>: </span>', obj[key]);
                                if (i < length - 1) {
                                    accumulator += '<span>,</span>\n';
                                }
                            }
                            accumulator += '\n</div><span>' + closeChar + '</span>'
                        }
                        break;

                    case 'string':
                        accumulator += JSON.stringify(escapeHTML(obj));
                        break;

                    case 'undefined':
                        accumulator += 'undefined';
                        break;

                    default:
                        accumulator += escapeHTML(String(obj));
                        break;
                }
                return accumulator;
            }
        }
    }

]);