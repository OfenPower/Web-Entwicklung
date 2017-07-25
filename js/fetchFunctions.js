/*
Diese Datei enthält alle Funktionen zur Datenanfrage beim Server (über HTTP-GET und Promises)
*/

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;		// XMLHttpRequest für GET-Abfragen einbinden

// Funktion liefert ein Promise auf die Namen aller Tracks zurück
module.exports.fetchTracklist = function () {
	return new Promise(function (resolve, reject) {
		// XMLhttpRequest fordert Ressource /tracks/:id an
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/tracks/names", true);	// asynchrone GET-Anfrage
		xhr.addEventListener("error", error => { console.log(error.toString()); });
		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				var response = JSON.parse(xhr.responseText);	// Ergebnis zu .json parsen
				resolve(response);
			}
			else {
				reject(xhr.statusText, xhr.responseText);
			}
		});
		xhr.send();
	});
};

// fetchTrack lädt asynchron eine konkrete .json Ressource (=trackId)
// über eine GET-Anfrage und liefert ein Promise-Objekt zurück. Auf diesem wird in
// 'showCoordinates()' auf das Ergebnis der Anfrage (.json Dokument) gewartet
module.exports.fetchTrack = function (trackId) {
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
				reject(xhr.statusText, xhr.responseText);
			}
		});
		xhr.send();
	});
};
