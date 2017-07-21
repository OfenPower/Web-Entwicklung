/*
Diese Datei enthält den Paginierungscontroller, welcher alle Attribute und Funktionen 
die zur Paginierung benötigt werden, einkapselt 
*/

// Paginierungs Object-Literal
var paginateController = {
	// Paginierungs-Attribute
	tracklist : null,			// html-tracklist (wird von außen gesetzt)
	tracklistElements : null,	// Liste der Track-Objekte (wird von außen gesetzt)
	listElementHeight : null,	// Höhe eines Listenelements (wird von außen gesetzt)
	bottomTrackIndex : 0,
    topTrackIndex : null,
	tracksToInsert : null,
	pageCount : null,			// pageCount-paragraph, wird von außen gesetzt
	currentPageCount : 1,
	maxPageCount : null,

	// Setter-Funktionen für einige Attribute
	//
	setTracklist : function(list) {
		this.tracklist = list;
	},

	setTracklistElements : function(elements) {
		this.tracklistElements = elements;
	},

	setListElementHeight : function(height) {
		this.listElementHeight = height;
	},

	setPageCount : function(pagePar) {
		this.pageCount = pagePar;
	},
	
	// Paginierunsfunktionen
	//
	fillTracklist : function() {
		this.tracksToInsert = this.calculateTracksToInsert();
		this.maxPageCount = this.calculateMaxPageCount();
		this.bottomTrackIndex = 0;
		this.topTrackIndex = this.tracksToInsert;
		for(var i = 0; i < this.tracksToInsert; i++) {
			tracklist.appendChild(this.tracklistElements[i]);
		}
		// Seitenzahl anpassen
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
	},

	fillTracklistFromTo : function(bottom, top) {
		this.removeTracksFromDiv();
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
		for(var i = bottom; i < top; i++) {
			tracklist.appendChild(this.tracklistElements[i]);
		}
	},

	calculateTracksToInsert : function() {
		var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;		// Höhe des Browserfensters holen
		var pageControlHeight = document.getElementById("pageControl").offsetHeight;	// Höhe des PageControlDivs mit (Paginierung)
		return Math.floor((browserWindowHeight - pageControlHeight) / this.listElementHeight);
	},

	calculateMaxPageCount : function() {
		return Math.ceil(this.tracklistElements.length / this.tracksToInsert);
	},

	removeTracksFromDiv : function() {
		while(tracklist.firstChild) {
			tracklist.removeChild(tracklist.firstChild);
		}
	},

	resetCurrentPageCount : function() {
		this.currentPageCount = 1;
	}
}

// Paginierungsobjekt exportieren
module.exports.paginateController = paginateController;