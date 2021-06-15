function createMap(data){
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
    earthquakeMarkers.push(
      L.circle(location,{
        stoke: false,
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        radius: 1000000
      })
      .bindPopup(`<h3>${earthquake.properties.place}<hr> ${Date(earthquake.properties.time)}`)
    );
  });
  let baseMaps = {
    "Streets": streetmap
  };
  let earthquakeLayer = L.layerGroup(earthquakeMarkers);
  let overlayMaps = {
    "Earthquakes": earthquakeLayer
  };
  let myMap = L.map("mapid", {
    center: [15.5994, -28.6731],
    zoom: 2.5,
    layers: [streetmap]
  });
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(createMap);