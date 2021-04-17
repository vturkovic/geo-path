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

///Populate dropdown selection with drivers from company
function populateSelectDrivers(){
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  let obj = {
    worksFor : worksFor
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

    })
    .catch(error => console.log('error', error)); 
}
populateSelectDrivers()

///Load driver Info on change
function loadDriverInfo(){
  let loc = document.getElementById("select_driver").value;
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
  loadNumberOfLogins()


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
            console.log(dataRole)
    
            let lostLoginTime = dataRole[dataRole.length-1].createdAt.slice(11,19)
            let lastLoginDate = dataRole[dataRole.length-1].createdAt.slice(0,10)
      
            document.getElementById("last_login").value = lastLoginDate + " " + lostLoginTime
          })
          .catch(error => console.log('error', error));
        }
        lastLogin();

    function numberOfRoutes(){

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`/route/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result)
      
            let numRoutes = data.length
        
            document.getElementById("number_routes").value = numRoutes

            let myHeadersComp = new Headers();
            myHeadersComp.append("Authorization", `Bearer ${token}`);

            let requestOptionsComp = {
              method: 'GET',
              headers: myHeadersComp,
              redirect: 'follow'
            };

            fetch(`/route/allCompleted/${id}`, requestOptionsComp)
              .then(response => response.text())
              .then(result => {
                let data = JSON.parse(result)

                let numberOfCompleted = data.length

                let percentageOfCompleted = ((numberOfCompleted/numRoutes)*100).toFixed(2)

                document.getElementById("completed_routes").value = percentageOfCompleted + " %"

              })
              .catch(error => console.log('error', error));

        
            })
        .catch(error => console.log('error', error));

    }
    numberOfRoutes()

    function traveledDistance(){
      console.log(id)

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`/route/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result)
            console.log(data)

            let distance = 0;
            for(let i=0; i<data.length; i++){
              distance = distance + data[i].distance;
            }
      
            document.getElementById("distance_treveled").value = distance + " km";
          })
          .catch(error => console.log('error', error));
    }
    traveledDistance();

    function traveledTime(){
      console.log(id)

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`/route/${id}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result)
            console.log(data)

            let time = 0;
            for(let i=0; i<data.length; i++){
              time = time + data[i].timeDuration;
            }
      
            document.getElementById("travel_time").value = time + " min";
          })
          .catch(error => console.log('error', error));
    }
    traveledTime();

  }
  document.getElementById("select_driver").addEventListener('change', loadDriverInfo)


///Load company info
function loadCompanyInfo(){
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
      let data = JSON.parse(result)
      
      let companyId = data._id
      console.log(companyId)

      let name = data.name
      document.getElementById("company_header").textContent = `${name} Statistics`;

      let employees = data.users.length
      let orders = data.orders.length

      document.getElementById("number_employees").value = employees
      document.getElementById("number_orders").value = orders

      ///Find all unprocessed orders
      let myHeadersUnprocessed = new Headers();
      myHeadersUnprocessed.append("Authorization", `Bearer ${token}`);
      myHeadersUnprocessed.append("Content-Type", "application/json");

      let objUnprocessed ={
        company: name,
        processed: false
      }

      let rawUnprocessed = JSON.stringify(objUnprocessed);

      let requestOptionsUnprocessed = {
        method: 'POST',
        headers: myHeadersUnprocessed,
        body: rawUnprocessed,
        redirect: 'follow'
      };

      fetch("/orders/findAllUnprocessed", requestOptionsUnprocessed)
        .then(response => response.text())
        .then(result => {
          let dataUn = JSON.parse(result)
          console.log(dataUn)
          let numberOfUnprocessed = dataUn.length

          if(dataUn.length == 0){
            let percentageOfUnprocessed = 100
            document.getElementById("processed_orders").value = percentageOfUnprocessed + " %"
          }else {
            let percentageOfUnprocessed = ((numberOfUnprocessed/orders)*100).toFixed(2)
            document.getElementById("processed_orders").value = percentageOfUnprocessed + " %"
          }
        })
        .catch(error => console.log('error', error));

      ///Find all completed orders
      let myHeadersCompleted = new Headers();
      myHeadersCompleted.append("Authorization", `Bearer ${token}`);
      myHeadersCompleted.append("Content-Type", "application/json");

      let objComplete ={
        company: name,
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

          let percentageOfCompleted = ((numberOfCompleted/orders)*100).toFixed(2)

          document.getElementById("completed_orders").value = percentageOfCompleted + " %"
        })
        .catch(error => console.log('error', error));


        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
        
        fetch(`/orderCategory/all/${companyId}`, requestOptions)
          .then(response => response.text())
          .then(result => {
            let dataCat = JSON.parse(result)
            let numOfCategories = dataCat.length

            document.getElementById("order_categories").value = numOfCategories

          })
          .catch(error => console.log('error', error));

        function totalDistance(){
          let myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${token}`);
          myHeaders.append("Content-Type", "application/json");

          let objCompany = {
            company: name
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
            company: name
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
loadCompanyInfo()

