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
  
  //create a legend
  let breaks = [-10,10,30,50,70,90]
  let labels = ["-10-10","10-30","30-50","50-70","70-90","90+"]

  function getColor(d){
    return d > breaks[5] ? "#FF0000":
    d<breaks[5] && d>=breaks[4] ? "#ff6600":
    d<breaks[4] && d>=breaks[3] ? "#ffcc00":
    d<breaks[3] && d>=breaks[2] ? "#99ff00":
    d<breaks[2] && d>=breaks[1] ? "#33ff00":
    "#00FF00"
  }

  let legend = L.control({position:"bottomright"});
  legend.onAdd = function(map){
    let div = L.DomUTil.create('div','info legend');
    for (let i = 0; i<breaks.length; i++){
      div.innterHTML +=
      '<i style="background:' +
      getColor(breaks[i]) + '"></i ' +
      labels[i] + (breaks ? ' ' + '<br>' : '')
    }
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}

//create a URL object
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//call the data from the API and feed it into the createMap function
d3.json(queryUrl).then(createMap);
