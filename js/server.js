/*
Diese Datei dient zum Starten des HTTP-Servers auf einem beliebigen Port.
Der Server liefert die Trackdaten als .json Dateien an den Client aus
*/

const express = require("express");
const path = require("path");
const fs = require("fs");	// zum auslesen des /assets/data Ordners
var server = express();		// Express-Server Objekt wird zurückgeliefert

// Asset-Ordner mit Trackdaten auslesen
var files = fs.readdirSync("./assets/data");	// synchroner Lese-Zugriff auf die Namen der .json Dateien
var fileCount = files.length;					// Anzahl der .json Dateien bestimmen

// Kommandozeilenargument (port) einlesen und
// BASE_URI anlegen
const PORT = process.argv[2];
const BASE_URI = `localhost:${PORT}`;

// Anwendung statisch an Client ausliefern (html+js+css)
server.use(express.static(path.join(__dirname, "../release")));

// Server starten
server.listen(PORT, () => console.log(`Server is listening on ${BASE_URI}`));

/*
FUNKTIONEN ZUR INTERAKTION MIT SERVER
*/

// /tracks liefert die Liste aller Tracks zurück
server.get("/tracks", function (req, res) {
	var tracks = [];
	for (var i = 1; i <= fileCount; i++) {
		// Alle Tracks requiren in Liste zusammenfassen
		tracks.push(require("../assets/data/" + i + ".json"));
	}

	// Liste aller Tracks ausliefern
	// Format: {<index> : <trackobjekt>}
	// ACHTUNG: index wird hier ab 0 gezählt, weil 'names' eine Liste ist.
	// Bei einer entsprechenden /tracks/:id Anfrage wird die angegebene id des Clients
	// um 1 inkrementiert, da die .json Dateien im Fileystem ab index 1
	// durchnummeriert sind.
	res.json(tracks);
	res.end();
});

// /tracks/names liefert die Namen der Tracks in sortierter
// Reihenfolge an den Browser aus
server.get("/tracks/names", function (req, res) {
	// Über .json Files iterieren, Tracknamen herauslesen und abspeichern
	var names = [];
	for (var i = 1; i <= fileCount; i++) {
		var jsonFile = require("../assets/data/" + i + ".json");
		var name = jsonFile.features[0].properties.name;
		names.push(name);
	}
	res.json(names);
	res.end();
});

// /tracks/:id liefert die jeweilige :id.json Datei
// an den Browser aus
server.get("/tracks/:id", function (req, res) {
	// :id um 1 inkrementieren, da Tracks ab Index 0 an den Browser ausgeliefert wurden!
	var id = req.params.id;
	id++;

	// Existiert ein Track mit dieser id?
	if (id < 1 || id > fileCount) {
		// Falls nicht => 'not found' an Client schicken
		res.sendStatus(404);
	}
	else {
		// sonst: Jeweilige :id.json zurückliefern
		res.json(require("../assets/data/" + id + ".json"));
	}
	res.end();
});
