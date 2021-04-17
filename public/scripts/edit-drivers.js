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

///Autocomplete address input
function initialize() {
  let input = document.getElementById("address_input")
  let autocomplete = new google.maps.places.Autocomplete(input);

  let input1 = document.getElementById("address_input_update")
  let autocomplete1 = new google.maps.places.Autocomplete(input1);

}

///Dropdown logout function
document.getElementById("logout-dropdown").addEventListener("click", logout);

///Dropdown profile page function
document
  .getElementById("profile-page-dropdown")
  .addEventListener("click", renderProfilePage);

///Render company name
const renderCompanyName = function() {
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/companys/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      // console.log(result)
      const data = JSON.parse(result);
      
      document.getElementById("company_input").placeholder = data.name;
    })
    .catch(error => console.log('error', error));

}
renderCompanyName();

  
///Create User
const createUser = (e) => {
  e.preventDefault();

  if(!document.getElementById("first_name_input").value){
    document.getElementById("first_name_input").classList.add("assignRouteError")
    return;
  } else if(!document.getElementById("last_name_input").value){
    document.getElementById("last_name_input").classList.add("assignRouteError")
    return;
  } else if(!document.getElementById("email_input").value){
    document.getElementById("email_input").classList.add("assignRouteError")
    return;
  } else if(!document.getElementById("password_input").value){
    document.getElementById("password_input").classList.add("assignRouteError")
    return;
  } else if(!document.getElementById("passwordRepeat_input").value){
    document.getElementById("passwordRepeat_input").classList.add("assignRouteError")
    return;
  } else if(document.getElementById("password_input").value != document.getElementById("passwordRepeat_input").value){
    document.getElementById("password_input").classList.add("assignRouteError")
    document.getElementById("passwordRepeat_input").classList.add("assignRouteError")
    return;
  }

  ///Input user info
  const user = {
    firstName: document.getElementById("first_name_input").value.trim(),
    lastName: document.getElementById("last_name_input").value.trim(),
    email: document.getElementById("email_input").value.trim(),
    password: document.getElementById("password_input").value.trim(),
    repeatPassword: document
      .getElementById("passwordRepeat_input")
      .value.trim(),
    address: document.getElementById("address_input").value.trim(),
    worksFor: document.getElementById("company_input").placeholder,
  };

  ///Request
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(user);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/drivers", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      let data = JSON.parse(result);
      let owner = data.user._id;

      let myHeadersRole = new Headers();
      myHeadersRole.append("Authorization", `Bearer ${token}`);
      myHeadersRole.append("Content-Type", "application/json");

      let role = "driver";

      let rawRole = {
        role: role,
        owner: owner
      }

      let rawRoleString = JSON.stringify(rawRole);

      let requestOptionsRole = {
        method: 'POST',
        headers: myHeadersRole,
        body: rawRoleString,
        redirect: 'follow'
      };

      fetch(`/roles/driver/${owner}`, requestOptionsRole)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

        window.location.href = "drivers-list.html";
    })
    .catch((error) => {
      console.log("Failed registration! ", error);
    });

}

document.getElementById("button-create").addEventListener("click", createUser)

//Load drivers select option
let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let obj = {
      worksFor
    }

    let raw = JSON.stringify(obj);

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("/drivers/list", requestOptions)
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

    function loadUserInfo(){
      console.log("promjena")
      
      let loc = document.getElementById("select_driver").value;
      let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
      let id = idSplit.trim();
      console.log(id)



      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`/users/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
        
          const userFirstName = data.firstName;
          const userLastName = data.lastName;
          const userEmail = data.email;
          const userAddress = data.address;
          const userConfirmed = data.confirmed;

          
          document.getElementById("first_name_input_update").placeholder = userFirstName;
          document.getElementById("last_name_input_update").placeholder = userLastName;
          document.getElementById("email_input_update").placeholder = userEmail;
          if(userAddress == undefined || userAddress == ''){
            document.getElementById("address_input_update").placeholder = 'Address';
          }else{
            document.getElementById("address_input_update").placeholder = userAddress;
          }
          document.getElementById("activate_driver_update").value = userConfirmed;
          console.log(userConfirmed)
        })
        .catch((error) => console.log("error", error));
  
    }
    document.getElementById("select_driver").addEventListener('change', loadUserInfo)

    })
      .catch((error) => console.log("error", error));


function updateDriver(e) {
  e.preventDefault();

  let loc = document.getElementById("select_driver").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();


  const updateInput = {
    firstName: document.getElementById("first_name_input_update").value,
    lastName: document.getElementById("last_name_input_update").value,
    email: document.getElementById("email_input_update").value,
    password: document.getElementById("password_input_update").value,
    address: document.getElementById("address_input_update").value,
    confirmed: document.getElementById("activate_driver_update").value,
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

  fetch(`/updateUser/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  window.location.href = "edit-drivers.html"
}

document.getElementById("button-update").addEventListener('click', updateDriver)
  