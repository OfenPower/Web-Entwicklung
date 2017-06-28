// Paginierungs Object-Literal
var paginateController = {
	// Paginierungs-Attribute
	tracklistelements : null,	// wird von außen gesetzt
	listElementHeight : null,	// wird von außen gesetzt
	bottomTrackIndex : 0,
    topTrackIndex : null,
	tracksToInsert : null,
	currentPageCount : 1,
	maxPageCount : null,

	// Setter-Funktionen für einige Attribute
	//
	setTracklist : function(elements) {
		this.tracklistelements = elements;
	},

	setListElementHeight : function(height) {
		this.listElementHeight = height;
		console.log(this.listElementHeight);
	},
	
	// Paginierunsfunktionen
	//
	fillTracklist : function() {
		this.tracksToInsert = this.calculateTracksToInsert();
		this.maxPageCount = this.calculateMaxPageCount();
		this.bottomTrackIndex = 0;
		this.topTrackIndex = this.tracksToInsert;
		for(var i = 0; i < this.tracksToInsert; i++) {
			tracklist.appendChild(this.tracklistelements[i]);
		}
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
	},

	fillTracklistFromTo : function(bottom, top) {
		this.removeTracksFromDiv();
		pageCount.innerHTML = this.currentPageCount + "/" + this.maxPageCount;
		for(var i = bottom; i < top; i++) {
			tracklist.appendChild(this.tracklistelements[i]);
		}
	},

	calculateTracksToInsert : function() {
		var browserWindowHeight = document.getElementById("pageDiv").offsetHeight;		// Höhe des Browserfensters holen
		var pageControlHeight = document.getElementById("pageControl").offsetHeight;	// Höhe des PageControlDivs mit (Paginierung)
		return Math.floor((browserWindowHeight - pageControlHeight) / this.listElementHeight);
	},

	calculateMaxPageCount : function() {
		return Math.ceil(this.tracklistelements.length / this.tracksToInsert);
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