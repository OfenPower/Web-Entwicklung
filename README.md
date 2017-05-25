# Web-Entwicklung
Hausarbeit - Repository

Benötigte installierte Module:
--------------------------------
npm install -g cp-cli
npm install -g del-cli
npm install -g mkdir
npm install -g browserify
npm install -g babili
npm install -g less-plugin-clean-css
npm install -g http-server
npm install -g eslint
--------------------------------

Zum Builden des Projekts, im Projektordner in der Konsole

'npm run build' (für zusätzliche Dateiminifizierung)

bzw.

'npm run debug' (ohne Minifizierung)

eintippen. Im Ordner /release befinden sich dann alle benötigten Datein zum 
Starten des Servers. 

'npm start' 

fährt den http-server auf Port 8080 hoch. Der Befehl

'npm run clean'

löscht alle, im Build-Prozess enstandenen, Dateien im /tmp Ordner.

