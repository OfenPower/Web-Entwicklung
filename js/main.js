// Testausgabe auf der Konsole, um festzustellen, ob das Skript
// überhaupt ausgeführt wird
var a = 5;
console.log(a);

// Veränderung des HTML-Textes
let element = document.getElementById("TestText");
if (element) {
	element.innerHTML = "Hallo Welt!";
}
