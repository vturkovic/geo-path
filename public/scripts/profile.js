"use strict";

///Check for authetication and read user info
checkAuthetication();

///Hide admintools for regular users
hideAdmintools();

///Rendering username top right
renderUserName();

///Profile.html placeholder replace
placeholderReplace();

///Autocomplete address input
function initialize() {
  let input = document.getElementById("address_input")
  let autocomplete = new google.maps.places.Autocomplete(input);
}

///Dropdown logout function
document.getElementById("logout-dropdown").addEventListener("click", logout);

///Dropdown profile page function
document
  .getElementById("profile-page-dropdown")
  .addEventListener("click", renderProfilePage);

///Profile.html user updating data
document
  .getElementById("button-update-info")
  .addEventListener("click", userUpdateInfo);

///Profile.html user deleting account
document.getElementById("delete-button").addEventListener("click", userDelete);
