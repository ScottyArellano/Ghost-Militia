// Initialize the map without setting a view yet
var map = L.map('map');

// Add a tile layer to the map (the actual map image/background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let userMarker;

// Array of static points
var staticPoints = [
    { lat: 40.510100, lng: -111.462128, title: "Scotty's CNC", description: "The First" },
    { lat: 40.467977, lng: -111.468884, title: "Jims CNC ", description: "Live Free or Die" },
    { lat: 32.390577, lng: -110.953252, title: "Dave's CNC ", description: "Death to Tyrants" },
    
];

// Add markers for each static point
staticPoints.forEach(function(point) {
    L.marker([point.lat, point.lng])
        .addTo(map)
        .bindPopup(`<b>${point.title}</b><br />${point.description}`);
});

// Function to set the map view to a new location and update the marker
function updateMapView(lat, lng) {
    map.setView([lat, lng], 13);
    if (userMarker) {
        userMarker.setLatLng([lat, lng]); // Update existing marker position
    } else {
        userMarker = L.marker([lat, lng]).addTo(map)
    }
    userMarker.openPopup();
}

// Get the user's current location and set the initial map view
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        updateMapView(lat, lng);
    }, function(error) {
        console.error("Geolocation error: " + error.message);
        // Fallback to a default location
        updateMapView(40.7128, -74.0060); // New York
    });
} else {
    console.error("Geolocation is not supported by this browser.");
    updateMapView(40.7128, -74.0060); // New York
}

// Handle search functionality
document.getElementById('search-button').addEventListener('click', function() {
    var location = document.getElementById('search-input').value;

    if (location) {
        // Use Nominatim API to get the location's coordinates
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = data[0].lat;
                    var lng = data[0].lon;
                    updateMapView(lat, lng);
                } else {
                    alert('Location not found. Please try another search term.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while searching. Please try again.');
            });
    } else {
        alert('Please enter a location to search.');
    }
});
