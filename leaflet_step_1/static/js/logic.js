function createMap(data){
  console.log(data);
  let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })
  let earthquakeMarkers = [];
  data.features.forEach((earthquake)=>{
    let location = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]
    let ecolor = "";
    let depth = earthquake.geometry.coordinates[2];
    let magnitude = earthquake.properties.mag;
    let eradius = parseInt(magnitude * 20000)
    if (depth >= 90){
      ecolor = "#FF0000"
    }else if (depth<90 && depth>=70){
      ecolor = "#ff6600"
    }else if (depth<70 && depth>=50){
      ecolor = "#FFCC00"
    }else if (depth<50 && depth>=30){
      ecolor = "#99ff00"
    }else if (depth<30 && depth>=10){
      ecolor = "#33ff00"
    }else{
      ecolor = "#00FF00"
    }
  earthquakeMarkers.push(L.circle(location,{
      stoke: false,
      fillOpacity: 0.75,
      color: ecolor,
      fillColor: ecolor,
      radius: eradius
    })
    .bindPopup(`<h3>${earthquake.properties.place}<hr> ${Date(earthquake.properties.time)}`))
  });
  let baseMaps = {
    "Streets": streetmap
  };
  let earthquakeLayer = L.layerGroup(earthquakeMarkers);
  let overlayMaps = {
    "Earthquakes": earthquakeLayer
  };
  let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 2.5,
    layers: [streetmap, earthquakeLayer]
  });
  L.control.layers(baseMaps, overlayMaps,{collapsed:false}).addTo(myMap);

  let legend = L.control({position:"bottomright"});
  legend.onAdd = function(){
    let div = L.DomUtil.create("div", "info legend");
    let limits = geojson.options.limits;
    let colors = geojson.options.colors;
    var labels = [];
    var legendInfo = "<h1>Earthquake Depth</h1" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });  
  
  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(createMap);