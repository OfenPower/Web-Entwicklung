const express = require("express");
const path = require("path");
// const bodyParser = require("body-parser");
var server = express();

// Kommandozeilenargument (port) einlesen und
// BASE_URI anlegen
const PORT = process.argv[2];
const BASE_URI = `localhost:${PORT}`;

// Anwendung statisch an Client ausliefern (html+js+css)
server.use(express.static(path.join(__dirname, "../release")));

// Server starten
server.listen(PORT, () => console.log(`Server is listening on ${BASE_URI}`));

// HTTP-GET - Testmethode
// Aufruf mit: localhost:8080/test
server.get("/test", function (req, res) {
	// sendFile verlangt absoluten Pfad
	// => Pfad zu /release/index.html zusammenbauen
	// __dirname liefert absoluten Pfad zum /js-Ordner
	res.sendFile(path.join(__dirname, "../release/index.html"));

	// console.log() wird im Erfolgsfall auf der
	// Serverkonsole ausgegeben (cmd)
	console.log("Server GET ausgeführt!");
});

// bodyParser parst den Body der Http Anfragen
// und legt Inhalt in request.body ab
// server.use(bodyParser.json());

// RESTful-Http Modellierung: Einstiegspunkt
/*
server.get("", (request, response) => {
	response.json({
		_links: {
			self: { href: `${BASE_URI}`},
			map: { href: `${BASE_URI}/map`},
		}
	});
});
*/
