// Funktion liefert ein Promise auf die Trackliste zurück
module.exports.fetchTracklist = function() {
	return new Promise(function (resolve, reject) {
		// XMLhttpRequest fordert Ressource /tracks/:id an
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8080/tracks", true);	// asynchrone GET-Anfrage
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