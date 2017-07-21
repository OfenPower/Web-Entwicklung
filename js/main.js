// externe .js Dateien und Module einbinden
var fetchTracklist = require("./fetchFunctions.js").fetchTracklist;
var paginateController = require("./paginateController.js").paginateController;
var googleMapsController = require("./googleMapsController.js").googleMapsController;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;		// XMLHttpRequest für GET-Abfragen einbinden

// Globale Variablen
var tracklistelements = [];	// Liste zum Speichern aller Trackelemente. Aus dieser Liste werden Tracks zum Paginieren entnommen.

// Referenzen auf Html-Elemente holen
var heightMapDiv = document.getElementById("heightMapDiv");	// Canvas für die Höhenmap holen
var tracklist = document.getElementById("tracklist");		// in tracklist werden die Tracknamen aufgelistet
var pageCount = document.getElementById("pageCount");		// in pageCount steht die aktuelle und maximale Seitenzahl
var leftButton = document.getElementById("leftButton");		// Buttons für Anmeldung von onClickEventlistenern holen 
var rightButton = document.getElementById("rightButton");

// googleMapsController initialisieren
googleMapsController.setHeightMapDiv(heightMapDiv);
googleMapsController.initMap();

// GET-Anfrage an die Trackliste stellen, Tracks in 'tracklistelements' abspeichern und auflisten
fetchTracklist().then(jsonData => {
	for (var i = 0; i < jsonData.length; i++) {
		// html-Trackeintrag erzeugen
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
			// Bei Mausklick: id-Attribut holen und jeweiligen Pfad und Höhenmap der :id.js 
			// mittels googleMapsController anzeigen
			var trackId = event.target.getAttribute("id");
			googleMapsController.showPathAndHeightMap(trackId);	
		});			
		track.appendChild(trackText);
		tracklistelements.push(track);	// Trackelement in Liste abspeichern
	}
	tracklist.appendChild(tracklistelements[0]);				// Ein Trackelement einfügen, um die Höhe zu erhalten.
	var listElementHeight = tracklistelements[0].offsetHeight;	// Die Höhe kann erst nach Einfügen ins DOM abgefragt werden.
	tracklist.removeChild(tracklistelements[0]);				// => Da Höhe nun bekannt ist => Trackelement wieder entfernen

	// Alle veränderbare Paginierungs-Attribute an Paginierungsobjekt übergeben
	paginateController.setTracklist(tracklist);
	paginateController.setTracklistElements(tracklistelements);
	paginateController.setListElementHeight(listElementHeight);
	paginateController.setPageCount(pageCount);

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

