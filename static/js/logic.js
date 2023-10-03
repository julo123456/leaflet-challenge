// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
      // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
  });

   // Create the base layers.
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Create functions to spceify size by magnitude, and color by depth
function size(magnitude){
    if (magnitude > 0 ){
        return magnitude *5

    }
    else if (magnitude =0){
        return 1
    }
}

function color(depth) {
    if (depth >= 90) {
        return "#800026"
    }
    else if ( depth >= 70 ){
        return "#BD0026"
    }
    else if (depth >= 50) {
        return "#E31A1C"
    }
    else if (depth >= 30){
        return "#f59b56"
    }
    else if (depth >= 10){
        return "#fecc76"
    }
    else if (depth >= -10){
        return "#f7fe76"
    }
    else return "#fffdd0"
  
    
}


// use GeoJSON function, pointToLayer to create circule markers with cusotmized sizes based on maginitude and customized color based on depth
  L.geoJSON(earthquakeData, {
    
    pointToLayer: function (feature,latlng){
        return L.circleMarker(latlng)
        },
    style: function style(feature){
        return{radius: size(feature.properties.mag),
            fillColor: color(feature.geometry.coordinates[2]),
            color: "white",
            weight: 0.5,
            opacity: 0.8,
            fillOpacity: 0.8}
        },
    onEachFeature: function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude:${feature.properties.mag}</p>`);
      }
  }).addTo(myMap)

  // Set up legend on the map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          depth = [90, 70, 50, 30, 10, -10],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
              '<i style="background:' + color(depth[i] + 1) + '"></i> ' +
              depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}
