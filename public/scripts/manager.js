"use strict";

///Check for authetication and read user info
checkAuthetication();

///Check user role
function checkUserRole(){
  if(role != 'admin'){
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

///Autocomplete address input
function initialize() {
  let input = document.getElementById("address_input")
  let autocomplete = new google.maps.places.Autocomplete(input);
}

///Populate select with all users
let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("/users", requestOptions)
      .then(response => response.text())
      .then(result => {

        let formSelect = document.getElementById("select_user"); 
        let options = JSON.parse(result); 
    
        for(let i = 0; i < options.length; i++) {
        let opt = `${options[i].firstName}` + `, ` + `${options[i]._id}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
      formSelect.appendChild(el);
    }

    function loadUserInfo(){
      console.log("promjena")
      
      let loc = document.getElementById("select_user").value;
      let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
      let id = idSplit.trim();
      console.log(id)

      let myHeadersRole = new Headers();
      myHeadersRole.append("Authorization", `Bearer ${token}`);

      let requestOptionsRole = {
        method: 'GET',
        headers: myHeadersRole,
        redirect: 'follow'
      };

      fetch(`/roles/${id}`, requestOptionsRole)
        .then(response => response.text())
        .then(result => {
          const data = JSON.parse(result);
          const userRole = data.role;

          document.getElementById("current-role").value = userRole;


          })
        .catch(error => console.log('error', error));


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
          const userAddress = data.address;
          const userConfirmed = data.confirmed;
          
          document.getElementById("first_name_input").placeholder = userFirstName;
          document.getElementById("last_name_input").placeholder = userLastName;
          if(userAddress == undefined || userAddress == ''){
            document.getElementById("address_input").placeholder = 'Address';
          }else{
            document.getElementById("address_input").placeholder = userAddress;
          }
          document.getElementById("activate_user").value = userConfirmed;

        })
        .catch((error) => console.log("error", error));
  
    }
    document.getElementById("select_user").addEventListener('change', loadUserInfo)

    })
      .catch((error) => console.log("error", error));


///Update user
function updateUser(e){
  e.preventDefault()

  let loc = document.getElementById("select_user").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();


  const updateInput = {
    firstName: document.getElementById("first_name_input").value,
    lastName: document.getElementById("last_name_input").value,
    address: document.getElementById("address_input").value,
    confirmed: document.getElementById("activate_user").value,
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

  window.location.href = "manager.html"
}

document.getElementById("button-submit").addEventListener('click', updateUser)

///Manager.html delete user by id
const userDeleteById = (e) => {
  e.preventDefault();

  let loc = document.getElementById("select_user").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();

  if (confirm("Are you sure you want to delete selected user?")) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`/users/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));

  window.location.href = "manager.html";
  }
};
document
  .getElementById("delete-user")
  .addEventListener("click", userDeleteById);


///Manager.html logout all users
function logoutAllUsers(e)  {
  e.preventDefault();

  if (confirm("Are you sure you want to logout all users?")) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch("/users/logoutAll", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
  }
};
document
  .getElementById("logout-all-button")
  .addEventListener("click", logoutAllUsers);
