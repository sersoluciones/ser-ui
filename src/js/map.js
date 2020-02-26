angular.module('SER.map', []);

angular.module('SER.map').service('mapFunctions', [
    function () {

        return {
            getCurrentPosition: function () {

                var defered = $q.defer();
                var promise = defered.promise;

                if ($window.navigator && $window.navigator.geolocation) {
                    $window.navigator.geolocation.getCurrentPosition(function (position) {
                        defered.resolve({
                            Latitude: position.coords.latitude,
                            Longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    }, function () {
                        defered.reject();
                    });
                } else {
                    defered.reject();
                }

                return promise;
            },
            checkLatLog: function (Latitude, Longitude) {
                return (-90 <= Latitude) && (90 >= Latitude) && (-180 <= Longitude) && (180 >= Longitude);
            },
            distancePoints: function (lon1, lat1, lon2, lat2) {
                var a = Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) * Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2);
                return (6371 * (2 * Math.asin(Math.sqrt(a)))) * 1.60934;
            },
            cutPrecision: function (obj, e) {
                if ('number' === typeof obj[0]) {
                    for (var i = 0; i < obj.length; i++) obj[i] = Math.round(obj[i] * e) / e;
                } else {
                    var arr = obj.features || obj.geometries || obj.coordinates || obj;
                    for (var i = 0; i < arr.length; i++) this.cutPrecision(arr[i], e);
                }
            },
            middlePoint: function (options) {

                var optionsSrc = {
                    From: {
                        Lat: 0,
                        longitude: 0
                    },
                    To: {
                        Lat: 0,
                        longitude: 0
                    }
                };
        
                angular.merge(optionsSrc, options);
        
                if ((optionsSrc.From.longitude != optionsSrc.To.Longitude) || (optionsSrc.From.Latitude != optionsSrc.To.Latitude)) {
        
                    var lat1 = optionsSrc.From.Latitude * Math.PI / 180;
                    var lat2 = optionsSrc.To.Latitude * Math.PI / 180;
                    var lon1 = optionsSrc.From.Longitude * Math.PI / 180;
                    var lon2 = optionsSrc.To.Longitude * Math.PI / 180;
                    var dLon = lon2 - lon1;
                    var x = Math.cos(lat2) * Math.cos(dLon);
                    var y = Math.cos(lat2) * Math.sin(dLon);
                    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + x) * (Math.cos(lat1) + x) + y * y));
                    var lon3 = lon1 + Math.atan2(y, Math.cos(lat1) + x);
                    lat3 *= 180 / Math.PI;
                    lon3 *= 180 / Math.PI;
                    var deltaY = optionsSrc.To.Longitude - optionsSrc.From.Longitude;
                    var deltaX = optionsSrc.To.Latitude - optionsSrc.From.Latitude;
                    var angleInDegrees = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                    return {
                        longitude: lon3,
                        Latitude: lat3,
                        angle: angleInDegrees,
                        distance: this.distancePoints(optionsSrc.From.Longitude, optionsSrc.From.Latitude, optionsSrc.To.Longitude, optionsSrc.To.Latitude)
                    }
                } else {
                    return false;
                }
        
            }
        }

    }
]);