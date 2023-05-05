let IpAdd;
let getDatabtn = document.getElementById("getDatabtn");
let searchbox = document.getElementById("search");

//searching task by name or branch of post office
searchbox.addEventListener("input", function (event) {
  // console.log(event);
  let inputval = event.target.value.toLowerCase();
  let allCards = document.getElementsByClassName("EachCard");
  console.log(inputval);

  for (let i = 0; i < allCards.length; i++) {
    let card = allCards[i];
    let AllLi = card.getElementsByTagName("li");
    let name = AllLi[0].innerText.toLowerCase().slice(5);
    let BranchType = AllLi[1].innerText.toLowerCase().slice(12);
    console.log(BranchType);

    if (name.includes(inputval) || BranchType.includes(inputval)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  }
});

// -------------------------------------------------------------------------------------------------
//prepared list of post officces with postal API
// given url=https://api.postalpincode.in/pincode/${pincode}

async function fetchDataFromPostalApi(pincode) {
  let url = `https://api.postalpincode.in/pincode/${pincode}`;
  let response = await fetch(url);
  let data = await response.json();
  let details = data[0];
  // console.log(details);

  /*
  data (details) response from API
Message
: 
"Number of pincode(s) found:21"
PostOffice
: 
(21) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
Status
: 
"Success"
*/

  console.log(details);
  let msg = document.getElementById("msg");
  msg.innerHTML = ``;
  msg.innerHTML = `Message:   ${details.Message}`;
  let PostOffice = details.PostOffice;
  let addAllpostOffices = document.querySelector(".cards");
  addAllpostOffices.innerHTML = ``;
  PostOffice.forEach((eachPostOffice) => {
    addAllpostOffices.innerHTML += `
 <ul class="EachCard">
                 <li>Name:${eachPostOffice.Name}</li>
                 <li>Branch Type:${eachPostOffice.BranchType}</li>
                 <li>Delivery Status:${eachPostOffice.DeliveryStatus}</li>
                 <li>District:${eachPostOffice.District}</li>
                 <li>Division:${eachPostOffice.Division}</li>
             </ul>

`;
  });
}

// ----------------------------------------------------------------------------------------------
//fetching the data from IPinfo  API and Rendering on webpage
//given url
// let url = `https://ipinfo.io/${IpAdd}/geo`;

//found data as object in response
/* 
{
  "ip": "103.163.167.17",
  "city": "Delhi",
  "region": "Delhi",
  "country": "IN",
  "loc": "28.6519,77.2315",
  "org": "AS135232 Ipnet Broadband Network Pvt Ltd",
  "postal": "110001",
  "timezone": "Asia/Kolkata"
}
*/
let token = "8731becb0a31da";
async function GetDataFromIPinfo() {
  let url = `https://ipinfo.io/${IpAdd}?token=8731becb0a31da`;
  let response = await fetch(url);
  let data = await response.json();
  let positionArr = data.loc.split(",");
  let lat = positionArr[0];
  let long = positionArr[1];
  let org = data.org;
  let city = data.city;
  let region = data.region;
  let hostname = data.ip;
  console.log(data);
  // Google map and some other other info rendered here
  document.querySelector(".map").innerHTML = `
  <iframe src="https://maps.google.com/maps?q=${lat},
  ${long}&z=15&output=embed" frameborder="0" style="border:0"></iframe>
  `;
  let SomeInfo = document.querySelector(".someinfo");
  SomeInfo.innerHTML = ``;
  SomeInfo.innerHTML = `
           <div class="latLong">
                <p> <Bold> Lat:</Bold>${lat}</p>
                <p> <bold>Long:</bold>${long}</p>
           </div>
            <div class="cityReg">
               <p> <bold> City:</bold>${city}</p>
                <p> <bold>Region:</bold>${region}</p>
                </div>
            <div class="orgHostname">
                <p> <bold> Organisation:</bold>${org}</p>
                <p> Hostname:.........</p>
            </div>
  `;

  // Rendering the timezone ,date,pin information here->
  let pincode = data.postal;
  // console.log(data);

  let timezone = "Asia/Kolkata";
  let userCurr_Timezone = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  let addInfo = document.querySelector(".AddInfo");
  addInfo.innerHTML = ``;

  addInfo.innerHTML = ` <p><bold> Time Zone:</bold> ${timezone}  </p>
  <p><bold>Date And Time:</bold>${userCurr_Timezone}</p>
  <p><bold>Pincode:</bold> ${pincode}</p>
  <p id="msg"> </p>`;

  fetchDataFromPostalApi(pincode);
}
// ---------------------------------------------------------------------------------------
// GetData button clicked
getDatabtn.addEventListener("click", function () {
  $.getJSON("https://api.ipify.org?format=json", function (data) {
    $("#ip").html(data.ip);
    console.log(data.ip);
    IpAdd = data.ip;
    GetDataFromIPinfo();
  });
});
