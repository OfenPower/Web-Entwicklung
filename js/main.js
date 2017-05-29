function initMap() {
	// Propertie-objekt mit den Koordinaten von Trier
	var mapProp = {
		center: new google.maps.LatLng(49.75, 6.6371),
		zoom: 14,
	};

	// Map mit Property öffnen
	var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

initMap();
