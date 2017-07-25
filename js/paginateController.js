/*
Diese Datei enthält den Paginierungscontroller, welcher alle Attribute und Funktionen
die zur Paginierung benötigt werden, einkapselt
*/

// Benötigte HTML-Elemente holen
var tracklist = document.getElementById("tracklist");		// in tracklist werden die Tracknamen aufgelistet
var pageCount = document.getElementById("pageCount");		// in pageCount steht die aktuelle und maximale Seitenzahl

// Paginierungs Object-Literal
var paginateController = {
	// Paginierungs-Attribute
	tracklistElements: null,	// Liste der Track-Objekte (wird von außen gesetzt)
	listElementHeight: null,	// Höhe eines Listenelements (wird von außen gesetzt)
	bottomTrackIndex: 0,
	topTrackIndex: null,
	tracksToInsert: null,
	currentPageCount: 1,
	maxPageCount: null,

	// Setter-Funktionen für einige Attribute
	//
	setTracklistElements: function (elements) {
		this.tracklistElements = elements;
	},

	setListElementHeight: function (height) {
		this.listElementHeight = height;
	},

	// Paginierunsfunktionen
	//
	fillTracklist: function () {
		this.tracksToInsert = this.calculateTracksToInsert();	// Wieviele Tracks passen in die Liste?
		this.maxPageCount = this.calculateMaxPageCount();		// Seitenanzahl bestimmen
		this.bottomTrackIndex = 0;
		this.topTrackIndex = this.tracksToInsert;				// Intervall (bottomTrackIndex,topTrackIndex) festlegen
		for (var i = 0; i < this.tracksToInsert; i++) {
			tracklist.appendChild(this.tracklistElements[i]);	// Tracks in Liste einfügen
		}
		// Seitenzahl anpassen
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
	},

	// Funktion zum Einfügen der Tracks vom bottomTrackIndex zu topTrackIndex
	fillTracklistFromTo: function (bottom, top) {
		this.removeTracksFromDiv();		// aktuell angezeigte Tracks entfernen
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
		for (var i = bottom; i < top; i++) {
			tracklist.appendChild(this.tracklistElements[i]);
		}
	},

	// Funktion zur Berechnung, wieviele Tracks auf eine Seite passen
	calculateTracksToInsert: function () {
		var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;		// Höhe des Browserfensters holen
		var pageControlHeight = document.getElementById("pageControl").offsetHeight;	// Höhe des PageControlDivs mit
		return Math.floor((browserWindowHeight - pageControlHeight) / this.listElementHeight);	// abrunden!
	},

	// Seitenanzahl bestimmen
	calculateMaxPageCount: function () {
		// aufrunden, da z.B (10 / 3) = 3,3 => 4 Seiten!
		return Math.ceil(this.tracklistElements.length / this.tracksToInsert);
	},

	// Funktion entfernt alle angezeigten Tracks
	removeTracksFromDiv: function () {
		while (tracklist.firstChild) {
			tracklist.removeChild(tracklist.firstChild);
		}
	},

	resetCurrentPageCount: function () {
		this.currentPageCount = 1;
	}
};

// Paginierungsobjekt exportieren
module.exports.paginateController = paginateController;
