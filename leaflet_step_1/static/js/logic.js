function createMap(data){
  console.log(data);

  //add the tile layer for the map
  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

  //create the earthquake circles using depth and magnitude
  let earthquakeMarkers = [];
  data.features.forEach((earthquake)=>{
    let location = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]
    let depth = earthquake.geometry.coordinates[2];
    let magnitude = earthquake.properties.mag;
    let eradius = magnitude * 20000
  earthquakeMarkers.push(L.circle(location,{
      stoke: false,
      fillOpacity: 0.75,
      color: circleColor(depth),
      fillColor: circleColor(depth),
      radius: eradius
    })
    .bindPopup(`<h3>${earthquake.properties.place}<hr> ${Date(earthquake.properties.time)}`))
  });

  //set the baseMap
  let baseMaps = {
    "Streets": streetmap
  };

  //add the earthquake layer
  let earthquakeLayer = L.layerGroup(earthquakeMarkers);

  //set the overlay
  let overlayMaps = {
    "Earthquakes": earthquakeLayer
  };

  //create a map object
  let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 2.5,
    layers: [streetmap, earthquakeLayer]
  });

  // Legend Control
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
   
      // create div to hold legend
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10,10,30,50,70,90]
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
  };

  // add legend to map
  legend.addTo(myMap);

  //function to color circles based on depth
  function circleColor(depth) {
    if (depth >= 90) {
        color = "#FF0000";
    } else if (depth < 90 && depth >= 70) {
        color = "#ff6600";
    } else if (depth < 70 && depth >= 50) {
        color = "#FFCC00";
    } else if (depth < 50 && depth >= 30){
        color = "#99ff00";
    } else if (depth < 30 && depth >= 10){
        color = "#33ff00"
    } else{
        color = "#00FF00"
    }
    return color; 
  };
}

//create a URL object
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//call the data from the API and feed it into the createMap function
d3.json(queryUrl).then(createMap);
