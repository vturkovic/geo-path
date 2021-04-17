"use strict";

///Check for authetication and read user info
checkAuthetication();

///Check user role
function checkUserRole(){
  if(role != 'mod'){
    window.location.href="index.html"
  }
}
checkUserRole();

///Hide admintools for regular users
hideAdmintools();

///Rendering username top right
renderUserName();

///Dropdown logout function
document.getElementById("logout-dropdown").addEventListener("click", logout);

///Dropdown profile page function
document
  .getElementById("profile-page-dropdown")
  .addEventListener("click", renderProfilePage);


///

///Map rendering
let map, infoWindow, request, service;

function initMap() {
    const MARKER_PATH =
          "https://developers.google.com/maps/documentation/javascript/images/marker_green";
      
    ///Google Places Autocomplete callback
    activatePlacesSearch();

    let el = document.getElementById("listing");
    el.setAttribute('style', 'visibility:hidden;');
    
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 0, lng: 0 },
      zoom: 10,
      mapId: 'b8a604f0080a7812',
      mapTypeControl: false,
    });
  
    infoWindow = new google.maps.InfoWindow();
  
    if (navigator.geolocation) {
      let options = {    
        enableHighAccuracy: true,    
        timeout: 10000,    
        maximumAge: 300000 
      };
  
      function success(pos) {
        let crd = pos.coords;

        ///Current position OR position from search
        if(localStorage.getItem("lat") === null || localStorage.getItem("lng") === null){

          pos = {
            lat: crd.latitude,
            lng: crd.longitude,
          };

        }else{

          const lat = parseFloat(localStorage.getItem("lat"));
          const lng = parseFloat(localStorage.getItem("lng"));
          pos = {
            lat: lat,
            lng: lng,
          };
        }

        infoWindow.setPosition(pos);
        // infoWindow.setContent("You are here");
        // infoWindow.open(map);
  
        map.setCenter(pos);

        let image = {
          size: new google.maps.Size(45, 65),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(34, 34)
        };
  
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
          animation: google.maps.Animation.DROP,
          size: google.maps.Size(24, 25),
          title: image
        });

          google.maps.event.addListener(map, 'rightclick', function(event){
          
          let typeOfPlaceRightClick = localStorage.getItem("typeOfPlace");
          
          let keyword = document.getElementById("key_word").value;
          let keywordFormated = JSON.stringify(keyword);
          
          map.setCenter(event.latLng)

          
          const marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            animation: google.maps.Animation.DROP
          });
         
          service = new google.maps.places.PlacesService(map);
          
          let requestRC = {
            location: event.latLng,
            radius: 7000,
            types: [`${typeOfPlaceRightClick}`],
            name: keywordFormated
            // name: [`${keyword}`]
          };

          service.nearbySearch(requestRC, callback)

          })
      }

      function callback(results, status){
    
        if(status == google.maps.places.PlacesServiceStatus.OK){ 
          clearTableResults();
          clearMarkerResults(markers);
          for(let i=0; i<results.length; i++){
            setTimeout(function() {
              markers.push(createMarker(results[i]));
              addResult(results[i], i);
            }, i*100);
            
          }
        }
      }

      function createMarker(place){
        let markerLetter;
    
        if(place.name[0].toUpperCase().match(/[a-zA-Z]/)){
          markerLetter = place.name[0].toUpperCase();
        }else{
          markerLetter = "A";
        }
    
        const markerIcon = MARKER_PATH + markerLetter + ".png";
        let marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });
    
        google.maps.event.addListener(marker, 'click', function(){
          infoWindow.setContent(`<p
          style="font-family: gothambook;
          text-align: center;
          top: 10px !important;
          width: 85px !important;">
          <img src="${place.icon}" width="20"><br>${place.name}<br>${place.vicinity}</p>`);
          console.log(place);
          infoWindow.open(map, this);
        });
        return marker;
      }
    
      function addResult(result, i) {
        const results = document.getElementById("results");
    
        let markerLetter;
    
        if(result.name[0].toUpperCase().match(/[a-zA-Z]/)){
          markerLetter = result.name[0].toUpperCase();
        }else{
          markerLetter = "A";
        }
        
        const markerIcon = MARKER_PATH + markerLetter + ".png";
        const tr = document.createElement("tr");
        tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
      
        tr.onclick = function () {
          google.maps.event.trigger(markers[i], "click");
        };
        const iconTd = document.createElement("td");
        const nameTd = document.createElement("td");
        const icon = document.createElement("img");
        icon.src = markerIcon;
        icon.setAttribute("class", "placeIcon");
        icon.setAttribute("className", "placeIcon");
        const name = document.createTextNode(result.name);
        iconTd.appendChild(icon);
        nameTd.appendChild(name);
        tr.appendChild(iconTd);
        tr.appendChild(nameTd);
        results.appendChild(tr);
      }
    
      function clearTableResults(){
        const results = document.getElementById("results");
        while (results.childNodes[0]) {
          results.removeChild(results.childNodes[0]);
        }
      }
    
      function clearMarkerResults() {
        for (let i = 0; i < markers.length; i++) {
          if (markers[i]) {
            markers[i].setMap(null);
          }
        }
        markers = [];
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
  
      navigator.geolocation.getCurrentPosition(success, error, options);

  
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  } 


