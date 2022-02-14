import * as bootstrap from "bootstrap";
import * as leaflet from "leaflet";

const fetchInfo = (IP_API) => {
  const ip = document.querySelector("[data-ip]");
  const location = document.querySelector("[data-location]");
  const timezone = document.querySelector("[data-timezone]");
  const isp = document.querySelector("[data-isp]");
  //function responsible for getting data from api
  const FETCH_GEO_API = () => {
    fetch(IP_API)
      .then((res) => {
        const responseJSON = res.json();

        if (res.ok) {
          //if response is ok then it return responseJSON variable
          return responseJSON;
        }
        if (!res.ok) {
          //I don't have to comment this
          console.log("something fooked up");
          return;
        }
      })
      .then((proc) => {
        ip.textContent = proc.ip;
        location.textContent = `${proc.country} ${proc.region} ${proc.city}`;
        timezone.textContent = proc.timezone;
        isp.textContent = proc.org;

        let lat = proc.loc.slice(0, 7); //get only lat from API response
        let long = proc.loc.slice(8); //get only long from API response
        console.log(proc);
        loadMap(lat, long);
      });
  };

  const loadMap = (lat, long) => {
    var greenIcon = L.icon({
      iconUrl: "icon-location.svg",
      iconSize: [40, 50], // size of the icon
      iconAnchor: [10, 0], // point of the icon which will correspond to marker's location
    });
    const mapWrapper = document.querySelector("#map-holder"); //Element that holds map
    const currentMap = document.querySelector("#map"); //Already created map
    const cloneMap = document.createElement("div"); //creating new element that is going to be map

    cloneMap.setAttribute("id", "map"); //Adding attributes to new map
    mapWrapper.removeChild(currentMap); //Removing old map
    mapWrapper.appendChild(cloneMap); //Creating new map

    var map = L.map("map").setView([lat, long], 13); //Adding properties for map

    var marker = L.marker([lat, long], {
      icon: greenIcon,
    });
    marker.addTo(map);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoiYnJ0c2tyIiwiYSI6ImNremxrcGNwcjExbzMyc2tlNmM3bDM3bm0ifQ.st5jESiVvUSdZtVCEoBXzg",
      }
    ).addTo(map);
  };

  FETCH_GEO_API(); //init
};

//on click retrieves data from IP API
document.querySelector("[data-fetch]").addEventListener("click", () => {
  let ipAddress = document.querySelector("[data-inputVal]");
  let IP_API = `https://ipinfo.io/${ipAddress.value}?token=98b8269e8d5aa2`;

  fetchInfo(IP_API);
});

//load defaults at load (users ip)
addEventListener("load", () => {
  let IP_API = `https://ipinfo.io/?token=98b8269e8d5aa2`;
  fetchInfo(IP_API);
});
//Changes visiblity of dropdown with information about ip, location etc...
document.querySelector(".hide-button").addEventListener("click", () => {
  document.querySelector("[data-information]").classList.toggle("maxer");
  document.querySelector(".hide-icon").classList.toggle("rotate-z-90");
});
