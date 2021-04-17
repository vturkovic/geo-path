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
  

//Load routes select option
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

fetch("/route/findAll", requestOptions)
  .then(response => response.text())
  .then(result => {
      let formSelect = document.getElementById("select_route"); 
      let options = JSON.parse(result) 

      console.log(options)
    
      for(let i = 0; i < options.length; i++) {
      let opt = `${options[i].waypoints[0]}` + `, ` + `${options[i].waypoints[options[i].waypoints.length-1]}` + `, ` + `${options[i]._id}`;
      let el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      formSelect.appendChild(el);
    }

     
  
  
  })
  .catch(error => console.log('error', error));

//Load drivers select option
let myHeadersDrivers = new Headers();
    myHeadersDrivers.append("Authorization", `Bearer ${token}`);
    myHeadersDrivers.append("Content-Type", "application/json");

    let objDrivers = {
      worksFor
    }

    let rawDrivers = JSON.stringify(objDrivers);

    let requestOptionsDrivers = {
      method: 'POST',
      headers: myHeadersDrivers,
      body: rawDrivers,
      redirect: 'follow'
    };

    fetch("/drivers/list", requestOptionsDrivers)
      .then(response => response.text())
      .then(result => {

        let formSelect = document.getElementById("select_driver"); 
        let options = JSON.parse(result).slice(1); 
    
        for(let i = 0; i < options.length; i++) {
        let opt = `${options[i].firstName}` + `, ` + `${options[i]._id}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
      formSelect.appendChild(el);
      }
      })
      .catch(error => console.log('error', error));


let count = 0;     

//Add waypoint
function addWaypoint(e) {
  e.preventDefault()

  if(count<9){
  count++;

  let form = document.getElementById("add-waypoint");

  const newDiv = document.createElement("div");
  form.appendChild(newDiv);
  
  newDiv.setAttribute("class","form-group")
  newDiv.setAttribute("style","position: relative; left:20%; width: 280px;")

  const newInput = document.createElement("input");
  newDiv.appendChild(newInput);

  newInput.setAttribute("class","form-control form-control-user")
  newInput.setAttribute("type","text")
  newInput.setAttribute("id",`input-${count}`)
  newInput.setAttribute("placeholder","Next location")
  newInput.setAttribute("autocomplete","off")


  let input = document.getElementById(`input-${count}`)
  let inputAutocomplete = new google.maps.places.Autocomplete(input);
  
  console.log(count)
  }
}
document.getElementById("add-waypoint-button").addEventListener('click', addWaypoint) 

//Remove waypoint
function removeWaypoint(e) {
  e.preventDefault()
  
  let form = document.getElementById("add-waypoint");

  if(!count==0){
  if(form.lastChild){
    form.removeChild(form.lastChild);
    count = count - 1;
    }  
    console.log(count)
  }
  
}
document.getElementById("remove-waypoint-button").addEventListener('click', removeWaypoint)


///Load route info      
function loadRouteInfo(){
  document.getElementById("add-buttons").style.display = "inline";

  let loc = document.getElementById("select_route").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/route/byid/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result)
      console.log(data)

      const routeDriver = data.driver;
      const routeDate = data.date;
      const routeTime = data.startTime;
      const routeComplete = data.completed;

      document.getElementById("current-driver").value = routeDriver;
      document.getElementById("date-input").value = routeDate;
      document.getElementById("appt").value = routeTime;
      document.getElementById("complete_route").value = routeComplete;

      let myNode = document.getElementById("add-waypoint");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
        console.log("obriso")
      }


    for(let i=0; i<data.waypoints.length; i++)  {
      count=data.waypoints.length;

      let form = document.getElementById("add-waypoint");

      const newDiv = document.createElement("div");
      form.appendChild(newDiv);
      
      newDiv.setAttribute("class","form-group")
      newDiv.setAttribute("style","position: relative; left:20%; width: 280px;")

      const newInput = document.createElement("input");
      newDiv.appendChild(newInput);

      newInput.setAttribute("class","form-control form-control-user")
      newInput.setAttribute("type","text")
      newInput.setAttribute("id",`input-${i}`)
      newInput.setAttribute("value",`${data.waypoints[i]}`)
      newInput.setAttribute("autocomplete","off")
 

      let input = document.getElementById(`input-${i}`)
      let inputAutocomplete = new google.maps.places.Autocomplete(input);
      }

      console.log("trenutno je count", count)

      ///Update route
function updateRoute(e) {
  e.preventDefault();

  let loc = document.getElementById("select_route").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let idRoute = idSplit.trim();


  let loc1 = document.getElementById("select_driver").value;
  let idSplit1 = loc1.substring(loc1.lastIndexOf(",") + 1);
  let driver = idSplit1.trim();

  let newWaypoints = [];
  for(let i=0; i<count+1; i++){
    let loc = document.getElementById(`input-${i}`)
    if(loc){
      newWaypoints.push(loc.value)
      console.log("upiso", i)
    } 
  }

  const updateInput = {
    driver: driver,
    date: document.getElementById("date-input").value,
    startTime: document.getElementById("appt").value,
    completed: document.getElementById("complete_route").value,
    waypoints: newWaypoints
  };

  function clean(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === "") {
        delete obj[propName];
      }
    }
  }
  clean(updateInput);

  console.log(updateInput);

  let myHeadersRoute = new Headers();
  myHeadersRoute.append("Authorization", `Bearer ${token}`);
  myHeadersRoute.append("Content-Type", "application/json");

  let rawRoute = JSON.stringify(updateInput);

  let requestOptionsRoute = {
    method: "PATCH",
    headers: myHeadersRoute,
    body: rawRoute,
    redirect: "follow",
  };

  fetch(`/route/${idRoute}`, requestOptionsRoute)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  window.location.href = "manage-routes.html"
}


document.getElementById("button-create").addEventListener('click', updateRoute)

    })
    .catch(error => console.log('error', error));
  
    
}
document.getElementById("select_route").addEventListener('change', loadRouteInfo)

///Delete selected route
function deleteRoute(){
  let loc = document.getElementById("select_route").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let idRoute = idSplit.trim();

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/routeId/${idRoute}`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  window.location.href="manage-routes.html"

}
document.getElementById("delete-button").addEventListener('click', deleteRoute)

  