///Finding location with coordinates
document.getElementById("search-coords-button").addEventListener("click", findLocationWithCoordinatesPlaces);

///Finding location by address
document.getElementById("search-address-button").addEventListener("click", findLocationWithAddressPlaces);

let markers = [];
///Change type of place

const changeTypeOfPlace = (e) => { 
  e.preventDefault();

  // markers = [];

  clearTableResults();
  clearMarkerResults(markers);

  let el = document.getElementById("listing");
  el.setAttribute('style', 'opacity:0.85; visibility:visible;');

  let keyword = document.getElementById("key_word").value;
  let keywordFormated = JSON.stringify(keyword);

  let typeOfPlace = document.getElementById("search-place-type-input").value;
  localStorage.setItem("typeOfPlace", typeOfPlace);

  const MARKER_PATH =
          "https://developers.google.com/maps/documentation/javascript/images/marker_green";

  let options = {    
    enableHighAccuracy: true,    
    timeout: 10000,    
    maximumAge: 300000 
  };

  // google.maps.event.addListener(map, 'dragend', function(event){
  //   console.log("drag end")
  // })

  

  function success(pos) {
    let crd = pos.coords;

    ///Current position OR position from serach
    if(localStorage.getItem("lat") === null || localStorage.getItem("lng") === null){

      pos = {
        lat: crd.latitude,
        lng: crd.longitude,
      };

    }else{

      const lat = parseFloat(localStorage.getItem("lat"));
      const lng = parseFloat(localStorage.getItem("lng"));
      pos = {
        lat: lat,
        lng: lng,
      };
    }

    // pos = {
    //   lat: crd.latitude,
    //   lng: crd.longitude,
    // };

    infoWindow.setPosition(pos);
    // infoWindow.setContent("You are here");
    // infoWindow.open(map);

    map.setCenter(pos);

    const marker = new google.maps.Marker({
      position: pos,
      map: map,
      animation: google.maps.Animation.DROP
    });

    ///Places

    service = new google.maps.places.PlacesService(map);

    

    request = {
      location: pos,
      radius: 7000,
      types: [`${typeOfPlace}`],
      name:  keywordFormated
      // name: "konzum"
    };

    service.nearbySearch(request, callback);

  }

  function callback(results, status){
    
    if(status == google.maps.places.PlacesServiceStatus.OK){ 
      clearTableResults();
      clearMarkerResults(markers);
      for(let i=0; i<results.length; i++){
        setTimeout(function() {
          markers.push(createMarker(results[i]));
          addResult(results[i], i);
        }, i*100);
        
      }
    }
  }

  function createMarker(place){
    let markerLetter;

    if(place.name[0].toUpperCase().match(/[a-zA-Z]/)){
      markerLetter = place.name[0].toUpperCase();
    }else{
      markerLetter = "A";
    }

    const markerIcon = MARKER_PATH + markerLetter + ".png";
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      icon: markerIcon
    });

    google.maps.event.addListener(marker, 'click', function(){
      infoWindow.setContent(`<p
      style="font-family: gothambook;
      text-align: center;
      top: 10px !important;
      width: 85px !important;">
      <img src="${place.icon}" width="20"><br>${place.name}<br>${place.vicinity}</p>`);
      console.log(place);
      infoWindow.open(map, this);
    });
    return marker;
  }

  function addResult(result, i) {
    const results = document.getElementById("results");

    let markerLetter;

    if(result.name[0].toUpperCase().match(/[a-zA-Z]/)){
      markerLetter = result.name[0].toUpperCase();
    }else{
      markerLetter = "A";
    }
    
    const markerIcon = MARKER_PATH + markerLetter + ".png";
    const tr = document.createElement("tr");
    tr.style.backgroundColor = i % 2 === 0 ? "#F0F0F0" : "#FFFFFF";
  
    tr.onclick = function () {
      google.maps.event.trigger(markers[i], "click");
    };
    const iconTd = document.createElement("td");
    const nameTd = document.createElement("td");
    const icon = document.createElement("img");
    icon.src = markerIcon;
    icon.setAttribute("class", "placeIcon");
    icon.setAttribute("className", "placeIcon");
    const name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    results.appendChild(tr);
  }

  function clearTableResults(){
    const results = document.getElementById("results");
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  function clearMarkerResults() {
    for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }
  
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
  
}

///Search place type input
document.getElementById("search-place-type").addEventListener("change", changeTypeOfPlace)

