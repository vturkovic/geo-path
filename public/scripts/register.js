"use strict";

const registrationValidation = (e) => {
  e.preventDefault();

  const nameFirst = document.getElementById("exampleFirstName");
  const nameLast = document.getElementById("exampleLastName");
  const email = document.getElementById("exampleInputEmail");
  const password = document.getElementById("examplePasswordInput");
  const passwordRepeat = document.getElementById("exampleRepeatPasswordInput");

  const nameFirstValue = nameFirst.value.trim();
  const nameLastValue = nameLast.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const passwordRepeatValue = passwordRepeat.value.trim();

  if (nameFirstValue === "") {
    setErrorForFirstName(nameFirst, "Cannot be blank");
    return;
  } else if (nameFirstValue.length < 3) {
    setErrorForFirstName(nameFirst, "Atleast 3 characters long");
    return;
  } else {
    setSuccessForFirstName(nameFirst);
  }

  if (nameLastValue === "") {
    setErrorForLastName(nameLast, "Cannot be blank");
    return;
  } else {
    setSuccessForLastName(nameLast);
  }

  if (emailValue === "") {
    setErrorForEmail(email, "Cannot be blank");
    return;
  } else if (!isEmail(emailValue)) {
    setErrorForEmail(email, "Email is not valid");
    return;
  } else {
    setSuccessForEmail(email);
  }

  if (passwordValue === "") {
    setErrorForPassword(password, "Cannot be blank");
    return;
  } else if (passwordValue.length < 5) {
    setErrorForPassword(password, "Atleast 5 characters long");
    return;
  } else {
    setSuccessForPassword(password);
  }

  if (passwordRepeatValue === "") {
    setErrorForPasswordRepeat(passwordRepeat, "Cannot be blank");
    return;
  } else if (passwordValue !== passwordRepeatValue) {
    setErrorForPasswordRepeat(passwordRepeat, "Passwords don't match");
    return;
  } else {
    setSuccessForPasswordRepeat(passwordRepeat);
  }

  function setErrorForFirstName(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationErrorBorder";
    document.getElementById("firstNameIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "firstNameIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForFirstName(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";

    parent.className = "col-sm-6 mb-3 mb-sm-0 validationSuccessBorder";
    document.getElementById("firstNameIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "firstNameIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForLastName(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationErrorBorder";
    document.getElementById("lastNameIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "lastNameIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForLastName(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationSuccessBorder";
    document.getElementById("lastNameIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "lastNameIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForEmail(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "form-group validationErrorBorder";
    document.getElementById("emailIcon").className =
      "validationIconEmailPosition validationIconExclamation";
    document.getElementById(
      "emailIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForEmail(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";
    parent.className = "form-group validationSuccessBorder";
    document.getElementById("emailIcon").className =
      "validationIconEmailPosition validationIconCheck";
    document.getElementById(
      "emailIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function setErrorForPassword(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationErrorBorder";
    document.getElementById("passwordIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "passwordIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForPassword(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationSuccessBorder";
    document.getElementById("passwordIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "passwordIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  function setErrorForPasswordRepeat(input, message) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");

    // add error message inside small
    small.style.visibility = "visible";
    small.innerText = message;

    // add error class
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationErrorBorder";
    document.getElementById("passwordRepeatIcon").className =
      "validationIconPosition validationIconExclamation";
    document.getElementById(
      "passwordRepeatIcon"
    ).innerHTML = `<i class="fas fa-exclamation-circle"></i>`;
  }

  function setSuccessForPasswordRepeat(input) {
    const parent = input.parentElement;
    const small = parent.querySelector("small");
    small.style.visibility = "hidden";
    parent.className = "col-sm-6 mb-3 mb-sm-0 validationSuccessBorder";
    document.getElementById("passwordRepeatIcon").className =
      "validationIconPosition validationIconCheck";
    document.getElementById(
      "passwordRepeatIcon"
    ).innerHTML = `<i class="fas fa-check-circle"></i>`;
  }

  let response = grecaptcha.getResponse();
  if(response.length == 0) 
  { 
    //reCaptcha not verified
    alert("Please verify you are human!"); 
    return false;
  }

  const user = {
    firstName: document.getElementById("exampleFirstName").value.trim(),
    lastName: document.getElementById("exampleLastName").value.trim(),
    email: document.getElementById("exampleInputEmail").value.trim(),
    password: document.getElementById("examplePasswordInput").value.trim(),
    repeatPassword: document
      .getElementById("exampleRepeatPasswordInput")
      .value.trim(),
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(user);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("/users", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const data = JSON.parse(result);
      const id = data.user._id;
      localStorage.setItem("id", id);
      const token = data.token;
      localStorage.setItem("token", token);
      const firstName = data.user.firstName;
      localStorage.setItem("firstName", firstName);
      const lastName = data.user.lastName;
      localStorage.setItem("lastName", lastName);
      const email = data.user.email;
      localStorage.setItem("email", email);
      const createdAt = data.user.createdAt;
      localStorage.setItem("createdAt", createdAt);
      const updatedAt = data.user.updatedAt;
      localStorage.setItem("updatedAt", updatedAt);
      // const role = data.user.role;
      // localStorage.setItem("role", role);

      //Creating role for user

      let myHeadersRole = new Headers();
      myHeadersRole.append("Authorization", `Bearer ${token}`);

      let rawRole = "";

      let requestOptionsRole = {
        method: 'POST',
        headers: myHeadersRole,
        body: rawRole,
        redirect: 'follow'
      };

      fetch("/roles", requestOptionsRole)
        .then(response => response.text())
        .then(result => {
          const data = JSON.parse(result);
          const role = data.role;
          localStorage.setItem("role", role);
          console.log(result);
          
        })
        .catch(error => console.log('error', error));

          setTimeout(() => {
          // alert("Confirmation link was sent to your email!");
  
          document.getElementById("popup").classList.add("active");
  
  
          document.getElementById("button_continue").addEventListener("click", function() {
            window.location.href = "index.html";
          });
          document.getElementById("close-button").addEventListener("click", function() {
            window.location.href = "index.html";
          });
          
          // window.location.href = "index.html";
        }, 200);
    })
    .catch((error) => {
      console.log("Failed registration! ", error);
    });

};

document.addEventListener("submit", registrationValidation);
