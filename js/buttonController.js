/*
Diese Datei enthält onClick-Callbacks, welche den Buttons zugewiesen werden können.
Die Buttons verändern bottomTrackIndex und topTrackIndex und rufen fillTracklistFromTo(bot, top) auf!
*/

var buttonController = {
	showPreviousTracks: function (paginateController) {
		var decreaseSummand = paginateController.tracksToInsert;
		if (paginateController.bottomTrackIndex - decreaseSummand >= 0) {
			paginateController.bottomTrackIndex -= decreaseSummand;
			paginateController.topTrackIndex -= decreaseSummand;
			paginateController.currentPageCount--;
		}
		paginateController.fillTracklistFromTo(paginateController.bottomTrackIndex, paginateController.topTrackIndex);
	},

	showNextTracks: function (paginateController) {
		if (paginateController.currentPageCount < paginateController.maxPageCount) {
			paginateController.currentPageCount++;
			var increaseSummand = paginateController.tracksToInsert;
			// Prüfen, ob topTrackIndex nicht "überläuft"
			if (paginateController.topTrackIndex + increaseSummand <= paginateController.tracklistElements.length) {
				paginateController.bottomTrackIndex += increaseSummand;
				paginateController.topTrackIndex += increaseSummand;
				paginateController.fillTracklistFromTo(paginateController.bottomTrackIndex, paginateController.topTrackIndex);
			}
			else {
				paginateController.fillTracklistFromTo(paginateController.topTrackIndex, paginateController.tracklistElements.length);
				paginateController.bottomTrackIndex += increaseSummand;
				paginateController.topTrackIndex += increaseSummand;
			}
		}
	}
};

module.exports.buttonController = buttonController;
