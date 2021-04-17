"use strict";

let token = localStorage.getItem("token");
let firstName = localStorage.getItem("firstName");
let lastName = localStorage.getItem("lastName");
let role = localStorage.getItem("role");
let email = localStorage.getItem("email");
let id = localStorage.getItem("id");
let createdAt = localStorage.getItem("createdAt");
let updatedAt = localStorage.getItem("updatedAt");
let firstLogin = localStorage.getItem("firstLogin");
let worksFor = localStorage.getItem("worksFor");
let userAddress = localStorage.getItem("userAddress");

///Get current weather by navigator geolocation
function getWeatherGeolocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("You need to enable navigator geolocation")
  }
  
  function showPosition(position) {
    let lat = position.coords.latitude 
    let lng = position.coords.longitude;

    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=0a4b1747479d780a7a2e06d65c3a1c40&units=metric`)
    .then(response => response.text())
    .then(result => {
      
      let data = JSON.parse(result)
      let city = data.name
      let country = data.sys.country
      let temp = data.main.temp.toFixed(1)
      let weatherId = data.weather[0].id

      let weatherA = document.getElementById("weather-a")
      let weatherI = document.getElementById("weather-i")
      let p1 = document.getElementById("p-1")
      let p2 = document.getElementById("p-2")

      p1.textContent = `${temp}°C`
      p2.textContent = `${city}, ${country}`

      if(weatherId > 199 && weatherId < 233){
        weatherI.className = "fas fa-bolt";
      }
      else if(weatherId > 299 && weatherId < 322){
        weatherI.className = "fas fa-cloud-sun-rain";
      }
      else if(weatherId > 499 && weatherId < 532){
        weatherI.className = "fas fa-cloud-showers-heavy";
      }
      else if(weatherId > 599 && weatherId < 623){
        weatherI.className = "far fa-snowflake";
      }
      else if(weatherId > 700 && weatherId < 782){
        weatherI.className = "fas fa-smog";
      }
      else if(weatherId == 800){
        weatherI.className = "fas fa-sun";
      }
      else if(weatherId > 800 && weatherId < 805){
        weatherI.className = "fas fa-cloud";
      }
      
      
    })
    .catch((error) => console.log("error", error));

  }
}

///Get current weather by address of user
function getWeatherAddress(){

    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${userAddress}&key=AIzaSyAbgdH58GXlcf1okyPk7AM3KT7kyRXP05o`, requestOptions)
    .then(response => response.text())
    .then(result => {
      const res = JSON.parse(result);
      const lat = res.results[0].geometry.location.lat;
      const lng = res.results[0].geometry.location.lng;


      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=0a4b1747479d780a7a2e06d65c3a1c40&units=metric`)
    .then(response => response.text())
    .then(result => {
      
      let data = JSON.parse(result)
      let city = data.name
      let country = data.sys.country
      let temp = data.main.temp.toFixed(1)
      let weatherId = data.weather[0].id

      let weatherA = document.getElementById("weather-a")
      let weatherI = document.getElementById("weather-i")
      let p1 = document.getElementById("p-1")
      let p2 = document.getElementById("p-2")

      p1.textContent = `${temp}°C`
      p2.textContent = `${city}, ${country}`

      if(weatherId > 199 && weatherId < 233){
        weatherI.className = "fas fa-bolt";
      }
      else if(weatherId > 299 && weatherId < 322){
        weatherI.className = "fas fa-cloud-sun-rain";
      }
      else if(weatherId > 499 && weatherId < 532){
        weatherI.className = "fas fa-cloud-showers-heavy";
      }
      else if(weatherId > 599 && weatherId < 623){
        weatherI.className = "far fa-snowflake";
      }
      else if(weatherId > 700 && weatherId < 782){
        weatherI.className = "fas fa-smog";
      }
      else if(weatherId == 800){
        weatherI.className = "fas fa-sun";
      }
      else if(weatherId > 800 && weatherId < 805){
        weatherI.className = "fas fa-cloud";
      }
      
    })
    .catch((error) => console.log("error", error));

    })
    .catch(error => console.log('error', error));
  
}

///IF address is entered, find weather by address, else by navigation.geolocator
if(userAddress != '' && userAddress != 'undefined'){
  getWeatherAddress();
} else{
  getWeatherGeolocation();
}

///Set cookie
function setCookie(cname, cvalue, exdays) {
  let d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

///Get cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Change theme from cookie
function changeThemeFromCookie(){
  let theme = getCookie("theme");

  let div = document.getElementById("wrapper")
  let navbar = div.getElementsByTagName("nav")
  let toggle = document.getElementById("formCheck-1")
  let content = document.getElementById("content")

  let weatherA = document.getElementById("weather-a")
  let p1 = document.getElementById("p-1")
  let p2 = document.getElementById("p-2")

  if(theme=='true'){
    toggle.setAttribute("checked", "")
    navbar[0].style.background = "linear-gradient(black,rgb(18, 60, 78) 0%,rgb(0, 0, 0) 100%),rgb(18, 60, 78)";
    navbar[1].style.background = "linear-gradient(91deg,rgb(86, 86, 86) 0%,rgb(18, 60, 78) 100%)";
    content.style.background = "linear-gradient(rgb(176, 176, 176) 0%, white)";

    weatherA.style.color = "";
    p1.style.color = "";
    p2.style.color = "";

    if(document.getElementById("search-address-button")){
      document.getElementById("search-address-button").style.background = "rgb(18, 60, 78)"
    }

    if(document.getElementById("search-coords-button")){
      document.getElementById("search-coords-button").style.background = "rgb(18, 60, 78)"
    }

  }else{
    toggle.removeAttribute("checked", "")
    navbar[0].style.background = "linear-gradient(black,rgb(115, 115, 115) 0%,rgb(0, 0, 0) 100%),rgb(18, 60, 78)";
    navbar[1].style.background = "linear-gradient(91deg,rgb(86, 86, 86) 0%,rgb(220, 220, 220) 100%)";
    content.style.background = "linear-gradient(rgb(56, 56, 56) 0%, white)";

    weatherA.style.color = "#5a5b61";
    p1.style.color = "#5a5b61";
    p2.style.color = "#5a5b61";

    if(document.getElementById("search-address-button")){
      document.getElementById("search-address-button").style.background = "rgb(86, 86, 86)"
    }

    if(document.getElementById("search-coords-button")){
      document.getElementById("search-coords-button").style.background = "rgb(86, 86, 86)"
    }
  }
}
changeThemeFromCookie()

///Change Theme
function changeThemeOnClick(){
  let toggle = document.getElementById("formCheck-1").checked
  let div = document.getElementById("wrapper")
  let content = document.getElementById("content")
  let navbar = div.getElementsByTagName("nav")

  let weatherA = document.getElementById("weather-a")
  let p1 = document.getElementById("p-1")
  let p2 = document.getElementById("p-2")

  if(toggle){
    document.getElementById("formCheck-1").setAttribute("checked", "")
    navbar[0].style.background = "linear-gradient(black,rgb(18, 60, 78) 0%,rgb(0, 0, 0) 100%),rgb(18, 60, 78)";
    navbar[1].style.background = "linear-gradient(91deg,rgb(86, 86, 86) 0%,rgb(18, 60, 78) 100%)";
    content.style.background = "linear-gradient(rgb(176, 176, 176) 0%, white)";

    weatherA.style.color = "";
    p1.style.color = "";
    p2.style.color = "";

    if(document.getElementById("search-address-button")){
      document.getElementById("search-address-button").style.background = "rgb(18, 60, 78)"
    }

    if(document.getElementById("search-coords-button")){
      document.getElementById("search-coords-button").style.background = "rgb(18, 60, 78)"
    }

    setCookie("theme", true, 30)
  }else{
    document.getElementById("formCheck-1").removeAttribute("checked", "")
    navbar[0].style.background = "linear-gradient(black,rgb(115, 115, 115) 0%,rgb(0, 0, 0) 100%),rgb(18, 60, 78)";
    navbar[1].style.background = "linear-gradient(91deg,rgb(86, 86, 86) 0%,rgb(220, 220, 220) 100%)";
    content.style.background = "linear-gradient(rgb(56, 56, 56) 0%, white)";

    weatherA.style.color = "#5a5b61";
    p1.style.color = "#5a5b61";
    p2.style.color = "#5a5b61";

    if(document.getElementById("search-address-button")){
      document.getElementById("search-address-button").style.background = "rgb(86, 86, 86)"
    }

    if(document.getElementById("search-coords-button")){
      document.getElementById("search-coords-button").style.background = "rgb(86, 86, 86)"
    }

    setCookie("theme", false, 30)
  }
}
document.getElementById("formCheck-1").addEventListener('change', changeThemeOnClick)

///Check for authetication and read user info
function checkAuthetication() {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/users/me", requestOptions)
    .then((response) => response.text())
    .then((result) => {

      const data = JSON.parse(result);

      const id = data._id;
      localStorage.setItem("id", id);
      // const token = data.user.token;
      // localStorage.setItem("token", token);
      const firstName = data.firstName;
      localStorage.setItem("firstName", firstName);
      const lastName = data.lastName;
      localStorage.setItem("lastName", lastName);
      const email = data.email;
      localStorage.setItem("email", email);
      const createdAt = data.createdAt;
      localStorage.setItem("createdAt", createdAt);
      const updatedAt = data.updatedAt;
      localStorage.setItem("updatedAt", updatedAt);
      const worksFor = data.worksFor;
      localStorage.setItem("worksFor", worksFor);
      const firstLogin = data.firstLogin;
      localStorage.setItem("firstLogin", firstLogin);
      const userAddress = data.address;
      localStorage.setItem("userAddress", userAddress);
      
      // const firstLogin = data.firstLogin;
      // localStorage.setItem("firstLogin", firstLogin);



      if (JSON.parse(result).hasOwnProperty("error")) {
        window.location.href = "index.html";
      }
      
    })
    .catch((error) => console.log("error", error));
}

///Hide admintools for regular users
function hideAdmintools() {
  if (role === "user"){
    
  } else if (role === "driver"){
    
    const a = document.getElementById("driver-tools");
    a.style.display = "";
  } else if (role === "mod"){
    
    const a = document.getElementById("moderator-tools");
    a.style.display = "";
  } else if (role === "admin") {
    
    const b = document.getElementById("admin-tools");
    b.style.display = "";
  }
}

///Resize horizontal line

function resizeLine(){
  let hr = document.getElementById(`hr-${role}`);

  if (hr.style.display === "none") {
    hr.style.display = "block";
  } else {
    hr.style.display = "none";
  }

}
document.getElementById("sidebarToggle").addEventListener('click', resizeLine)

///Rendering username top right
function renderUserName() {
  var str = document.getElementById("username").innerHTML;
  var res = str.replace("User", firstName);
  document.getElementById("username").innerHTML = res;
}

///Dropdown logout function
const logout = (e) => {
  e.preventDefault();

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/users/logout", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  localStorage.clear();
  window.location.href = "index.html";
};

///Dropdown profile page function
const renderProfilePage = (e) => {
  e.preventDefault();

  window.location.href = "profile.html";
};

///Profile.html placeholder replace
function placeholderReplace() {

  document.getElementById("email_input").placeholder = email;
  document.getElementById("first_name_input").placeholder = firstName;
  document.getElementById("last_name_input").placeholder = lastName;
  if(!userAddress){
    document.getElementById("address_input").placeholder = "Address";
  }else if(userAddress == 'undefined'){
    document.getElementById("address_input").placeholder = "Address";
  }else if(userAddress){
    document.getElementById("address_input").placeholder = userAddress;
  }
  
}

///Profile.html updating data
const userUpdateInfo = (e) => {
  e.preventDefault();

  const updateInput = {
    firstName: document.getElementById("first_name_input").value,
    lastName: document.getElementById("last_name_input").value,
    email: document.getElementById("email_input").value,
    password: document.getElementById("password_input").value,
    address: document.getElementById("address_input").value
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

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(updateInput);

  let requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/users/me", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  ///ReRender data from database and refresh
  let myHeadersRead = new Headers();
  myHeadersRead.append("Authorization", `Bearer ${token}`);

  let requestOptionsRead = {
    method: "GET",
    headers: myHeadersRead,
    redirect: "follow",
  };

  fetch("/users/me", requestOptionsRead)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      const firstName = data.firstName;
      localStorage.setItem("firstName", firstName);
      const lastName = data.lastName;
      localStorage.setItem("lastName", lastName);
      const email = data.email;
      localStorage.setItem("email", email);
      const companyName = data.companyName;
      localStorage.setItem("companyName", companyName);
      const userAddress = data.address;
      localStorage.setItem("userAddress", userAddress);

      placeholderReplace()
    })
    .catch((error) => console.log("error", error));

  setTimeout(() => {
    window.location = "profile.html";
  }, 100);
};

///Profile.html user deleting account
const userDelete = (e) => {
  e.preventDefault();

  if (confirm("Are you sure you want to delete your account?")) {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/users/me", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  localStorage.clear();
  window.location = "index.html";
  }
};

///Userlist.html rendering all users
const renderAllUsers = () => {
  let tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/users", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const res = JSON.parse(result);

      for (const user of res) {
        const tr = document.createElement("tr");
        const content = `
          <td>${user._id}</td>
          <td>${user.firstName}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${user.createdAt.slice(0, 10)}</td>
          <td>${user.updatedAt.slice(0, 10)}</td>`;

        tr.innerHTML = content;
        tableBody.appendChild(tr);
      }
    })
    .catch((error) => console.log("error", error));
};

///Manager.html finding user by id
const findUser = (e) => {
  e.preventDefault();

  const search_id = document.getElementById("search_input").value;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`/users/${search_id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      // const role = data.role;
      const firstName = data.firstName;
      const lastName = data.lastName;
      const email = data.email;
      const confirmed = data.confirmed;

      // document.getElementById("role_input").placeholder = role;
      document.getElementById("email_input").placeholder = email;
      document.getElementById("first_name_input").placeholder = firstName;
      document.getElementById("last_name_input").placeholder = lastName;
      document.getElementById("status_input").placeholder = confirmed;
    })
    .catch((error) => console.log("error", error));

    let myHeadersRole = new Headers();
    myHeadersRole.append("Authorization", `Bearer ${token}`);
    
    let requestOptionsRole = {
      method: 'GET',
      headers: myHeadersRole,
      redirect: 'follow'
    };
    
    fetch(`/roles/${search_id}`, requestOptionsRole)
      .then(response => response.text())
      .then(result => {
        const data = JSON.parse(result);
        const role = data.role;
        document.getElementById("role_input").placeholder = role;
      })
      .catch(error => console.log('error', error));
};

