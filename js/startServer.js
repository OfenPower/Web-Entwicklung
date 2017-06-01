const express = require("express");
const path = require("path");
var server = express();

// Kommandozeilenargument (port) einlesen
var port = process.argv[2];

// Karte statisch an Client ausliefern
// Aufruf mit: localhost:port
server.use(express.static("./release"));

// HTTP-GET - Testmethode 
// Aufruf mit: localhost:8080/test
server.get("/test", function(req, res) {

    // sendFile verlangt absoluten Pfad 
    // => Pfad zu /release/index.html zusammenbauen
    // __dirname liefert absoluten Pfad zum /js-Ordner
    res.sendFile(path.join(__dirname, "../release", "index.html"));

    // console.log() wird im Erfolgsfall auf der
    // Serverkonsole ausgegeben (cmd)
    console.log("Server GET ausgeführt!");  
});

server.listen(port);
console.log("Server is listening on Port " + port);
