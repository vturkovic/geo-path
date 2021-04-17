"use strict";

const sendPassword = (e) => {
  e.preventDefault();

  const email = document.getElementById("exampleInputEmail").value.trim();
  const newPassword = Math.random().toString(36).slice(-8);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({ password: `${newPassword}` });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`/password/${email}`, requestOptions)
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  alert(`Your new password was sent to ${email}`);
  window.location.href = "index.html";
};

document
  .getElementById("reset-password")
  .addEventListener("click", sendPassword);
