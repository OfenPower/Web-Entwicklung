/*
Diese Datei enthält den GoogleMapsController zum Umgang mit der GoogleMaps-API
*/

var fetchTrack = require("./fetchFunctions.js").fetchTrack;         // Fetch-Funktion für einzelne Tracks holen
var GoogleMapsLoader = require("google-maps");						// Google-Maps-API über GoogleMapsLoader laden
GoogleMapsLoader.KEY = "AIzaSyCJjEgwGdn2ldnLgpJKUdML5Zrk8X7zt5Y";

// Benötigte HTML-Elemente holen
var heightMapDiv = document.getElementById("heightMapDiv");

// Objekt-Literal zur Kapselung der GoogleMaps-Funktionen
var googleMapsController = {
	// GoogleMaps-Attribute
	map: null,                 	// map speichert die geladene Karte
	coordinatePath: null,       // coordinatePath enthält später die angezeigte Route
	heightMapCanvas: null,      // canvas-element zum Zeichnen der Höhenmap

	// Funktionen zum Umgang mit der GoogleMaps-API
	//

	// Initialisieren der Map mit Blick auf Trier
	initMap: function () {
		GoogleMapsLoader.load(function (google) {
			// Property-Objekt mit den Koordinaten von Trier
			var mapProp = {
				center: new google.maps.LatLng(49.75, 6.6371),
				zoom: 14,
			};

			// Karte mit Property-Objekt öffnen und in map-Attribut abspeichern
			this.map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
		});
	},

	// Zeichnen und Anzeigen der Route und Höhenmap eines Tracks
	showPathAndHeightMap: function (trackId) {
		GoogleMapsLoader.load(function (google) {
			// gewünschte .json Datei mit Koordinaten laden
			fetchTrack(trackId).then(jsonData => {
				// Liste mit Trackkoordinaten aufbauen
				var coordinates = [];
				var heightCoordinates = [];
				for (var i = 0; i < jsonData.features[0].geometry.coordinates.length; i++) {
					var latValue = jsonData.features[0].geometry.coordinates[i][1];
					var lngValue = jsonData.features[0].geometry.coordinates[i][0];
					var heightValue = jsonData.features[0].geometry.coordinates[i][2];

					// coordinates muss folgenden Aufbau für Path haben:
					// var coordinates = [{lat: 37.772, lng: -122.214}];
					coordinates.push({ lat: latValue, lng: lngValue });
					heightCoordinates.push(heightValue);
				}

				// Alte Route löschen, falls schon eine erzeugt wurde
				if (this.coordinatePath) {
					this.coordinatePath.setMap(null);
				}

				// Route mit Polylines zeichnen
				this.coordinatePath = new google.maps.Polyline({
					path: coordinates,	// => Koordinaten einer .json Datei
					geodesic: true,
					strokeColor: "#FF0000",
					strokeOpacity: 1.0,
					strokeWeight: 2
				});

				// Route auf der Map einblenden
				this.coordinatePath.setMap(this.map);

				// Map auf die eingeblendete Route zentrieren
				var bounds = new google.maps.LatLngBounds();
				for (var j = 0; j < coordinates.length; j++) {
					// LatLngBounds-Objekt pro Koordinate "erweitern"
					bounds.extend(coordinates[j]);
				}
				this.map.fitBounds(bounds);
				this.map.setCenter(bounds.getCenter());

				// Höhenmap erzeugen und zeichnen
				// ACHTUNG: this.createHeightMap funktioniert hier nicht, da GoogleMapsLoader.load(callback)
				// bei 'this' im callback keinen Verweis auf die Funktion createHeightMap() hat!
				// Daher muss im callback die Funktion manuell auf dem Objekt aufgerufen werden
				googleMapsController.createHeightMap(heightCoordinates);
			});
		});
	},

	createHeightMap: function (heightCoordinates) {
		// Altes Canvas löschen, falls vorhanden
		if (this.heightMapCanvas) {
			heightMapDiv.removeChild(this.heightMapCanvas);
		}
		// Neues Canvas erzeugen
		this.heightMapCanvas = document.createElement("canvas");
		this.heightMapCanvas.setAttribute("id", "heightMapCanvas");
		this.heightMapCanvas.setAttribute("height", 150);
		this.heightMapCanvas.setAttribute("width", 300);

		// Canvas in DOM einfügen
		heightMapDiv.appendChild(this.heightMapCanvas);
		var context = this.heightMapCanvas.getContext("2d");

		// Canvas auf 300 pixel in x-Richtung skalieren
		var scale = 1 / heightCoordinates.length * 300;
		context.scale(scale, 1);

		// Hintergrund schwarz färben
		context.fillStyle = "black";
		context.fillRect(0, 0, heightCoordinates.length + 20, 150);

		// Propertys für zu zeichnende Linie festlegen
		context.lineWidth = 1;
		context.strokeStyle = "white";
		context.fillStyle = "white";

		// Über Koordinaten iterieren und höchsten/niedrigsten Wert merken
		var topValue = 0;
		var minValue = 10000;
		for (var i = 0; i < heightCoordinates.length; i++) {
			var value = heightCoordinates[i];
			topValue = Math.max(topValue, value);
			minValue = Math.min(minValue, value);
		}

		// Höhenkoordinaten in y-Richtung skalieren und zeichnen
		var path = new Path2D();
		path.moveTo(0, 140);
		for (var j = 0; j < heightCoordinates.length; j++) {
			var x = j;
			var scaledValue = (heightCoordinates[j] / topValue) * 130;
			path.lineTo(++x, (140 - scaledValue));
		}
		path.lineTo(heightCoordinates.length, 140);
		path.closePath();

		context.stroke(path);
		context.fill(path);
	}
};

// GoogleMapsController exportieren
module.exports.googleMapsController = googleMapsController;
