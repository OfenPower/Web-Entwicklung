const express = require("express");
const path = require("path");
// const bodyParser = require("body-parser");
var server = express();		// Express-Server Objekt wird zurückgeliefert

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
/*
:id benutzen
*/

server.get("/tracks/:id", function (req, res) {
	
	// Track anhand der ID [0,n] unterscheiden
	res.json(require("./../assets/data/" + req.params.id + ".json"));

	// console.log() wird im Erfolgsfall auf der
	// Serverkonsole ausgegeben (cmd)
	console.log("Server GET ausgeführt!");
	res.end();
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
