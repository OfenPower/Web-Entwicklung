// Google Maps API über GoogleMapsLoader laden
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

/*
Testeinträge. 
Bei einem Mausklick auf einem Eintrag werden entsprechende Marker gesetzt.
*/
var tracklist = document.getElementById("tracks");

// Einträge erzeugen
var track01 = document.createElement("p");
var track01Text = document.createTextNode("Trier - Konz - Trier");
track01.addEventListener("mousedown", event => {
	showCoordinates01();
});
track01.appendChild(track01Text);

var track02 = document.createElement("p");
var track02Text = document.createTextNode("Trier - Konz - Ehrang - Trier");
track02.addEventListener("mousedown", event => {
	showCoordinates02();
});
track02.appendChild(track02Text);

var track03 = document.createElement("p");
var track03Text = document.createTextNode("Trier - Schweich - Wittlich - Trier");
track03.addEventListener("mousedown", event => {
	showCoordinates03();
});
track03.appendChild(track03Text);

// Einträge in DOM-Baum einbauen
tracklist.appendChild(track01);
tracklist.appendChild(track02);
tracklist.appendChild(track03);

// Testfunktionen, welche pro Koordinate in einer .json Datei 
// einen Marker in erzeugt und einblendet
function showCoordinates01()
{
	GoogleMapsLoader.load(function (google) {
	
		// .json Datei einlesen
		var jsonTest = require("../assets/data/3.json");
	
		// Durch Koordinaten iterieren und Marker setzen
		for(var i=0; i < jsonTest.features[0].geometry.coordinates.length; i++)
		{
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

function showCoordinates02()
{
	GoogleMapsLoader.load(function (google) {
	
		// .json Datei einlesen
		var jsonTest = require("../assets/data/4.json");
	
		// Durch Koordinaten iterieren und Marker setzen
		for(var i=0; i < jsonTest.features[0].geometry.coordinates.length; i++)
		{
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

function showCoordinates03()
{
	GoogleMapsLoader.load(function (google) {
	
		// .json Datei einlesen
		var jsonTest = require("../assets/data/5.json");
	
		// Durch Koordinaten iterieren und Marker setzen
		for(var i=0; i < jsonTest.features[0].geometry.coordinates.length; i++)
		{
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