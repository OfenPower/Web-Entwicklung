// externe .js Dateien und Module einbinden
var fetchTracklist = require("./fetchTracklist.js").fetchTracklist;
var paginateController = require("./paginateController.js").paginateController;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;		// XMLHttpRequest für GET-Abfragen benötigt
var GoogleMapsLoader = require("google-maps");						// Google Maps API über GoogleMapsLoader laden
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

// Globale Variablen
var tracklistelements = [];	// Liste zum Speichern aller Trackelemente. Aus dieser Liste werden Tracks zum Paginieren entnommen.
var map;					// Variable 'map' wird später die gespeicherte Karte enthalten
var coordinatePath;			// coordinatePath enthält später eine angezeigte Route.

// Referenzen auf Html-Elemente holen
var tracklist = document.getElementById("tracklist");	// in trackdiv stehen die Tracknamen
var pageCount = document.getElementById("pageCount");	// in pageCount steht die aktuelle und maximale Seitenzahl
var leftButton = document.getElementById("leftButton");		// Buttons für Anmeldung von onClickEventlistenern holen 
var rightButton = document.getElementById("rightButton");

// Funktion zum Laden der Karte mit Blick auf Trier
GoogleMapsLoader.load(function (google) {
	// Propertie-Objekt mit den Koordinaten von Trier
	var mapProp = {
		center: new google.maps.LatLng(49.75, 6.6371),
		zoom: 14,
	};

	// Karte mit Property öffnen und in 'map' abspeichern
	map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
});

// GET-Anfrage an die Trackliste stellen, Tracks in 'tracklist' abspeichern und Tracks auflisten
fetchTracklist().then(jsonData => {
	for (var i = 0; i < jsonData.length; i++) {
		// Trackeintrag erzeugen und in DOM-Baum einfügen
		var track = document.createElement("li");
		// class-id für unterschiedlichen background-color-style je nach i setzen
		if(i % 2 == 0) {
			track.className = "listelement01";
		}
		else {
			track.className = "listelement02";
		}
		var trackText = document.createTextNode(jsonData[i]);
		track.setAttribute("id", i);	// id bezeichnet eine :id.json!
		track.addEventListener("mousedown", (event) => {
			// Bei Mausklick: id-Attribut holen und jeweilige :id.json 
			// anzeigen
			var trackId = event.target.getAttribute("id");
			showCoordinates(trackId);
		});			
		track.appendChild(trackText);
		tracklistelements.push(track);	// Trackelement in Liste abspeichern
	}
	tracklist.appendChild(tracklistelements[0]);				// Ein Trackelement einfügen, um die Höhe zu erhalten.
	var listElementHeight = tracklistelements[0].offsetHeight;	// Die Höhe kann erst nach Einfügen ins DOM abgefragt werden.
	paginateController.setListElementHeight(listElementHeight);
	paginateController.setTracklist(tracklistelements);
	tracklist.removeChild(tracklistelements[0]);		// => Da Höhe nun bekannt ist => Trackelement wieder entfernen

	// Trackliste auffüllen
	paginateController.fillTracklist();
});

/*
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
*/

// Beim Ändern der Größe des Browserfensters wird neu paginiert
window.onresize = function() {
	var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;
	if(browserWindowHeight >= 200) {
		paginateController.removeTracksFromDiv();
		paginateController.resetCurrentPageCount();
		paginateController.fillTracklist();
	}
}

// Anmeldung der onClickListener an beide Buttons
//
leftButton.onclick = function() {
	var decreaseSummand = paginateController.tracksToInsert;
	if(paginateController.bottomTrackIndex - decreaseSummand >= 0) {
		paginateController.bottomTrackIndex -= decreaseSummand;
		paginateController.topTrackIndex -= decreaseSummand;
		paginateController.currentPageCount--;
	}
	paginateController.fillTracklistFromTo(paginateController.bottomTrackIndex, paginateController.topTrackIndex);
}

rightButton.onclick = function() {
	if(paginateController.currentPageCount < paginateController.maxPageCount) {	
		paginateController.currentPageCount++;
		var increaseSummand = paginateController.tracksToInsert;
		// Prüfen, ob topTrackIndex nicht "überläuft"
		if(paginateController.topTrackIndex + increaseSummand <= tracklistelements.length) {	
			paginateController.bottomTrackIndex += increaseSummand;	
			paginateController.topTrackIndex += increaseSummand;
			paginateController.fillTracklistFromTo(paginateController.bottomTrackIndex, paginateController.topTrackIndex);
		}
		else {
			paginateController.fillTracklistFromTo(paginateController.topTrackIndex, tracklistelements.length);
			paginateController.bottomTrackIndex += increaseSummand;
			paginateController.topTrackIndex += increaseSummand;
		}
	}
}

/*
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
*/

// showCoordinates() lädt Koordinaten des gewünschten Tracks
// und zeigt diese als Route auf der Map an.
function showCoordinates (trackId) {
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
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/tracks/" + trackId, true);
		xhr.addEventListener("error", error => { console.log(error.toString()); });
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
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