///Manager.html update user role

const changeUserRole = (e) => {
  e.preventDefault();

  const search_id = document.getElementById("search_input").value;

  const input = document.getElementById("role_select").value;

  const obj = {
    role: input,
  };

  let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify(obj);

    let requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(`/roles/${search_id}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

  setTimeout(() => {
    window.location = "manager.html";
  }, 100);
};

///Manger.html activate user by id
const activateUser = (e) => {
  e.preventDefault();

  const search_id = document.getElementById("search_input").value;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const updateInput = {
    confirmed: true
  };

  const raw = JSON.stringify(updateInput);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/updateUser/${search_id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  
    setTimeout(() => {
      window.location = "manager.html";
    }, 100);
};

///Manger.html deactivate user by id
const deactivateUser = (e) => {
  e.preventDefault();

  const search_id = document.getElementById("search_input").value;

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const updateInput = {
    confirmed: false
  };

  const raw = JSON.stringify(updateInput);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/updateUser/${search_id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

    setTimeout(() => {
      window.location = "manager.html";
    }, 100);
};

///Manager.html update user by id

const updateUserInfo = (e) => {
  e.preventDefault();

  const search_id = document.getElementById("search_input").value;

  const updateInput = {
    firstName: document.getElementById("first_name_input").value,
    lastName: document.getElementById("last_name_input").value,
    email: document.getElementById("email_input").value,
    password: document.getElementById("password_input").value,
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

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(updateInput);

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/updateUser/${search_id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  setTimeout(() => {
    window.location = "manager.html";
  }, 50);
};


///Finding location by address
const findLocationWithAddressPlaces = (e) => {
  e.preventDefault();

  let el = document.getElementById("listing");
  el.setAttribute('style', 'visibility:hidden;');

  let address = document.getElementById("search-address-input").value;

  console.log(address)

  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAbgdH58GXlcf1okyPk7AM3KT7kyRXP05o`, requestOptions)
    .then(response => response.text())
    .then(result => {
      const res = JSON.parse(result);
      const lat = res.results[0].geometry.location.lat;
      const lng = res.results[0].geometry.location.lng;

      console.log(lat,lng)

      const pos ={
        lat,lng
      }

      localStorage.setItem("lat", pos.lat);
      localStorage.setItem("lng", pos.lng);

      initMap();
    })
    .catch(error => console.log('error', error));

  document.getElementById("search-address-input").value = "";
  document.getElementById("search-address-input").placeholder = "Find location by address ...";
}

