angular.module('SER.map').service('googleMapsFunctions', [
    function () {

        return {
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