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

/// NEW FUNCTION FOR PAGINATION

const pagination = () => {
  let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    console.log(worksFor)

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

      const res = JSON.parse(result)
     


      function Pagination() {
    
          //Skip 1st, 1st allways creator / mod
          const objJson = res.slice(1);

          if(objJson == ''){
            document.getElementById("pag-nums").style.display ="none";
            document.getElementById("dataTable_info").style.display ="none";
            return;
          }
          
   
         const prevButton = document.getElementById('button_prev');
         const nextButton = document.getElementById('button_next');
         const clickPageNumber = document.querySelectorAll('.clickPageNumber');
         
         let current_page = 1;
         let records_per_page = 5;

         
         this.init = function() {
             changePage(1);
             pageNumbers();
             selectedPage();
             clickPage();
             addEventListeners();
             changeNumOfResults();
             search();
             sort();
        }
         
         let addEventListeners = function() {
             prevButton.addEventListener('click', prevPage);
             nextButton.addEventListener('click', nextPage);   
         }
               
         let selectedPage = function() {
             let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber')
             
             for (let i = 0; i < page_number.length; i++) {
                 if (i == current_page - 1) {
                     page_number[i].style.opacity = "1.0";
                 } 
                 else {
                     page_number[i].style.opacity = "0.5";
                 }
             }   
         }  
         
         let checkButtonOpacity = function() {
           current_page == 1 ? prevButton.classList.add('opacity') : prevButton.classList.remove('opacity');
           current_page == numPages() ? nextButton.classList.add('opacity') : nextButton.classList.remove('opacity');
         }
   
         let changePage = function(page) {
             const listingTable = document.getElementById('listingTable');
   
             if (page < 1) {
                 page = 1;
             } 
             if (page > (numPages() -1)) {
                 page = numPages();
             }
          
             

             listingTable.innerHTML = "";

             let firstValue = (page-1)* records_per_page;
             if(firstValue == 0){
               firstValue = 1;

               let dataTable = document.getElementById("dataTable_info")
                  .innerHTML = `Showing ${firstValue} 
                  to ${(page) * records_per_page} of ${objJson.length}`;
             }

             let dataTable = document.getElementById("dataTable_info")
                  .innerHTML = `Showing ${firstValue} 
                  to ${(page) * records_per_page} of ${objJson.length}`;
   
             for(let i = (page -1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++) {
                  // let dataTable = document.getElementById("dataTable_info")
                  // .innerHTML = `Showing ${page} to ${(page) * records_per_page} of ${objJson.length}`;
                  
                  

                  const tr = document.createElement("tr");


                 const content = `
                 <td>${objJson[i]._id}</td>
                 <td>${objJson[i].firstName}</td>
                 <td>${objJson[i].lastName}</td>
                 <td>${objJson[i].email}</td>
                 <td>${objJson[i].worksFor}</td>
                 <td id="td-${i}"><b>${objJson[i].confirmed}</b></td>
                 <td>${objJson[i].createdAt.slice(0,10)}</td>
                 <td>${objJson[i].updatedAt.slice(0,10)}</td>`;
                //  <td>${objJson[i].createdAt.slice(0, 10)}</td>
                //  <td>${objJson[i].updatedAt.slice(0, 10)}</td>`;
                 
                 tr.innerHTML = content;
                 listingTable.appendChild(tr);

                //  console.log(document.getElementById(`td-${i}`).textContent)
             }

             for(let i = (page -1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++){
             document.getElementById(`td-${i}`).textContent === "true" ? 
                 document.getElementById(`td-${i}`).style.color="green":
                 document.getElementById(`td-${i}`).style.color="red"; 
              }


             checkButtonOpacity();
             selectedPage();
             
         }
   
         let prevPage = function() {
             if(current_page > 1) {
                 current_page--;
                 changePage(current_page);
             }
         }
   
         let nextPage = function() {
             if(current_page < numPages()) {
                 current_page++;
                 changePage(current_page);
             } 
         }
   
         let clickPage = function() {
             document.addEventListener('click', function(e) {
                 if(e.target.nodeName == "SPAN" && e.target.classList.contains("clickPageNumber")) {
                     current_page = e.target.textContent;
                     changePage(current_page);
                 }
             });
         }
   
         let pageNumbers = function() {
             let pageNumber = document.getElementById('page_number');
                 pageNumber.innerHTML = "";
   
             for(let i = 1; i < numPages() + 1; i++) {
              //    pageNumber.innerHTML += "<li class='page-item active'><a class='page-link  clickPageNumber'>" + i + "</a></li>";
              pageNumber.innerHTML += "<a href='#'><span class='clickPageNumber'>" + i + "</span></a>";
              // pageNumber.classList.add("clickPageNumber page-item active")
             }
         }
   
         let numPages = function() {
             return Math.ceil(objJson.length / records_per_page);  
         }

         let changeNumOfResults = function(){
          document.getElementById("dataTable_show_results").addEventListener("change", function(){
           let NumOfResults = document.getElementById("dataTable_show_results").value;

           records_per_page = NumOfResults;


              changePage(1);
              pageNumbers();
              selectedPage();
              clickPage();
              addEventListeners();
              changeNumOfResults();
         
          })
          }



          let search = function(){
          document.getElementById("search_table").addEventListener('keypress', function(e){
              if (e.key === 'Enter') {
              // Declare variables
              
              let input = document.getElementById("search_table");
              let filter = input.value.toUpperCase().trim();
              let table = document.getElementById("listingTable");
              let tr = table.getElementsByTagName("tr");

              for (let i = 0; i < tr.length; i++) {
                  tr[i].style.display = (tr[i].innerText.toUpperCase().includes(filter)) ? 'table-row' : 'none';
                }
          }
          });
          
          }

          let sort = function(){

              let elementsArray = document.querySelectorAll('.sort-button');

              elementsArray.forEach(function(elem) {
                  elem.addEventListener("click", function(){

                  // let elementsArray1 = document.querySelectorAll('.sort-button');

                    if(elem.childNodes[1].className == 'fa fa-fw fa-sort-asc'){
                      //When click change icons for every other header
                      elementsArray.forEach(function(elem){
                        elem.childNodes[1].className = '';
                        elem.childNodes[1].className = 'fa fa-fw fa-sort'
                      })

                      elem.childNodes[1].className = '';
                      elem.childNodes[1].className = 'fa fa-fw fa-sort-desc';

                      let column = elem.id.slice(5);

                    let table, rows, switching, i, x, y, shouldSwitch;
                    table = document.getElementById("listingTable");
                    switching = true;
                    /* Make a loop that will continue until
                    no switching has been done: */
                    while (switching) {
                    // Start by saying: no switching is done:
                    switching = false;
                    rows = table.rows;
                    /* Loop through all table rows */
                    for (i = 0; i < (rows.length-1); i++) {
                      // Start by saying there should be no switching:
                      shouldSwitch = false;
                      /* Get the two elements you want to compare,
                      one from current row and one from the next: */
                      x = rows[i].getElementsByTagName("TD")[column];
                      y = rows[i + 1].getElementsByTagName("TD")[column];
                      // Check if the two rows should switch place:
                      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                      }
                    }
                    if (shouldSwitch) {
                      /* If a switch has been marked, make the switch
                      and mark that a switch has been done: */
                      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                      switching = true;
                    }
                  }



                    } else {

                      //When click change icons for every other header
                      elementsArray.forEach(function(elem){
                        elem.childNodes[1].className = '';
                        elem.childNodes[1].className = 'fa fa-fw fa-sort'
                      })

                      //Change icon on this header
                    elem.childNodes[1].className = '';
                    elem.childNodes[1].className = 'fa fa-fw fa-sort-asc';

                  let column = elem.id.slice(5);

                  let table, rows, switching, i, x, y, shouldSwitch;
                  table = document.getElementById("listingTable");
                  switching = true;
                  /* Make a loop that will continue until
                  no switching has been done: */
                  while (switching) {
                    // Start by saying: no switching is done:
                    switching = false;
                    rows = table.rows;
                    /* Loop through all table rows */
                    for (i = 0; i < (rows.length-1); i++) {
                      // Start by saying there should be no switching:
                      shouldSwitch = false;
                      /* Get the two elements you want to compare,
                      one from current row and one from the next: */
                      x = rows[i].getElementsByTagName("TD")[column];
                      y = rows[i + 1].getElementsByTagName("TD")[column];
                      // Check if the two rows should switch place:
                      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                      }
                    }
                    if (shouldSwitch) {
                      /* If a switch has been marked, make the switch
                      and mark that a switch has been done: */
                      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                      switching = true;
                    }
                  }

                    }

              })

            });
      
          }

      }
     let pagination = new Pagination();
     pagination.init();
      
      
    })
    .catch((error) => console.log("error", error));

};

pagination();