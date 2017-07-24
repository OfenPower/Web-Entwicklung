/*
Diese Datei dient zum Starten des HTTP-Servers auf einem beliebigen Port.
Der Server liefert die Trackdaten als .json Dateien an den Client aus
*/

const express = require("express");
const path = require("path");
const fs = require("fs");	// zum auslesen des /assets/data Ordners
var server = express();		// Express-Server Objekt wird zurückgeliefert

// Kommandozeilenargument (port) einlesen und
// BASE_URI anlegen
const PORT = process.argv[2];
const BASE_URI = `localhost:${PORT}`;

// Anwendung statisch an Client ausliefern (html+js+css)
server.use(express.static(path.join(__dirname, "../release")));

// Server starten
server.listen(PORT, () => console.log(`Server is listening on ${BASE_URI}`));

// /tracks liefert die Namen der Tracks in sortierter
// Reihenfolge an den Browser aus
server.get("/tracks", function (req, res) {
	// Anzahl der Tracks im /assets/data Ordner bestimmen
	var files = fs.readdirSync("./assets/data");	// synchroner Zugriff aufs Filesystem
	var fileCount = files.length;

	// Über .json Files iterieren, Tracknamen herauslesen und abspeichern
	var names = [];
	for (var i = 1; i <= fileCount; i++) {
		var jsonFile = require("../assets/data/" + i + ".json");
		var name = jsonFile.features[0].properties.name;
		names.push(name);
	}

	// Namen als .json Datei an Browser ausliefern
	// Format: {<index> : <name>}
	// ACHTUNG: index wird hier ab 0 gezählt, weil 'names' eine Liste ist.
	// Bei einer entsprechenden /tracks/:id Anfrage wird die angegebene id des Clients
	// um 1 inkrementiert, da die .json Dateien im Fileystem ab index 1
	// durchnummeriert sind.
	res.json(names);
	res.end();
});

// /tracks/:id liefert die jeweilige :id.json Datei
// an den Browser aus
server.get("/tracks/:id", function (req, res) {
	// :id um 1 inkrementieren, da Tracks ab Index 0 an den Browser ausgeliefert wurden!
	var id = req.params.id;
	id++;

	// Track anhand der id unterscheiden und jeweilige .json zurückliefern
	res.json(require("./../assets/data/" + id + ".json"));
	res.end();
});
