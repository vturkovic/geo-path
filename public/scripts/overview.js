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

///Populate dropdown selection with all users
function populateSelectAllUsers(){
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

    })
    .catch(error => console.log('error', error)); 
}
populateSelectAllUsers()

///Populate dropdown selection with all users
function populateSelectAllCompanys(){
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("/companys", requestOptions)
    .then(response => response.text())
    .then(result => {

      let formSelect = document.getElementById("select_company"); 
        let options = JSON.parse(result); 

        for(let i = 0; i < options.length; i++) {
        let opt = `${options[i].name}` + `, ` + `${options[i]._id}`;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        formSelect.appendChild(el);
}

    })
    .catch(error => console.log('error', error)); 
}
populateSelectAllCompanys()

///Load company stats
function loadCompanyStats(){
  //Get id from select
  let loc = document.getElementById("select_company").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();
     

  //Find select company
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/companys/findOne/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let data = JSON.parse(result)
      let companyName = data.name

      let numberOfEmployees = data.users.length+1
      let numberOfOrders = data.orders.length

      document.getElementById("number_employees").value = numberOfEmployees
      document.getElementById("number_orders").value = numberOfOrders

      ///Find all unprocessed orders
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      let obj ={
        company: companyName,
        processed: false
      }

      let raw = JSON.stringify(obj);

      let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("/orders/findAllUnprocessed", requestOptions)
        .then(response => response.text())
        .then(result => {
          let dataUn = JSON.parse(result)

          console.log(dataUn)
          let numberOfUnprocessed = dataUn.length
          console.log(numberOfUnprocessed)

          if(dataUn.length == 0){
            let percentageOfUnprocessed = 100
            document.getElementById("processed_orders").value = percentageOfUnprocessed + " %"
          }else {
            let percentageOfUnprocessed = ((numberOfUnprocessed/numberOfOrders)*100).toFixed(2)
            document.getElementById("processed_orders").value = percentageOfUnprocessed + " %"
          }

          
        })
        .catch(error => console.log('error', error));


      ///Find all completed orders
      let myHeadersCompleted = new Headers();
      myHeadersCompleted.append("Authorization", `Bearer ${token}`);
      myHeadersCompleted.append("Content-Type", "application/json");

      let objComplete ={
        company: companyName,
        completed: true
      }

      let rawComplete = JSON.stringify(objComplete);

      let requestOptionsCompleted = {
        method: 'POST',
        headers: myHeadersCompleted,
        body: rawComplete,
        redirect: 'follow'
      };

      fetch("/ordersAllCompleted", requestOptionsCompleted)
        .then(response => response.text())
        .then(result => {
          let dataCom = JSON.parse(result)
          let numberOfCompleted = dataCom.length
          console.log(numberOfCompleted)

          let percentageOfCompleted = ((numberOfCompleted/numberOfOrders)*100).toFixed(2)

          document.getElementById("completed_orders").value = percentageOfCompleted + " %"
        })
        .catch(error => console.log('error', error));


        function totalDistance(){
          let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          let objCompany = {
            company: companyName
          }

          let raw = JSON.stringify(objCompany);

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/route/findAll", requestOptions)
            .then(response => response.text())
            .then(result => {
              let data = JSON.parse(result)

              let totalDistance=0;
              for(let i=0; i<data.length; i++){
                totalDistance = totalDistance + data[i].distance
              }

              document.getElementById("total_distance_treveled").value = totalDistance + " km"
            
            })
            .catch(error => console.log('error', error));
        }
        totalDistance()


        function totalTravelTime(){
          let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          let objCompany = {
            company: companyName
          }

          let raw = JSON.stringify(objCompany);

          let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          fetch("/route/findAll", requestOptions)
            .then(response => response.text())
            .then(result => {
              let data = JSON.parse(result)

              let totalTravelTime=0;
              for(let i=0; i<data.length; i++){
                totalTravelTime = totalTravelTime + data[i].timeDuration
              }

              document.getElementById("total_travel_time").value = totalTravelTime + " min"
            
            })
            .catch(error => console.log('error', error));
        }
        totalTravelTime()



          })
    .catch(error => console.log('error', error));

}

document.getElementById("select_company").addEventListener('change', loadCompanyStats)


///Load user stats
function loadUserStats(){
  //Get id from select
  let loc = document.getElementById("select_user").value;
  let idSplit = loc.substring(loc.lastIndexOf(",") + 1);
  let id = idSplit.trim();

  function loadNumberOfLogins(){
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(`/logs/findPostRoles/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      let dataRole = JSON.parse(result)
      let numberOfLogins = dataRole.length

      document.getElementById("number_login").value = numberOfLogins
    })
    .catch(error => console.log('error', error));
  }
  loadNumberOfLogins();


  function lastLogin(){
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
  
    fetch(`/logs/findPostRoles/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        let dataRole = JSON.parse(result)

        let lostLoginTime
        let lastLoginDate
        if(dataRole[dataRole.length-1].createdAt){
          lostLoginTime = dataRole[dataRole.length-1].createdAt.slice(11,19)
          lastLoginDate = dataRole[dataRole.length-1].createdAt.slice(0,10)
        }else {
          lostLoginTime = ""
          lastLoginDate = ""
        }
        document.getElementById("last_login").value = lastLoginDate + " " + lostLoginTime

        
      })
      .catch(error => console.log('error', error));
    }
    lastLogin();

  function loadNumberOfCreatedOrders(){
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    
    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch(`/logs/findPostOrders/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {

        let dataRole = JSON.parse(result)
        let numberOfCreatedOrders = dataRole.length

      document.getElementById("number_order").value = numberOfCreatedOrders
      })
      .catch(error => console.log('error', error));
  }
  loadNumberOfCreatedOrders();

  function loadNumberOfUpdates(){
    //Get id from select

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);


    let requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`/logs/findUpdates/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {

        let data = JSON.parse(result)
        let numberOfUpdates = data.length

        document.getElementById("number_update").value = numberOfUpdates
      })
      .catch(error => console.log('error', error));
  }
  loadNumberOfUpdates();
}

document.getElementById("select_user").addEventListener('change', loadUserStats)