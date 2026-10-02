
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90 Longitude and latitude
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({offset:25})
  .setHTML(`<h6><b>${listing.title}</b></h6><p>Exact Location will be shared after booking</p>`))
  .addTo(map);