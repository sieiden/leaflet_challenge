# leaflet_challenge
NW Bootcamp Leaflet HW

This homework uses mapbox, leaflet, and javascript to build an interactive map of all earthquakes in the last 7 days using data from the United States Geological Survey (USGS) API.

# Part 1
Part one plots earthquakes from the last seven days using latitude and longitude coordinates. The color of the circle represents the depth of the earthquake while the radius of the circle represents the magnitude of the earthquake. The larger the circle, the greater the magnitude. 

![Screenshot 2021-06-18 152844](https://user-images.githubusercontent.com/68086211/122613253-26ad9700-d04a-11eb-8413-0e1fa4c0b238.png)

The map is rendered by passing data from the USGS API using d3.json() method into a createMaps function which maps the longitude and latitude of each earthquake, determines the color and radius of the plotted circle using the depth and magnitude, and adds the time and place data to the tool tip.

By clicking on each circle, you can get the time and place of the earthquake inside of a pop up box.

![Screenshot 2021-06-18 153604](https://user-images.githubusercontent.com/68086211/122613531-9e7bc180-d04a-11eb-8b8e-538453e8e79c.png)


# Part 2

Part 2 of the homework plots the same earthquake data, but adds a control panel to switch between map backgrounds (streets, dark, satellite) and turns the earthquake layer on and off.

![Screenshot 2021-06-18 153415](https://user-images.githubusercontent.com/68086211/122613376-5b215300-d04a-11eb-9d17-e730eb8cdf52.png)

