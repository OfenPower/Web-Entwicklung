/*
Diese Datei dient als Einsprungspunkt der Applikation:
- Applikation wird initialisiert
- window.resize() wird festgelegt
- Anmeldung der onClick-Listener an Buttons
*/

// externe .js Dateien einbinden
var fetchTracklist = require("./fetchFunctions.js").fetchTracklist;
var paginateController = require("./paginateController.js").paginateController;
var googleMapsController = require("./googleMapsController.js").googleMapsController;
var buttonController = require("./buttonController").buttonController;

// Globale Variablen
var tracklistElements = [];	// Liste zum Speichern aller Trackelemente. Aus dieser Liste werden Tracks zum Paginieren entnommen.

// Referenzen auf Html-Elemente holen
//var heightMapDiv = document.getElementById("heightMapDiv");	// Canvas für die Höhenmap holen
var tracklist = document.getElementById("tracklist");		// in tracklist werden die Tracknamen aufgelistet
var leftButton = document.getElementById("leftButton");
var rightButton = document.getElementById("rightButton");

// googleMapsController initialisieren
googleMapsController.initMap();

// GET-Anfrage an die Trackliste stellen, Tracks in 'tracklistElements' abspeichern und auflisten
fetchTracklist().then(jsonData => {
	for (var i = 0; i < jsonData.length; i++) {
		// html-Trackeintrag erzeugen
		var track = document.createElement("li");
		// class-id für unterschiedlichen background-color-style je nach i setzen
		if (i % 2 === 0) {
			track.className = "listelement01";
		}
		else {
			track.className = "listelement02";
		}
		var trackText = document.createTextNode(jsonData[i]);
		track.setAttribute("id", i);	// id bezeichnet eine :id.json!
		track.addEventListener("mousedown", (event) => {
			// Bei Mausklick: id-Attribut holen und jeweiligen Pfad und Höhenmap der :id.js
			// mittels googleMapsController anzeigen
			var trackId = event.target.getAttribute("id");
			googleMapsController.showPathAndHeightMap(trackId);
		});
		track.appendChild(trackText);
		tracklistElements.push(track);	// Trackelement in Liste abspeichern
	}
	tracklist.appendChild(tracklistElements[0]);				// Ein Trackelement einfügen, um die Höhe zu erhalten.
	var listElementHeight = tracklistElements[0].offsetHeight;	// Die Höhe kann erst nach Einfügen ins DOM abgefragt werden.
	tracklist.removeChild(tracklistElements[0]);				// => Da Höhe nun bekannt ist => Trackelement wieder entfernen

	// Trackelemente und Höhe eines einzelnen Trackelements an PaginierungsController übergeben
	paginateController.setTracklistElements(tracklistElements);
	paginateController.setListElementHeight(listElementHeight);

	// Trackliste auffüllen
	paginateController.fillTracklist();
});

// Beim Ändern der Größe des Browserfensters wird neu paginiert
window.onresize = function () {
	var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;
	if (browserWindowHeight >= 200) {
		paginateController.removeTracksFromDiv();
		paginateController.resetCurrentPageCount();
		paginateController.fillTracklist();
		googleMapsController.resizeBounds();
	}
};

// Anmeldung der onClickListener an beide Buttons
// Die Funktionen von buttonController können nicht direkt zugewiesen werden!
// Grund: Die Funktion würde direkt ausgeführt werden, wobei das Ergebnis als Rückgabe an
// onclick übergeben wird. Das macht natürlich keinen Sinn.
leftButton.onclick = function () {
	buttonController.showPreviousTracks(paginateController);
};
rightButton.onclick = function () {
	buttonController.showNextTracks(paginateController);
};
