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

// Populate Dropdown selection with drivers from company
let myHeadersDriverSelect = new Headers();
myHeadersDriverSelect.append("Authorization", `Bearer ${token}`);
myHeadersDriverSelect.append("Content-Type", "application/json");

let obj = {
  worksFor
}

let raw = JSON.stringify(obj);

    let requestOptionsDriverSelect = {
      method: 'POST',
      headers: myHeadersDriverSelect,
      body: raw,
      redirect: 'follow'
    };

fetch("/drivers/list", requestOptionsDriverSelect)
  .then(response => response.text())
  .then(result => {
    let driverSelect = document.getElementById("select_driver");  
    let options = JSON.parse(result).slice(1); 

    for(let i = 0; i < options.length; i++) {
    let opt = `${options[i].firstName}` + `, ` + `${options[i]._id}`;
    let el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    driverSelect.appendChild(el);
}

  })
  .catch(error => console.log('error', error));

///Minimize Create Route Form
function minimizeCreateRouteForm ()  {
  let minvis = document.getElementById("minimize-visibility")
  let minhei = document.getElementById("minimize-height")

  if(minvis.style.display == 'inline'){
    minvis.style.display='none';
    minhei.style.minHeight='0px';
    minhei.style.height='0px';
  }else{
    minvis.style.display='inline';
    minhei.style.minHeight='190px';
    minhei.style.height='';
  }
}
document.getElementById("create-route-minimize").addEventListener("click", minimizeCreateRouteForm);

///Minimize Assign Route Form
function minimizeAssignRouteForm ()  {
  let minvis = document.getElementById("minimize-visibility-assign")
  let minhei = document.getElementById("minimize-height-assign-route")

  if(minvis.style.display == 'inline'){
    minvis.style.display='none';
    minhei.style.minHeight='0px';
    minhei.style.height='0px';
  }else{
    minvis.style.display='inline';
    minhei.style.minHeight='360px';
    minhei.style.height='';
  }
}
document.getElementById("assign-route-minimize").addEventListener("click", minimizeAssignRouteForm);

///Add location input on +
let count = 0;

function addLocationInput (id, address)  {
  console.log("dodavanje lokacije")

  if(count<10){

  let form = document.getElementById("form_location_input");

  const newDiv = document.createElement("input");
  
  form.appendChild(newDiv);
  count = count + 1;

  newDiv.setAttribute("style", "position: relative; margin-left: 25px; margin-top: 15px; width: 270px; height: 40px; border-radius: 20px; text-align: center;");
  newDiv.setAttribute("class","form-control form-control-user pac-target-input");
  newDiv.setAttribute("type","text");
  newDiv.setAttribute("id",`next-location-${count}`);
  if(address){
    // newDiv.setAttribute("placeholder",`${address}`);
    newDiv.setAttribute("value",`${address}, ${id}`);
  } else{
    newDiv.setAttribute("placeholder","Next location");
  }

  newDiv.setAttribute("name","Next location");
  newDiv.setAttribute("autocomplete","off");

  let nextLocation = document.getElementById(`next-location-${count}`)

  let locationAutocomplete = new google.maps.places.Autocomplete(nextLocation);
  }

}
document.getElementById("add-waypoint").addEventListener("click", addLocationInput);

//Remove location input -
function removeLocationInput() {

  let form = document.getElementById("form_location_input");
  if(form.lastChild){
  form.removeChild(form.lastChild);
  count = count - 1;
  }
}
document.getElementById("remove-waypoint").addEventListener("click", removeLocationInput);


///Initialize
function initialize() {
    initMap();
    initAutoComplete();
 }

 function initAutoComplete() {
  let input = document.getElementById("search-address-input");
  let autocomplete = new google.maps.places.Autocomplete(input);
 }

let map;

