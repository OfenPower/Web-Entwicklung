/*
Aufbau einer .json Datei

"features": [
		{
			"geometry": {
				"coordinates": [
					[
						6.57111,
						49.999360000000003,
						233
					],
					[
						6.5702299999999996,
						50.00009,
						239.90000000000001
					],
*/

/*
Zugriff auf Koordinaten einer .json Datei:

var jsonTest = require("../assets/data/1.json");
jsonTest.features[0].geometry.coordinates[0][x]   // x=0,1,2
-------------------------------
coordinates[0][0] = Lng - Longitude - Breitengrad
coordinates[0][1] = Lat - Latitude  - Längengrad
coordinates[0][2] = Höhe

Google erwartet Positionsangabe in (Lat, Lng)
zB. google.maps.LatLng(49.755, 6.6373)
=> coordinates aus .json tauschen!
=>  Lat     Lng
=> [0][1], [0][0]

google.maps.LatLng(49.755, 6.6373)
*/

/*
--------------------------------------------------------------------------------------------------
*/

// .json Datei einlesen
var jsonTest = require("../assets/data/1.json");

// Testweise Durch Koordinaten iterieren
for (var i = 0; i < jsonTest.features[0].geometry.coordinates.length; i++) {
	var lat = jsonTest.features[0].geometry.coordinates[i][1];
	var lng = jsonTest.features[0].geometry.coordinates[i][0];
	console.log(lat + "   " + lng);
}
