# Web-Entwicklung
Hausarbeit - Repository
-----------------------------------------------------------------

Zum Builden des Projekts, im Projektordner in der Konsole

'npm run build' (für zusätzliche Dateiminifizierung)

bzw.

'npm run debug' (ohne Minifizierung)

eintippen. Im Ordner /release befinden sich dann alle benötigten Datein zum 
Starten des Servers. 

'npm start' 

fährt den http-server auf Port 8080 hoch. Der Befehl

'npm run clean'

löscht alle, im Build-Prozess enstandenen, Dateien im /tmp und /release Ordner.
Der Befehl

'node ./js/startServer <port>'

startet den Server auf dem angegebenem Port.

