// XMLHttpRequest erzeugen, wird später für GET-Abfragen benötigt
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Google Maps API über GoogleMapsLoader laden
var GoogleMapsLoader = require("google-maps");
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

// Variable 'map' wird später die gespeicherte Karte enthalten
var map;

// Funktion zum Laden der Karte mit Blick auf Trier.
GoogleMapsLoader.load(function (google) {
	// Propertie-Objekt mit den Koordinaten von Trier
	var mapProp = {
		center: new google.maps.LatLng(49.75, 6.6371),
		zoom: 14,
	};

	// Karte mit Property öffnen und in 'map' abspeichern
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
});

// Tracklistenelement der index.html holen
var tracklist = document.getElementById("tracks");

// GET-Anfrage an die Trackliste stellen und Tracknamen
// per DOM-Manipulation auflisten
function getTrackNames() {
	fetchTracklist().then(jsonData => {
		for (var i = 0; i < jsonData.length; i++) {
			// Trackeintrag erzeugen und in DOM-Baum einfügen
			var track = document.createElement("li");
			var trackText = document.createTextNode(jsonData[i]);
			track.setAttribute("id", i);
			track.addEventListener("mousedown", (event) => {
				var trackId = event.target.getAttribute("id");
				console.log(trackId);
				showCoordinates(trackId);
			});
			track.appendChild(trackText);
			tracklist.appendChild(track);
		}
	});
}
getTrackNames();

function fetchTracklist() {
	return new Promise(function (resolve, reject) {
		// XMLhttpRequest fordert Ressource /tracks/:id an
		// @param1: http-methode
		// @param2: url
		// @param3: asynch, ja oder nein?
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/tracks", true);
		xhr.addEventListener("error", error => { console.log(error.toString()); });
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				// Ergebnis der GET-Anfrage zu .json parsen
				// und mit resolve() dem Aufrufer zurückgeben
				var response = JSON.parse(xhr.responseText);
				resolve(response);
			}
			else {
				console.warn(xhr.statusText, xhr.responseText);
			}
		});
		xhr.send();
	});
}

// coordinatePath enthält später eine angezeigte Route.
// Falls es eine schon angezeigte Route gibt, wird diese bei einem 
// Aufruf von showCoordinates() gelöscht
var coordinatePath;

// showCoordinates() lädt Koordinaten des gewünschten Tracks
// und zeigt diese als Route auf der Map an.
function showCoordinates(trackId) {
	GoogleMapsLoader.load(function (google) {
		// gewünschte .json Datei mit Koordinaten laden
		fetchTrack(trackId).then(jsonData => {
			// Liste mit Trackkoordinaten aufbauen
			var coordinates = [];
			for (var i = 0; i < jsonData.features[0].geometry.coordinates.length; i++) {
				var latValue = jsonData.features[0].geometry.coordinates[i][1];
				var lngValue = jsonData.features[0].geometry.coordinates[i][0];
				// coordinates muss folgenden Aufbau haben:
				// var coordinates = [{lat: 37.772, lng: -122.214}];
				coordinates.push({ lat: latValue, lng: lngValue });
			}

			// Alte Route löschen, falls schon eine erzeugt wurde
			if(coordinatePath) {
				coordinatePath.setMap(null);
			}

			// Route mit Polylines zeichnen
			coordinatePath = new google.maps.Polyline({
				path: coordinates,	// => Koordinaten einer .json Datei
				geodesic: true,
				strokeColor: "#FF0000",
				strokeOpacity: 1.0,
				strokeWeight: 2
			});

			// Route auf der Map einblenden
			coordinatePath.setMap(map);

			// Map auf die eingeblendete Route zentrieren
			var bounds = new google.maps.LatLngBounds();
			for (var i = 0; i < coordinates.length; i++) {
				// LatLngBounds-Objekt pro Koordinate "erweitern" 
				bounds.extend(coordinates[i]);	
			}
			map.fitBounds(bounds);
			map.setCenter(bounds.getCenter());
		});
	});
}

// fetchTrack lädt asynchron die gewünschte .json Ressource (=trackId)
// über eine GET-Anfrage und liefert ein Promise-Objekt zurück. Auf diesem wird in
// 'showCoordinates()' auf das Ergebnis der Anfrage (.json Dokument) gewartet
function fetchTrack(trackId) {
	return new Promise(function (resolve, reject) {
		// XMLhttpRequest fordert Ressource /tracks/:id an
		// @param1: http-methode
		// @param2: url
		// @param3: asynch, ja oder nein?
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/tracks/" + trackId, true);
		xhr.addEventListener("error", error => { console.log(error.toString()); });
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				// Ergebnis der GET-Anfrage zu .json parsen
				// und mit resolve() dem Aufrufer zurückgeben
				var response = JSON.parse(xhr.responseText);
				resolve(response);
			}
			else {
				console.warn(xhr.statusText, xhr.responseText);
			}
		});
		xhr.send();
	});
}
