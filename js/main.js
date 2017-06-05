// Google Maps API über GoogleMapsLoader laden.
//
var GoogleMapsLoader = require("google-maps");
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

// Variable 'map' wird später die gespeicherte Karte enthalten
var map;

// Funktion zum Laden der Karte mit Blick auf Trier.
//
GoogleMapsLoader.load(function (google) {
	// Propertie-objekt mit den Koordinaten von Trier
	var mapProp = {
		center: new google.maps.LatLng(49.75, 6.6371),
		zoom: 14,
	};

	// Karte mit Property öffnen und in 'map' abspeichern
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
});

// Testfunktion, welche einen Marker in Trier erzeugt
// und einblendet
GoogleMapsLoader.load(function (google) {
	var markerOptions = {
		position: new google.maps.LatLng(49.755, 6.6373)
	};

	var marker = new google.maps.Marker(markerOptions);
	marker.setMap(map);
});
