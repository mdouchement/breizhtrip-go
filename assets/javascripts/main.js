/* global L */
let map = L.map('map').setView([48.7455, -3.4696], 13)
let mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>'

L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; ' + mapLink,
    maxZoom: 18
  }
).addTo(map)

map.zoomControl.setPosition('topright')
