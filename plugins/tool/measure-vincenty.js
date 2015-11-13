// measure-vincenty.js
// (C) 2015 Minoru Akagi | MIT License
// https://github.com/minorua/WebGISLab
// Dependencies: jQuery, Geodesic function libraries (https://github.com/chrisveness/geodesy)

(function () {
  var plugin = {
    name: 'Measure (Vincenty formula)',
    path: 'tool/measure-vincenty.js',
    type: 'tool',
    description: 'Measure geodesic distances on the ellipsoid using Vincenty formula. ' +
                 'Calculation depends on the geodesic function libraries at https://github.com/chrisveness/geodesy.'
  };

  plugin.init = function () {
    var core = olapp.core;
    var dir = 'js/geodesy/';
    core.loadScript(dir + 'vector3d.js');
    core.loadScript(dir + 'latlon-ellipsoidal.js');
    core.loadScript(dir + 'latlon-vincenty.js');

    $('#measure_length').parent().prop('title',
            'Measure geodesic distances. Geodesic distance on ellipsoid is calculated by Vincenty formula.');

    // override length calculation function
    olapp.tools.geom.formatLength = function(line) {
      var length = 0, lengthV = 0;
      var coordinates = line.getCoordinates();
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = core.transformToWgs84(coordinates[i]);
        var c2 = core.transformToWgs84(coordinates[i + 1]);
        if (c1[0] !== c2[0] || c1[1] !== c2[1]) {
          length += core.wgs84Sphere.haversineDistance(c1, c2);
          lengthV += (new LatLon(c1[1], c1[0])).distanceTo(new LatLon(c2[1], c2[0]))
        }
      }

      if (lengthV > 1000) {
        return 'Sperical: ' + (Math.round(length) / 1000) + ' km<br>' +
               'Ellipsoidal: ' + ((Math.round(lengthV * 10) / 10 / 1000).toFixed(4)) + ' km';
      } else {
        return 'Sperical: ' + (Math.round(length)) + ' m<br>' +
               'Ellipsoidal: ' + (Math.round(lengthV * 10) / 10) + ' m';
      }
    };
  };

  olapp.plugin.register(plugin.path, plugin);
})();