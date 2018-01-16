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
        
            },
            distancePoints: function (lon1, lat1, lon2, lat2) {
                // Distancia en Kilometros
        
                var R = 6371;
                //var dLat = ((lat2-lat1) * Math.PI/180);
                //var dLon = ((lon2-lon1) * Math.PI/180);
                var a = Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) * Math.sin(((lat2 - lat1) * Math.PI / 180) / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2) * Math.sin(((lon2 - lon1) * Math.PI / 180) / 2);
                var c = 2 * Math.asin(Math.sqrt(a));
                var d = R * c;
                return (d * 1.60934);
            },
            cutPrecision: function (obj, e) {
                if ('number' === typeof obj[0]) {
                    for (var i = 0; i < obj.length; i++) obj[i] = Math.round(obj[i] * e) / e;
                } else {
                    var arr = obj.features || obj.geometries || obj.coordinates || obj;
                    for (var i = 0; i < arr.length; i++) this.cutPrecision(arr[i], e);
                }
            },
            processPoints: function (geometry, callback, thisArg) {
                if (geometry instanceof google.maps.LatLng) {
                    callback.call(thisArg, geometry);
                } else if (geometry instanceof google.maps.Data.Point) {
                    callback.call(thisArg, geometry.get());
                } else {
                    geometry.getArray().forEach(function(g) {
                        this.processPoints(g, callback, thisArg);
                    });
                }
            },
            generateGeoJSONCircle: function (center, radius, numSides) {

                var points = [], degreeStep = 360 / numSides;
            
                for(var i = 0; i < numSides; i++){
                   var gpos = google.maps.geometry.spherical.computeOffset(center, radius, degreeStep * i);
                   points.push([gpos.lng(), gpos.lat()]);
                }
            
                points.push(points[0]);
            
                return {
                   type: 'Polygon',
                   coordinates: [ points ]
                };
            
            },
            getLatLngLiteralArray: function (array) {
                var latLngArray = [];
                for(var index = 0; index < array.length; index++){
                    latLngArray.push({lat: array[index][1], lng: array[index][0]});
                }
                return latLngArray;
             }
        }

    }
]);