"use strict";

///Check for authetication and read user info
checkAuthetication();

// Populate Dropdown selection with companies from database
let myHeadersCompanySelect = new Headers();
myHeadersCompanySelect.append("Authorization", `Bearer ${token}`);

let requestOptionsCompanySelect = {
  method: 'GET',
  headers: myHeadersCompanySelect,
  redirect: 'follow'
};

fetch("/companys", requestOptionsCompanySelect)
  .then(response => response.text())
  .then(result => {
    let popUpSelect = document.getElementById("select_company"); 
    let formSelect = document.getElementById("select_company_form"); 
    let options = JSON.parse(result); 

    for(let i = 0; i < options.length; i++) {
    let opt = `${options[i].name}` + `, ` + `${options[i].address}`+ `, ` + `${options[i]._id}`;
    let el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    popUpSelect.appendChild(el);
}
    for(let i = 0; i < options.length; i++) {
      let opt = `${options[i].name}` + `, ` + `${options[i].address}` + `, ` + `${options[i]._id}`;
      let el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      formSelect.appendChild(el);
    }
  })
  .catch(error => console.log('error', error));

// Populate dropdown slection with categories depeneding on which company is selected
function loadOrderCategories(){
  let select = document.getElementById("select_company_form").value
  let idSplit = select.substring(select.lastIndexOf(",") + 1);
  let id = idSplit.trim();

  console.log(id)

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/orderCategory/allConfirmed/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let formSelect = document.getElementById("select_category"); 

      let length = formSelect.options.length;
      for (let i = length-1; i >= 0; i--) {
        formSelect.options[i] = null;
      } 

      let options = JSON.parse(result); 
      
      let el = document.createElement("option");
      el.textContent = "";
      el.setAttribute("disabled","");
      el.setAttribute("hidden","");
      el.setAttribute("selected","");
      formSelect.appendChild(el);


        for(let i = 0; i < options.length; i++) {
        let opt = `${options[i].name}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        formSelect.appendChild(el);
        }
    })
    .catch(error => console.log('error', error));

}
document.getElementById("select_company_form").addEventListener('change', loadOrderCategories)

function loadOrderCategoriesPopup(){
  let select = document.getElementById("select_company").value
  let idSplit = select.substring(select.lastIndexOf(",") + 1);
  let id = idSplit.trim();

  console.log(id)

  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/orderCategory/allConfirmed/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let formSelect = document.getElementById("select_category_popup");
      let length = formSelect.options.length;
      for (let i = length-1; i >= 0; i--) {
        formSelect.options[i] = null;
      } 
        let options = JSON.parse(result); 

        let el = document.createElement("option");
      el.textContent = "";
      el.setAttribute("disabled","");
      el.setAttribute("hidden","");
      el.setAttribute("selected","");
      formSelect.appendChild(el);
    
        for(let i = 0; i < options.length; i++) {
        let opt = `${options[i].name}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        formSelect.appendChild(el);
        }
    })
    .catch(error => console.log('error', error));

}
document.getElementById("select_company").addEventListener('change', loadOrderCategoriesPopup)


