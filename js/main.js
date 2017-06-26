var fetchTracklist = require("./fetchTracklist.js").fetchTracklist;

// XMLHttpRequest erzeugen, wird später für GET-Abfragen benötigt
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Google Maps API über GoogleMapsLoader laden
var GoogleMapsLoader = require("google-maps");
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

var tracklistelements = [];	// Liste zum Speichern aller Trackelemente. Aus dieser Liste werden Tracks zum Paginieren entnommen.
var map;					// Variable 'map' wird später die gespeicherte Karte enthalten

// coordinatePath enthält später eine angezeigte Route.
// Falls es eine schon angezeigte Route gibt, wird diese bei einem 
// Aufruf von showCoordinates() gelöscht
var coordinatePath;

// Paginierungsattribute
var tracklist = document.getElementById("tracklist");	// trackdiv der index.html holen
var pageCount = document.getElementById("pageCount");	// in pageCount steht die aktuelle und maximale Seitenzahl
var currentPageCount = 1;	// Seite 1 von maxPageCount-Seiten
var maxPageCount;
var listElementHeight;		// Höhe eines Tracklistenelements
var tracksToInsert; 		// Anzahl der Tracks, welche gleichzeitig angezeigt werden können
var bottomTrackIndex = 0;	// Tracks werden von bottomTrackIndex bis upperTrackIndex aus der Trackliste 
var topTrackIndex;			// zur Paginierung entnommen.

// Buttons holen, um später Eventlistener anzumelden
var leftButton = document.getElementById("leftButton");	
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
		// class für unterschiedlichen background-color style je nach i setzen
		if(i % 2 == 0) {
			track.className = "listelement01";
		}
		else {
			track.className = "listelement02";
		}
		var trackText = document.createTextNode(jsonData[i]);
		track.setAttribute("id", i);	// id bezeichnet eine :id.json!
		track.addEventListener("mousedown", (event) => {
			var trackId = event.target.getAttribute("id");
			showCoordinates(trackId);
		});			
		track.appendChild(trackText);
		tracklistelements.push(track);	// Trackelement in Liste abspeichern
	}
	tracklist.appendChild(tracklistelements[0]);				// Ein Trackelement einfügen, um die Höhe zu erhalten.
	listElementHeight = tracklistelements[0].offsetHeight;	// Diese kann erst nach Einfügen ins DOM abgefragt werden
	tracklist.removeChild(tracklistelements[0]);		// => Da Höhe nun bekannt ist => Trackelement wieder entfernen
	fillTracklist();
});

/*
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------
*/

function fillTracklist() {
	tracksToInsert = calculateTracksToInsert();
	maxPageCount = calculatePageCount();
	bottomTrackIndex = 0;
	topTrackIndex = tracksToInsert;
	for(var i = 0; i < tracksToInsert; i++) {
		tracklist.appendChild(tracklistelements[i]);
	}
	pageCount.innerHTML = currentPageCount + "/" + maxPageCount;
	console.log("currentPageCount " + currentPageCount);
	console.log("maxPageCount " + maxPageCount);
}

function calculateTracksToInsert() {
	var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;		// Höhe des Browserfensters holen
	var pageControlHeight = document.getElementById("pageControl").offsetHeight;	// Höhe des PageControlDivs mit (Paginierung)
	return Math.floor((browserWindowHeight - pageControlHeight) / listElementHeight);
}

function calculatePageCount() {
	// Länge von 'tracklist' geteilt durch 'tracksToInsert' aufgerundet ergibt
	// die Anzahl der maximalen Trackseiten!
	return Math.ceil(tracklistelements.length / tracksToInsert);
}

function removeTracksFromDiv() {
	while(tracklist.firstChild) {
		tracklist.removeChild(tracklist.firstChild);
	}
}

function fillTracklistFromTo(bottom, top) {
	removeTracksFromDiv();
	pageCount.innerHTML = currentPageCount + "/" + maxPageCount;
	for(var i = bottom; i < top; i++) {
		tracklist.appendChild(tracklistelements[i]);
	}
}

// Beim Ändern der Größe des Browserfensters wird neu paginiert
window.onresize = function() {
	var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;
	if(browserWindowHeight >= 200) {
		removeTracksFromDiv();
		currentPageCount = 1;
		fillTracklist();
	}
}

leftButton.onclick = function() {
	var decreaseSummand = tracksToInsert;
	if(bottomTrackIndex - decreaseSummand >= 0) {
		bottomTrackIndex -= decreaseSummand;
		topTrackIndex -= decreaseSummand;
		currentPageCount--;
	}
	fillTracklistFromTo(bottomTrackIndex, topTrackIndex);
}

rightButton.onclick = function() {
	if(currentPageCount < maxPageCount) {	
		currentPageCount++;
		var increaseSummand = tracksToInsert;
		// Prüfen, ob topTrackIndex nicht "überläuft"
		if(topTrackIndex + increaseSummand <= tracklistelements.length) {	
			bottomTrackIndex += increaseSummand;	
			topTrackIndex += increaseSummand;
			fillTracklistFromTo(bottomTrackIndex, topTrackIndex);
		}
		else {
			fillTracklistFromTo(topTrackIndex, tracklistelements.length);
			bottomTrackIndex += increaseSummand;
			topTrackIndex += increaseSummand;
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

