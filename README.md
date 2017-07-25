# Web-Entwicklung
Hausarbeit - Repository
-----------------------------------------------------------------
Erster Schritt: npm install 
-----------------------------------------------------------------
Zum Builden des Projekts, im Projektordner in der Konsole 'npm run build' (für zusätzliche Dateiminifizierung)
bzw. 'npm run debug' (ohne Minifizierung) eintippen. Im Ordner /release befinden sich dann alle benötigten Datein zum 
Starten des Servers. 
Der Befehl 'npm start' fährt den Http-Server auf Port 8080 hoch. 
Der Befehl 'npm run clean' bereinigt das Projekt (= Löschen des /tmp /release und /node-modules Ordner).
Der Befehl 'node ./js/startServer <port>' startet den Http-Server auf dem angegebenem Port.
-------------------------------------------------------------------------------------
Lesen der .json Dateien.
-------------------------------------------------------------------------------------

Aufbau einer .json Datei

"features": [
		{
			"geometry": {
				"coordinates": [
					[
						6.57111,
						49.999360000000003,
						233
					],
					[
						6.5702299999999996,
						50.00009,
						239.90000000000001
					],

Zugriff auf Namen des Tracks einer .json Datei:
var name = jsonTest.features[0].properties.name;

Zugriff auf Koordinaten einer .json Datei:
var jsonTest = require("../assets/data/1.json");
jsonTest.features[0].geometry.coordinates[0][x]   // x=0,1,2

coordinates[0][0] = Lng - Longitude - Breitengrad
coordinates[0][1] = Lat - Latitude  - Längengrad
coordinates[0][2] = Höhe

Google erwartet Positionsangabe in (Lat, Lng)
zB. google.maps.LatLng(49.755, 6.6373)
=> coordinates aus .json tauschen!
=>  Lat     Lng
=> [0][1], [0][0]

google.maps.LatLng(49.755, 6.6373)