function initMap() {
    const greenMarker = "green";
    const redMarker = "red";
    const yellowMarker = "yellow"

    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 45.815399, lng: 15.966568 },
      zoom: 9,
      mapId: '38e675fd49796839',
      mapTypeControl: false,
    });


    ///Read all UNprocessed orders
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let obj = {
      company: worksFor
    }

    let raw = JSON.stringify(obj);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/ordersAll", requestOptions)
      .then(response => response.text())
      .then(result => {
        let data = JSON.parse(result);

        let markerOrders = [];

        for(let i=0; i<data.length; i++){

          let obj = {
            address: data[i].origin, 
            lat: data[i].originCoords.lat, 
            lng: data[i].originCoords.lng,
            status: data[i].processed,
            id: data[i]._id,
            destination: data[i].destination,
            unsuccessful: data[i].unsuccessful
          }
          markerOrders.push(obj);
          
        }

        let infowindow = new google.maps.InfoWindow;
    
        let marker, i;
    
        for (i = 0; i < markerOrders.length; i++) {  

          let url = "";
          if(markerOrders[i].status == true){
            url = `http://maps.google.com/mapfiles/ms/icons/${greenMarker}-dot.png`
          }else if(markerOrders[i].status == false && markerOrders[i].unsuccessful == true){
            url = `http://maps.google.com/mapfiles/ms/icons/${yellowMarker}-dot.png`
          }else if(markerOrders[i].status == false){
            url = `http://maps.google.com/mapfiles/ms/icons/${redMarker}-dot.png`
          }

            let image = {
              url: url,
              size: new google.maps.Size(45, 65),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(34, 34)
            };

              marker = new google.maps.Marker({
                position: new google.maps.LatLng(markerOrders[i].lat, markerOrders[i].lng),
                map: map,
                animation: google.maps.Animation.DROP,
                icon: image
              });
  
              google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent("<div id=infoContent><p>" + "origin: " + markerOrders[i].address + "<br>" +
                        "destination: " + markerOrders[i].destination + "<br>" + "order: " + markerOrders[i].id + "</p></div>");

                        infowindow.open(map, marker);
                        map.setCenter(data[i].originCoords);

                        addLocationInput(markerOrders[i].id, markerOrders[i].address);
                        
                    }
              })(marker, i));
        }
      })
      .catch(error => console.log('error', error));

  
    if (navigator.geolocation) {
      let options = {    
        enableHighAccuracy: true,    
        // timeout: 10000,    
        // maximumAge: 300000 
      };
  
      function success(pos) {

        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let obj = {
          company: worksFor
        }

        let raw = JSON.stringify(obj);

        let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("/orders/findAllUnprocessed", requestOptions)
        .then(response => response.text())
        .then(result => {
        let data = JSON.parse(result);
          

          if(data[0].originCoords){
            map.setCenter(data[0].originCoords);
          } else{
            let crd = pos.coords;
      
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);

            pos = {
              lat: crd.latitude,
              lng: crd.longitude,
            };
            map.setCenter(pos)
          }
          
        })
        .catch(error => console.log('error', error));

      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
  
      navigator.geolocation.getCurrentPosition(success, error, options);

  
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }


    //Create route
    function createRoute(e) {
      e.preventDefault();

    let directionsService = new google.maps.DirectionsService();

      let routeColor = document.getElementById("route_color").value;

      if(!routeColor){
        routeColor = "#33B8FF"
      }

    let renderOptions = { 
      draggable: true,
      polylineOptions: {
        strokeColor: routeColor
      } 
    };
    let directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

    directionDisplay.setMap(map);

    const items = [];

    const ids = [];

    console.log(count)

    for(let i=1; i<=count; i++){
    let loc = document.getElementById(`next-location-${i}`).value;

    let locSplit = loc.split(",").slice(0,2).join(",");
    let locTrimed = locSplit.trim();
    items.push(locTrimed);

    let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
    let idTrimed = idSplit.trim();
    ids.push(idTrimed);

    }
  
    let waypoints = [];
    for (let i = 0; i < items.length; i++) {
        let address = items[i];
        if (address !== "") {
            waypoints.push({
                location: address,
                stopover: true
            });
        }
    }

    if(waypoints < 2){
      alert("Enter atleast two locations!");
      return;
    }

    //set the starting address and destination address
    let originAddress = (waypoints[0].location);
     waypoints[0].stopover = false;
    let destinationAddress = (waypoints[waypoints.length-1].location);
    waypoints[waypoints.length-1].stopover= false;


    let categories = []
    for(let i=0; i<ids.length; i++){
      if(ids[i].length > 20){

      let myHeadersCate = new Headers();
      myHeadersCate.append("Authorization", `Bearer ${token}`);

      let requestOptionsCate = {
        method: 'GET',
        headers: myHeadersCate,
        redirect: 'follow'
      };

      fetch(`/ordersOne/${ids[i]}`, requestOptionsCate)
        .then(response => response.text())
        .then(result => {
          let dataCate = JSON.parse(result)
          categories.push(dataCate.category) 

          })
        .catch(error => console.log('error', error));
      }
    }


    //build directions request
    let request = {
                origin: originAddress,
                destination: destinationAddress,
                waypoints: waypoints, //an array of waypoints
                optimizeWaypoints: true, //set to true if you want google to determine the shortest route or false to use the order specified.
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

    //get the route from the directions service
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionDisplay.setDirections(response);

            console.log(response.routes)

            let total_distance = 0.0;
            let total_duration = 0.0;
            for (let i=0; i<response.routes[0].legs.length; i++) {
              total_distance += response.routes[0].legs[i].distance.value;
              total_duration += response.routes[0].legs[i].duration.value;
            }

            

            let total_distance_parsed = Math.round(total_distance/1000) ;

            let total_duration_parsed = Math.round(total_duration/60);

            console.log(total_distance_parsed, total_duration_parsed)

            document.getElementById("minimize-height-assign-route").style.display = 'inline';

            document.getElementById("distance-input").value = total_distance_parsed + " km";
            document.getElementById("time-duration-input").value = total_duration_parsed + " min";


            function assignRoute(e) {
              e.preventDefault();

              let driver = document.getElementById("select_driver").value;
              let driverParsed = driver.substring(driver.indexOf(",") + 1);
              let driverTrimed = driverParsed.trim();
              let waypoints = items;
              let distance = total_distance_parsed;
              let duration = total_duration_parsed;
              let date = document.getElementById("date-input").value;
              let time = document.getElementById("appt").value;
              // let category = document.getElementById("category").value;
              let orders = ids;
              
              if(driver === ''){
                document.getElementById("select_driver").classList.add("assignRouteError")
                return;
              }else if(date === ''){
                document.getElementById("date-input").classList.add("assignRouteError")
                return;
              }else if(time === ''){
                document.getElementById("appt").classList.add("assignRouteError")
                return;
              }

              let obj = {
                company: worksFor,
                driver: driverTrimed,
                waypoints: waypoints, 
                distance: distance, 
                timeDuration: duration, 
                date: date, 
                startTime: time,
                orders: orders, 
                category: categories
              }

              let myHeaders = new Headers();
              myHeaders.append("Authorization", `Bearer ${token}`);
              myHeaders.append("Content-Type", "application/json");

              let raw = JSON.stringify(obj);

              let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
              };

              fetch("/route", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));


            
                for (let i=0; i<orders.length; i++) {

                  let idqou = orders[i];
                  let idstr = JSON.stringify(idqou);
                  let id = JSON.parse(idstr);

                  var myHeadersOrder = new Headers();
                  myHeadersOrder.append("Authorization", `Bearer ${token}`);
                  myHeadersOrder.append("Content-Type", "application/json");

                  var rawOrder = JSON.stringify({"processed":"true"});

                  var requestOptionsOrder = {
                    method: 'PATCH',
                    headers: myHeadersOrder,
                    body: rawOrder,
                    redirect: 'follow'
                  };

                  fetch(`/orders/${id}`, requestOptionsOrder)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));

                }

                window.location.href="create-route.html"
            }

            document.getElementById("assign_route_button").addEventListener('click', assignRoute);
    
        }
        else {
            //handle error
        }
    });

  } 
  document.getElementById("create_route_button").addEventListener('click', createRoute)

}


///Finding location with coordinates
document.getElementById("search-coords-button").addEventListener("click", findLocationWithCoordinates);

///Finding location by address
document.getElementById("search-address-button").addEventListener("click", findLocationWithAddressDefault);



