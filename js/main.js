// Google Maps API über GoogleMapsLoader laden
var GoogleMapsLoader = require("google-maps");
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

// Variable 'map' wird später die gespeicherte Karte enthalten
var map;

// Funktion zum Laden der Karte mit Blick auf Trier.
//
GoogleMapsLoader.load(function (google) {
	// Propertie-Objekt mit den Koordinaten von Trier
	var mapProp = {
		center: new google.maps.LatLng(49.75, 6.6371),
		zoom: 14,
	};

	// Karte mit Property öffnen und in 'map' abspeichern
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
});

/*
Testeintrag in der Trackliste
Bei einem Mausklick auf den Eintrag werden entsprechende Marker gesetzt.
*/
var tracklist = document.getElementById("tracks");

// Eintrag erzeugen
var track01 = document.createElement("p");
var track01Text = document.createTextNode("Trier - Konz - Trier");
track01.addEventListener("mousedown", (event) => {
	showCoordinates01();
});
track01.appendChild(track01Text);

// Eintrag in DOM-Baum einbauen
tracklist.appendChild(track01);

// Testfunktionen, welche pro Koordinate in einer .json Datei
// einen Marker in erzeugt und einblendet
function showCoordinates01() {
	GoogleMapsLoader.load(function (google) {
		// .json Datei einlesen
		var jsonTest = require("../assets/data/3.json");

		// Durch Koordinaten iterieren und Marker setzen
		for (var i = 0; i < jsonTest.features[0].geometry.coordinates.length; i++) {
			var lat = jsonTest.features[0].geometry.coordinates[i][1];
			var lng = jsonTest.features[0].geometry.coordinates[i][0];

			var markerOptions = {
				position: new google.maps.LatLng(lat, lng)
			};

			var marker = new google.maps.Marker(markerOptions);
			marker.setMap(map);
		}
	});
}
