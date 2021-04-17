"use strict";

const loginuser = (e) => {
  e.preventDefault();

  const user = {
    email: document.getElementById("exampleInputEmail").value,
    password: document.getElementById("exampleInputPassword").value,
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

  fetch("/users/login", requestOptions)
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
      const worksFor = data.user.worksFor;
      localStorage.setItem("worksFor", worksFor);
      const firstLogin = data.user.firstLogin;
      localStorage.setItem("firstLogin", firstLogin);
      const userAddress = data.user.address;
      localStorage.setItem("userAddress", userAddress);

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
          const role = data.role;
          localStorage.setItem("role", role);

          setTimeout(() => {
            if(role == 'user'){
              window.location.href = "new-order.html";
            } else if(role == 'driver'){
              window.location.href = "next-route.html";
            } else if(role == 'mod'){
              window.location.href = "create-route.html";
            } else if(role == 'admin'){
              window.location.href = "userlist.html";
            }
          }, 50);  
        
        })
        .catch(error => console.log('error', error));

      
    })
    .catch((e) => {
      document.getElementById("popup").classList.add("active");
      document.getElementById("button_continue").addEventListener("click", function(){
      document.getElementById("popup").classList.remove("active");
      })
    });

};

document.getElementById("login_button").addEventListener("click", loginuser);
