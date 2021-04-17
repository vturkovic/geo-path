"use strict";

///Check for authetication and read user info
checkAuthetication();

///Check user role
function checkUserRole(){
  if(role != 'driver'){
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

///Initialize
function initialize() {
    initMap();
    initAutoComplete();
 }

 function initAutoComplete() {
  let input = document.getElementById("search-address-input");
  let autocomplete = new google.maps.places.Autocomplete(input);
 }

///Map rendering
let map;
// let infoWindow;
function initMap() {


    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 45.815399, lng: 15.966568},
      zoom: 8,
      mapId: '38e675fd49796839',
      mapTypeControl: false,
    });
  
    if (navigator.geolocation) {
      let options = {    
        enableHighAccuracy: true,    
        // timeout: 10000,    
        // maximumAge: 300000 
      };
  
      function success(pos) {
        

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

    //Find next/oldest route
    let myHeadersFindNextRoute = new Headers();
    myHeadersFindNextRoute.append("Authorization", `Bearer ${token}`);

    let requestOptionsFindNextRoute = {
      method: 'GET',
      headers: myHeadersFindNextRoute,
      redirect: 'follow'
    };

    fetch(`/route/uncompleted/${id}`, requestOptionsFindNextRoute)
    .then(response => response.text())
    .then(result => {
    let data = JSON.parse(result)
    console.log(data)

    let dateVar = '2030-01-01';
    
    
    let obj = {};
    
    for(let i=0; i<data.length; i++){
      if(data[i].date < dateVar){

        dateVar = data[i].date;
        obj = data[i]

      } else if( data[i].date == dateVar){

        let timeVar = '24:00';
        if(data[i].startTime < timeVar){

          timeVar = data[i].startTime;
          obj = data[i];
        }
      }
    }

    console.log(obj);  

    for(let i=0; i<obj.waypoints.length; i++){
      console.log("waypoint" + i)

      let form = document.getElementById("form_location_input");

      const newDiv = document.createElement("input");
      
      form.appendChild(newDiv);
      // count = count + 1;

      newDiv.setAttribute("style", "position: relative; margin-left: 25px; margin-top: 15px; width: 230px; height: 40px; border-radius: 20px; text-align: center;");
      newDiv.setAttribute("class","form-control form-control-user pac-target-input");
      newDiv.setAttribute("type","text");
      newDiv.setAttribute("id",`next-location-${i}`);
      newDiv.setAttribute("readonly","");

      if(address){
        // newDiv.setAttribute("placeholder",`${address}`);
        newDiv.setAttribute("value",`${obj.waypoints[i]}, ${obj.orders[i]}`);
      } else{
        newDiv.setAttribute("placeholder","Next location");
      }

      const newLabel = document.createElement("label");
      form.appendChild(newLabel);
      newLabel.setAttribute("class","containerCheck");
      newLabel.setAttribute("id",`label-${i}`);
      newLabel.setAttribute("style","position: relative; width: 30px; left: 270px; top: -30px;");

      
      const label = document.getElementById(`label-${i}`);

      const newInput = document.createElement("input");
      label.appendChild(newInput);
      newInput.setAttribute("type", "checkbox");
      newInput.setAttribute("id", `checkbox-${i}`);
      newInput.setAttribute("name", `${obj.orders[i]}`)

      const newSpan = document.createElement("span");
      label.appendChild(newSpan);
      newSpan.setAttribute("class", "checkmark");

    }

    //Populate Route Info
    function populateRouteInfo() {
      document.getElementById("date-input").value = obj.date;
      document.getElementById("appt").value = obj.startTime;
      document.getElementById("distance-input").value = obj.distance + " km";
      document.getElementById("time-duration-input").value = obj.timeDuration + " min";
      document.getElementById("order-category").value = obj.category;
    }
    populateRouteInfo();


    let directionsService = new google.maps.DirectionsService();

    let renderOptions = { 
      draggable: true
    };
    let directionDisplay = new google.maps.DirectionsRenderer(renderOptions);

  

    //set the directions display service to the map
    directionDisplay.setMap(map);

    let waypoints = [];
    for (let i = 0; i < obj.waypoints.length; i++) {
        let address = obj.waypoints[i];
        if (address !== "") {
            waypoints.push({
                location: address,
                stopover: true
            });
        }
    }

    //set the starting address and destination address
    let originAddress = (waypoints[0].location);
     waypoints[0].stopover = false;
    let destinationAddress = (waypoints[waypoints.length-1].location);
    waypoints[waypoints.length-1].stopover= false;

    console.log("originAddress", originAddress)
    console.log("destinationAddress", destinationAddress)


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
      }
      else {
          //handle error
      }
  });

  //Update route to complete/Update orders
  function completeRoute(e) {
    e.preventDefault();


    let checked = 0;
    for(let i=0; i<obj.waypoints.length; i++){

      let checkbox = document.getElementById(`checkbox-${i}`);

      //Update orders to complete
      if(checkbox.checked){
        checked++;
        let id = checkbox.name;
        
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({"completed":"true"});

        let requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`/orders/${id}`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }else {
        checked++;
        let id = checkbox.name;
        
        let myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({"processed":"false","unsuccessful":"true"});

        let requestOptions = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`/orders/${id}`, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      }
      
    }

    ///Update route to complete if all checkboxes are checked
    // if(checked==obj.waypoints.length){
      
      let id = obj._id;
      
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({"completed":"true"});

      let requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`/route/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    // }

    window.location.href="next-route.html"

  }
  document.getElementById("complete_route_button").addEventListener('click', completeRoute)
  })
  .catch(error => console.log('error', error)); 

  
  } 

  createRoute();


}


///Finding location with coordinates
document.getElementById("search-coords-button").addEventListener("click", findLocationWithCoordinates);

///Finding location by address
document.getElementById("search-address-button").addEventListener("click", findLocationWithAddressDefault);



