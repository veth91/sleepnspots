const https = require("https");
const url =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnZkjqhIsSn6xwIA7b4jdmHxIz9RuZ4QM";
https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: new google.maps.LatLng(31.973, -81.488),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(31.973, -81.488),
        draggable: true
      });

      google.maps.event.addListener(myMarker, 'dragend', function (evt) {
        document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
        });

      // google.maps.event.addListener(myMarker, 'dragstart', function (evt) {
      //   document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
      // });

      map.setCenter(myMarker.position);
      myMarker.setMap(map);
  });
});