///If first login show window popup
function checkfirstLogin () {
  if(role === "user"){
  if(firstLogin === ''){

    document.getElementById("popup").classList.add("active");
    document.getElementById("wrapper").classList.add("active");

    
  /// Popup window OWN form
  const popupOwnForm = (e) =>{
  e.preventDefault();

  const companyName = document.getElementById("company_name");
  const oib = document.getElementById("oib");
  const address = document.getElementById("address");
  const check = document.getElementById("checkbox");

  const companyNameValue = companyName.value.trim();
  const oibValue = oib.value.trim();
  const addressValue = address.value.trim();
  const checkValue = check.checked;

  let mod= "mod";
  let today = new Date();

  const updateInput = {
    firstLogin: today,
    worksFor: document.getElementById("company_name").value.trim()
  };

  const companyInput = {
    oib: document.getElementById("oib").value,
    name : document.getElementById("company_name").value,
    address : document.getElementById("address").value
  }


  if (companyNameValue === "") {
    setErrorForCompanyName(companyName, "Cannot be blank");
    return;
  } else if (companyNameValue.length < 3) {
    setErrorForCompanyName(companyName, "Atleast 3 characters long");
    return;
  } else {
    setSuccessForCompanyName(companyName);
  }

  if (oibValue === "") {
    setErrorForOib(oib, "Cannot be blank");
    return;
  } else if (oibValue.length !== 11) {
    setErrorForOib(oib, "Must be 11 characters long");
    return;
  } else {
    setSuccessForOib(oib);
  }

  if (addressValue === "") {
    setErrorForAddress(address, "Cannot be blank");
    return;
  } else if (addressValue.length < 3) {
    setErrorForAddress(address, "Atleast 3 characters long");
    return;
  } else {
    setSuccessForAddress(address);
  }

  if(!checkValue){
    setErrorForCheckbox(check, "You need to allow data collecting ")
    return;
  }else {
    setSuccessForCheckbox(check)
  }


  function setErrorForCompanyName(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("firstNameIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "firstNameIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForCompanyName(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("firstNameIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "firstNameIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForOib(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("lastNameIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "lastNameIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForOib(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("lastNameIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "lastNameIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForAddress(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("passwordIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "passwordIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForAddress(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("passwordIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "passwordIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForCheckbox(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

  }

  function setSuccessForCheckbox(input){
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "hidden";
  }


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

  fetch("/users/me", requestOptions)
    .then((response) => response.text())
    .then((result) => {

      let data = JSON.parse(result);
      const worksFor = data.worksFor;
      localStorage.setItem("worksFor", worksFor);
    })
    .catch((error) => console.log("error", error));
  
    let myHeadersRole = new Headers();
    myHeadersRole.append("Authorization", `Bearer ${token}`);
    myHeadersRole.append("Content-Type", "application/json");
    
    role = "mod";
    localStorage.setItem("role", role);
    let rawRole = JSON.stringify({"role":"mod"});

    let requestOptionsRole = {
      method: 'PATCH',
      headers: myHeadersRole,
      body: rawRole,
      redirect: 'follow'
    };
    
    fetch(`/roles/${id}`, requestOptionsRole)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));  

      let myHeadersCompany = new Headers();
      myHeadersCompany.append("Authorization", `Bearer ${token}`);
      myHeadersCompany.append("Content-Type", "application/json");
      
      let rawCompany = JSON.stringify(companyInput);
      
      let requestOptionsCompany = {
        method: 'POST',
        headers: myHeadersCompany,
        body: rawCompany,
        redirect: 'follow'
      };
      
      fetch("/companys", requestOptionsCompany)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));  

      setTimeout(() => {
        document.getElementById("moderator-tools").style.display="";

        document.getElementById("popup").classList.remove("active");
        document.getElementById("wrapper").classList.remove("active");
      }, 100);
}

document.getElementById("button_continue_own").addEventListener("click", popupOwnForm);



///Open Own form
const ownDeliveryFormOpen = (e) =>{
  e.preventDefault();

  let x = document.getElementById("own_delivery_service_form");
  let y = document.getElementById("need_delivery_service_form_popup");

    if (x.style.display === "none") {
      x.style.display = null;
      y.style.display = "none";
    } else {
      x.style.display = "none";
      y.style.display = "none";
    }

}
document.getElementById("own_delivery_service_button").addEventListener("click", ownDeliveryFormOpen);




/// Popup window NEED form
const popupNeedForm = (e) =>{
  e.preventDefault();
  console.log("klikno")

  const selectCompany = document.getElementById("select_company");
  const destinationLocation = document.getElementById("destination_location");
  const originLocation = document.getElementById("origin_location");
  const check = document.getElementById("checkbox_need");
  const selectCategory = document.getElementById("select_category_popup");
  const newCategory = document.getElementById("new_category_popup");

  const selectCompanyValue = selectCompany.value.trim();
  const destinationLocationValue = destinationLocation.value;
  const originLocationValue = originLocation.value;
  const checkValue = check.checked;
  const selectCategoryValue = selectCategory.value;
  const newCategoryValue = newCategory.value.trim();


  let today = new Date();

  const updateFirstLogin = {
    firstLogin: today,
  };


  if (selectCompanyValue === "") {
    setErrorForSelectCompany(selectCompany, "Must be selected");
    return;
  } else {
    setSuccessForSelectCompany(selectCompany);
  }

  if (originLocationValue === "") {
    setErrorForOriginLocation(originLocation, "Cannot be blank");
    return;
  } else {
    setSuccessForOriginLocation(originLocation);
  }

  if (destinationLocationValue === "") {
    setErrorForDestinationLocation(destinationLocation, "Cannot be blank");
    return;
  } else {
    setSuccessForDestinationLocation(destinationLocation);
  }

  if(selectCategoryValue === "" && newCategoryValue === ""){
    console.log("oba prazna")
    setErrorForSelectCategory(selectCategory, "Must be selected");
    setErrorForNewCategory(newCategory, "Must be selected");
    return;
  } else if(!(selectCategoryValue === "") && !(newCategoryValue === "")){
    console.log("oba unešena")
    setErrorForSelectCategory(selectCategory, "Must be selected");
    setErrorForNewCategory(newCategory, "Must be selected");
    return;
  } else {
    setSuccessForSelectCategory(selectCategory);
    setSuccessForNewCategory(newCategory);
  }

  if(!checkValue){
    setErrorForCheckbox(check, "You need to allow data collecting ")
    return;
  }else {
    setSuccessForCheckbox(check)
  }

  function setErrorForSelectCategory(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error class
    parent.style.border="1px solid #da5252";
    parent.style.borderRadius="22px";

  }

  function setErrorForNewCategory(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    parent.className = "form-group validationErrorBorder";

  }

  function setSuccessForSelectCategory(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.style.border="1px solid #29b0d1";
    parent.style.borderRadius="22px";

  }

  function setSuccessForNewCategory(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
  }

  function setErrorForSelectCompany(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

  }

  function setSuccessForSelectCompany(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

  }

  function setErrorForDestinationLocation(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("lastNameIconDest").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "lastNameIconDest"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForDestinationLocation(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("lastNameIconDest").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "lastNameIconDest"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForOriginLocation(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("passwordIconOrig").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "passwordIconOrig"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForOriginLocation(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("passwordIconOrig").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "passwordIconOrig"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForCheckbox(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

  }

  function setSuccessForCheckbox(input){
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "hidden";
  }

  let myHeadersFirstLogin = new Headers();
    myHeadersFirstLogin.append("Authorization", `Bearer ${token}`);
    myHeadersFirstLogin.append("Content-Type", "application/json");

    let rawFirstLogin = JSON.stringify(updateFirstLogin);

    let requestOptionsFirstLogin = {
      method: 'PATCH',
      headers: myHeadersFirstLogin,
      body: rawFirstLogin,
      redirect: 'follow'
    };

    fetch("/users/me", requestOptionsFirstLogin)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));


    ///Origin addres to latitue and longitude
    let requestOptionsGeoCode = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${originLocationValue}&key=AIzaSyAbgdH58GXlcf1okyPk7AM3KT7kyRXP05o`, requestOptionsGeoCode)
      .then(response => response.text())
      .then(result => {
        const res = JSON.parse(result);
        const lat = res.results[0].geometry.location.lat;
        const lng = res.results[0].geometry.location.lng;
  
        console.log(lat,lng)
  
        const orderCoords ={
          lat,lng
        }

        let category;
        if(!(selectCategoryValue === '')){
          category=selectCategoryValue;
        }else if(!(newCategoryValue === '')){
          category=newCategoryValue;

          let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          let idSplit = selectCompanyValue.substring(selectCompanyValue.lastIndexOf(",") + 1);
          let id = idSplit.trim();

          let obj = {
            companyId: id,
            name:category
          }

          let raw = JSON.stringify(obj);

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/orderCategory/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
  
        const OrderInput = {
          origin: document.getElementById("origin_location").value,
          originCoords: orderCoords,
          destination: document.getElementById("destination_location").value,
          company: document.getElementById("select_company").value.split(',')[0],
          category: category
        }
        
        let myHeadersOrder = new Headers();
        myHeadersOrder.append("Authorization", `Bearer ${token}`);
        myHeadersOrder.append("Content-Type", "application/json");
        
        let rawOrder = JSON.stringify(OrderInput);
        
        let requestOptionsOrder = {
          method: 'POST',
          headers: myHeadersOrder,
          body: rawOrder,
          redirect: 'follow'
        };
        
        fetch("/orders", requestOptionsOrder)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

          window.location.href="my-orders.html"

      })
      .catch(error => console.log('error', error)); 


  document.getElementById("popup").classList.remove("active");
  document.getElementById("wrapper").classList.remove("active");
}

document.getElementById("button_continue_need").addEventListener("click", popupNeedForm);


///Open Need form
const needDeliveryFormOpen = (e) =>{
  e.preventDefault();

  let x = document.getElementById("own_delivery_service_form");
  let y = document.getElementById("need_delivery_service_form_popup");

    if (y.style.display === "none") {
      y.style.display = null;
      x.style.display = "none";
    } else {
      y.style.display = "none";
      x.style.display = "none";
    }
   
}

document.getElementById("need_delivery_service_button").addEventListener("click", needDeliveryFormOpen);


}
}

}
checkfirstLogin();

///New Order Create Form

const createNewOrder = (e) =>{
  e.preventDefault();
  console.log("klikno")

  const selectCompany = document.getElementById("select_company_form");
  const destinationLocation = document.getElementById("destination_location_form");
  const originLocation = document.getElementById("origin_location_form");
  const selectCategory = document.getElementById("select_category");
  const newCategory = document.getElementById("new_category");

  const selectCompanyValue = selectCompany.value.trim();
  const destinationLocationValue = destinationLocation.value;
  const originLocationValue = originLocation.value;
  const selectCategoryValue = selectCategory.value;
  const newCategoryValue = newCategory.value.trim();

  console.log(selectCompanyValue)
  console.log(selectCategoryValue)
  console.log(newCategoryValue)



  if (selectCompanyValue === "") {
    setErrorForSelectCompany(selectCompany, "Must be selected");
    return;
  } else {
    setSuccessForSelectCompany(selectCompany);
  }

  if (originLocationValue === "") {
    setErrorForOriginLocation(originLocation, "Cannot be blank");
    return;
  } else {
    setSuccessForOriginLocation(originLocation);
  }

  if (destinationLocationValue === "") {
    setErrorForDestinationLocation(destinationLocation, "Cannot be blank");
    return;
  } else {
    setSuccessForDestinationLocation(destinationLocation);
  }

  if(selectCategoryValue === "" && newCategoryValue === ""){
    console.log("oba prazna")
    setErrorForSelectCategory(selectCategory, "Must be selected");
    setErrorForNewCategory(newCategory, "Must be selected");
    return;
  } else if(!(selectCategoryValue === "") && !(newCategoryValue === "")){
    console.log("oba unešena")
    setErrorForSelectCategory(selectCategory, "Must be selected");
    setErrorForNewCategory(newCategory, "Must be selected");
    return;
  } else {
    setSuccessForSelectCategory(selectCategory);
    setSuccessForNewCategory(newCategory);
  }

  function setErrorForSelectCategory(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error class
    parent.style.border="1px solid #da5252";
    parent.style.borderRadius="22px";

  }

  function setErrorForNewCategory(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    parent.className = "form-group validationErrorBorder";

  }

  function setSuccessForSelectCategory(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.style.border="1px solid #29b0d1";
    parent.style.borderRadius="22px";

  }

  function setSuccessForNewCategory(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";


  }

  function setErrorForSelectCompany(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    parent.style.border="1px solid #da5252";
    parent.style.borderRadius="22px";

  }



  function setSuccessForSelectCompany(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.style.border="1px solid #29b0d1";
    parent.style.borderRadius="22px";

  }

  function setErrorForDestinationLocation(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("lastNameIconDest").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "lastNameIconDest"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForDestinationLocation(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("lastNameIconDest").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "lastNameIconDest"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForOriginLocation(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("passwordIconOrig").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "passwordIconOrig"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForOriginLocation(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "form-group validationSuccessBorder";
    document.getElementById("passwordIconOrig").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "passwordIconOrig"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

    ///Origin addres to latitue and longitude
    let requestOptionsGeoCode = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${originLocationValue}&key=AIzaSyAbgdH58GXlcf1okyPk7AM3KT7kyRXP05o`, requestOptionsGeoCode)
      .then(response => response.text())
      .then(result => {
        const res = JSON.parse(result);
        const lat = res.results[0].geometry.location.lat;
        const lng = res.results[0].geometry.location.lng;
  
        console.log(lat,lng)
  
        const orderCoords ={
          lat,lng
        }

        let category;
        if(!(selectCategoryValue === '')){
          category=selectCategoryValue;
        }else if(!(newCategoryValue === '')){
          category=newCategoryValue;

          let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          let idSplit = selectCompanyValue.substring(selectCompanyValue.lastIndexOf(",") + 1);
          let id = idSplit.trim();

          let obj = {
            companyId: id,
            name:category
          }

          let raw = JSON.stringify(obj);

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/orderCategory/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
  
        const OrderInput = {
          origin: document.getElementById("origin_location_form").value,
          originCoords: orderCoords,
          destination: document.getElementById("destination_location_form").value,
          company: document.getElementById("select_company_form").value.split(',')[0],
          category: category
        }
        
        let myHeadersOrder = new Headers();
        myHeadersOrder.append("Authorization", `Bearer ${token}`);
        myHeadersOrder.append("Content-Type", "application/json");
        
        let rawOrder = JSON.stringify(OrderInput);

        console.log(rawOrder)
        
        let requestOptionsOrder = {
          method: 'POST',
          headers: myHeadersOrder,
          body: rawOrder,
          redirect: 'follow'
        };
        
        fetch("/orders", requestOptionsOrder)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));

          setTimeout(() => {
            window.location.href="my-orders.html"
          }, 100);
          

      })
      .catch(error => console.log('error', error));

    

    

}

document.getElementById("create_new_order").addEventListener("click", createNewOrder);


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


