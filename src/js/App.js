import * as bootstrap from "bootstrap";
import * as leaflet from "leaflet";

const ipEl = document.querySelector("[data-ip]");
const locationEl = document.querySelector("[data-location]");
const timezoneEl = document.querySelector("[data-timezone]");
const ispEl = document.querySelector("[data-isp]");
const mapWrapperEl = document.querySelector("#map-holder");

const greenIcon = L.icon({
  iconUrl: "icon-location.svg",
  iconSize: [40, 50],
  iconAnchor: [10, 0],
});

const fetchInfo = async (IP_API) => {
  try {
    const res = await fetch(IP_API);
    const data = await res.json();

    ipEl.textContent = data.ip;
    locationEl.textContent = `${data.country} ${data.region} ${data.city}`;
    timezoneEl.textContent = data.timezone;
    ispEl.textContent = data.org;

    const coords = data.loc.split(",");
    const lat = coords[0];
    const long = coords[1];
    loadMap(lat, long);
  } catch (error) {
    console.log(error);
  }
};

const loadMap = (lat, long) => {
  const currentMapEl = document.querySelector("#map");
  const newMapEl = document.createElement("div");

  newMapEl.setAttribute("id", "map");
  mapWrapperEl.removeChild(currentMapEl);
  mapWrapperEl.appendChild(newMapEl);

  const map = L.map("map").setView([lat, long], 13);

  const marker = L.marker([lat, long], {
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

document.querySelector("[data-fetch]").addEventListener("click", () => {
  const ipAddress = document.querySelector("[data-inputVal]");
  const IP_API = `https://ipinfo.io/${ipAddress.value}?token=98b8269e8d5aa2`;
  fetchInfo(IP_API);
});

window.addEventListener("load", () => {
  const IP_API = `https://ipinfo.io/?token=98b8269e8d5aa2`;
  fetchInfo(IP_API);
});

document.querySelector(".hide-button").addEventListener("click", () => {
  document.querySelector("[data-information]").classList.toggle("maxer");
  document.querySelector(".hide-icon").classList.toggle("rotate-z-90");
});

const errorPopup = document.querySelector(".error-popup");
errorPopup.addEventListener("click", () => {
  errorPopup.classList.remove("error-popup-show");
});