///Finding location by address
const findLocationWithAddressDefault = (e) => {
  e.preventDefault();

  let address = document.getElementById("search-address-input").value;

  console.log(address)

  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyAbgdH58GXlcf1okyPk7AM3KT7kyRXP05o`, requestOptions)
    .then(response => response.text())
    .then(result => {
      const res = JSON.parse(result);
      const lat = res.results[0].geometry.location.lat;
      const lng = res.results[0].geometry.location.lng;

      console.log(lat,lng)

      const pos ={
        lat,lng
      }

      localStorage.setItem("lat", pos.lat);
      localStorage.setItem("lng", pos.lng);
    
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat , lng },
        zoom: 10,
        mapId: '38e675fd49796839',
        mapTypeControl: false,
      });
    
      const marker = new google.maps.Marker({
        position: pos,
        map: map,
        animation: google.maps.Animation.DROP
        
      });

      
    })
    .catch(error => console.log('error', error));

  document.getElementById("search-address-input").value = "";
  document.getElementById("search-address-input").placeholder = "Find location by address ...";
}

///Finding location with coordinates
const findLocationWithCoordinates = (e) => {
  e.preventDefault();

  let coords = document.getElementById("search-coords-input").value;

  let result = coords.split(",");

  const lat = parseFloat(result[0]);
  const lng = parseFloat(result[1]);

  if(isNaN(lat) || isNaN(lng)){
    alert("Wrong input! Example: 45.339581, 16.978809");
    return;
  } else {

  const pos ={
    lat,lng
  }

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat , lng },
    zoom: 10,
    mapId: '38e675fd49796839',
    mapTypeControl: false,
  });

  const marker = new google.maps.Marker({
    position: pos,
    map: map,
    animation: google.maps.Animation.DROP
    
  });

  console.log(lat)
  document.getElementById("search-coords-input").value = "";
  document.getElementById("search-coords-input").placeholder = "Find location with coordinates ...";
  
  }
}

///Finding location with coordinates
const findLocationWithCoordinatesPlaces = (e) => {
  e.preventDefault();

  let el = document.getElementById("listing");
  el.setAttribute('style', 'visibility:hidden;');

  let coords = document.getElementById("search-coords-input").value;

  let result = coords.split(",");

  const lat = parseFloat(result[0]);
  const lng = parseFloat(result[1]);

  if(isNaN(lat) || isNaN(lng)){
    alert("Wrong input! Example: 45.339581, 16.978809");
    return;
  } else {

  const pos ={
    lat,lng
  }

  localStorage.setItem("lat", pos.lat)
  localStorage.setItem("lng", pos.lng)

  initMap();

  console.log(lat)
  document.getElementById("search-coords-input").value = "";
  document.getElementById("search-coords-input").placeholder = "Find location with coordinates ...";
  
  }
}

///Places autocomplete search bar
function activatePlacesSearch(){
  let input = document.getElementById("search-address-input");
  let autocomplete = new google.maps.places.Autocomplete(input);
}


///Places autocomplete POPUP
function activatePlacesSearchPopUpOrder(){
  let input = document.getElementById("address");
  let autocomplete = new google.maps.places.Autocomplete(input);

  let input0 = document.getElementById("destination_location");
  let autocomplete0 = new google.maps.places.Autocomplete(input0);

  let input1 = document.getElementById("origin_location");
  let autocomplete1 = new google.maps.places.Autocomplete(input1);

  let input2 = document.getElementById("destination_location_form");
  let autocomplete2 = new google.maps.places.Autocomplete(input2);

  let input3 = document.getElementById("origin_location_form");
  let autocomplete3 = new google.maps.places.Autocomplete(input3);
}