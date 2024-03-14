var map;
var marker;
var directionsService;
var directionsRenderer;
var watchId;

// Initialize the map
function initMap() {
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "#000000", // Set line color to black
    },
  });

  // Get the driver's current position
  navigator.geolocation.getCurrentPosition(
    function (position) {
      var currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: currentLocation, // Center the map to the current location
        mapTypeId: google.maps.MapTypeId.ROADMAP, // Display only roads
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      marker = new google.maps.Marker({
        map: map,
        position: currentLocation,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      // Start watching the driver's position after the map is initialized
      watchDriverPosition();
    },
    function (error) {
      alert("Error occurred. Unable to track driver's location.");
    }
  );
}

// Start watching the driver's position
function watchDriverPosition() {
  watchId = navigator.geolocation.watchPosition(
    function (position) {
      var currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      marker.setPosition(currentLocation);
      map.setCenter(currentLocation); // Center the map to the current location
    },
    function (error) {
      alert("Error occurred. Unable to track driver's location.");
    }
  );
}

// Function to start the ride
function startRide() {
  var pickUpLocation = document.getElementById("Pick_Up_Location").value;
  var dropOffLocation = document.getElementById("Drop_Off_Location").value;

  var request = {
    origin: pickUpLocation,
    destination: dropOffLocation,
    travelMode: "DRIVING",
  };

  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
    } else {
      window.alert("Directions request failed due to " + status);
    }
  });
}
