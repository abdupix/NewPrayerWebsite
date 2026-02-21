let allTime;
var currentCity;
var currentMethod;
var currentMethodText;
var selectElementMethod = document.getElementById("method-select");
let currentCountry;

// City coordinates mapping for different countries
const cityCoordinates = {
  "New Zealand": {
    "Auckland": [-37.7749, 175.2784],
    "Christchurch": [-43.5321, 172.6362],
    "Dunedin": [-45.8742, 170.5039],
    "Hamilton": [-37.7870, 175.2793],
    "Napier": [-39.4925, 176.9119],
    "Nelson": [-41.2865, 173.2832],
    "Palmerston North": [-40.3570, 175.6155],
    "Tauranga": [-37.7883, 176.1655],
    "Wellington": [-41.2865, 174.7762],
    "Gore": [-46.1083, 168.3394]
  },
  "Fiji": {
    "Ba": [-17.5597, 177.6797],
    "Labasa": [-17.3625, 179.3575],
    "Lautoka": [-17.6059, 177.4474],
    "Nadi": [-17.7832, 177.4406],
    "Rakiraki": [-17.3722, 178.0833],
    "Suva": [-18.1356, 178.4413]
  },
  "Australia": {
    "Sydney": [-33.8688, 151.2093],
    "Melbourne": [-37.8136, 144.9631],
    "Brisbane": [-27.4698, 153.0251],
    "Perth": [-31.9505, 115.8605],
    "Adelaide": [-34.9285, 138.6007],
    "Hobart": [-42.8821, 147.3272],
    "Canberra": [-35.2809, 149.1300],
    "Darwin": [-12.4381, 130.8353]
  }
};

// Method name mapping
const methodMapping = {
  "1": "Karachi",
  "2": "ISNA",
  "3": "MWL",
  "4": "Makkah",
  "5": "Egypt",
  "7": "Tehran",
  "11": "Singapore",
  "15": "Moonsighting"
};

// Timezone mapping for different countries
const timezoneMapping = {
  "New Zealand": "Pacific/Auckland",
  "Fiji": "Pacific/Fiji",
  "Australia": "Australia/Sydney"
};

// Update location display
function updateLocationDisplay() {
  if (currentCity && currentCountry) {
    const locationName = `${currentCity}, ${currentCountry}`;
    const locationElement = document.getElementById("currentLocationName");
    if (locationElement) {
      locationElement.textContent = locationName;
    }
  }
}

// Add current time display function
function addCurrentTime() {
  const timezone = timezoneMapping[currentCountry] || "UTC";
  const time = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone
  });
  
  const currentTimeElement = document.getElementById("currentTime");
  if (currentTimeElement) {
    currentTimeElement.innerHTML = `<p>${time}</p>`;
  }
}

// Start updating time every second
let tick = setInterval(addCurrentTime, 1000);

// const date = new Date();
// var dayOfMonth = date.getDate();
// var monthOfYear = date.getMonth() + 1;
// var year = date.getFullYear();
// console.log("Todays date: " + dayOfMonth, monthOfYear, year);


// names of all cities of nz in an array
function cityDropDown() {
  document.getElementById("myDropdown").classList.add("show");
}
function hideDropdown() {
  document.getElementById("myDropdown").classList.remove("show");
}

function cityDropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
// async function getCountry() {

//   currentCountry = "Fiji"; //default country
//   console.log("Current country is: " + currentCountry);

  
//   if (currentCountry === "Fiji"){
//     const fijiCities = ["Ba", "Labasa", "Lautoka", "Nadi","Rakiraki", "Suva"];

//     const changeCityList =document.getElementById("myDropdown");
//     changeCityList.innerHTML = fijiCities.map((city, index) => {
//         if (index === 3) {
//             return `<a id="defaultCity">${city}</a>`;
//         } else {
//             return `<a>${city}</a>`;
//         }
//     }).join("");
//   }

//   getCurrentCity();
// }


// function getSavedCityAndMethod() {
//   // check what is in the currentCity local storage, and then set the current city to that value. if it is empty, then set it to dunedin
// defaultCity = document.getElementById("defaultCity").innerHTML;
//   currentCity = localStorage.getItem("currentCity");
//   if (currentCity === null) {
//     currentCity = defaultCity;
//     console.log("Default location: "+ currentCity);

//   } else {
//     console.log("Saved location: "+ currentCity);

//   }

//   currentMethod = localStorage.getItem("currentMethod");
//   currentMethodText = localStorage.getItem("currentMethodText");

//   if (currentMethod === null) {
//     currentMethod = 3;
//     console.log("Default method: " + currentMethod);
    
//   } else {
//     console.log("Saved method: " + currentMethodText);
   
//     selectElementMethod.value = currentMethod;
//   }
//   getPrayerTimes();

// }

//runs the search for the current city
// function getCurrentCity() {
//   console.log("search opened");
//   var dropDownOptions = document.getElementById("myDropdown");
//   dropDownOptions.addEventListener("click", function (event) {
//     if (event.target.tagName === "A") {
//       console.log("city selected" + event.target.textContent);
//       currentCity = event.target.textContent;
//       getPrayerTimes(currentCity);
//       hideDropdown();
//       console.log(currentCity);
//       document.getElementById("current-location").innerHTML =
//         currentCity + " Prayer Times";
//       currentCity = localStorage.setItem("currentCity", currentCity);
//       return currentCity;
//     } else {
//       currentCity = "Dunedin";

//       console.log("location not set");
//     }
//   });
//   getSavedCityAndMethod();
// }
// function getMethod() {
//   console.log("method opened. The current method is: " + currentMethod);

//   selectElementMethod.addEventListener("change", function () {
//     currentMethod = this.value;
//     selectElementMethod.value = currentMethod;
//     currentMethodText = this.options[this.selectedIndex].text;
//     document.getElementById("method-display").innerHTML =
//       "Method: " + currentMethodText;
//     localStorage.setItem("currentMethod", currentMethod);
//     localStorage.setItem("currentMethodText", currentMethodText);
//     console.log("Selected method:" + currentMethod + currentMethodText);
//     getSavedCityAndMethod();


//     return currentMethodText;
//   });

// }

// function getPrayerTimes() {
//   console.log("in getPrayerTimes(), method: ", currentMethod, ". city: ", currentCity,". country: ", currentCountry);
//   // currentCountry = "Fiji"
//   const PrayerTime =
//     "https://api.aladhan.com/v1/calendarByCity/" +
//     year +
//     "/" +
//     monthOfYear +
//     "?city=" +
//     currentCity +
//     "&country=" + currentCountry + "&method=" +
//     currentMethod;
//     //this is only added for 29th feb lol. API doesnt work onleap years
//     //dayOfMonth = 28;
//   console.log(PrayerTime);
//   fetch(PrayerTime)
//     .then((response) => response.json())
//     .then((data) => {
//       const timings = data.data[dayOfMonth-1].timings;
//       allTime = data;
//       console.log(data.data[dayOfMonth - 1].date);
//       const times =   ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
//       times.forEach((time) => {
//         const timeElement = document.getElementById(
//           `${time.toLowerCase()}-time`
//         );
//         timeElement.innerHTML = timings[time].replace(" (NZDT)", "");
//         if (currentCountry === "Fiji"){
//           timeElement.innerHTML = timings[time].replace(" (+12)", "");
//         }
//         console.log("fajr", timings.Fajr, "isha", "sunrise", timings.Sunrise, "dhuhr", timings.Dhuhr, "asr", timings.Asr, "maghrib", timings.Maghrib, "isha", timings.Isha, dayOfMonth);
//       });
//       var fajrTime = timings["Fajr"].replace(" (NZDT)", "");
//       var maghribTime = timings["Maghrib"].replace(" (NZDT)", "");
//       if (currentCountry === "Fiji"){
//         var fajrTime = timings["Fajr"].replace(" (+12)", "");
//       var maghribTime = timings["Maghrib"].replace(" (+12)", "");
//       }

//       document.getElementById("fajrTimeDua").innerHTML = fajrTime;
//       document.getElementById("maghribTimeDua").innerHTML = maghribTime;


//       const currentTime = new Date();
//       const currentHour = currentTime.getHours();
//       nextPrayerTime = "";
//       let minDiff = Infinity;
//       times.forEach((time) => {
//         prayerTime = timings[time].split(":")[0];
//         console.log(times);    
//         const diff = prayerTime - currentHour;
//         if (diff >= 0 && diff < minDiff) {
//           minDiff = diff;
//           nextPrayerTime = time;
//           console.log("Next prayer time is: " + nextPrayerTime + " in " + minDiff + " hours. The current time is " + currentHour);
//         }
//       });
//       //add current hijri dates to top right and english dates
//       var currentHijriDay = data.data[dayOfMonth].date.hijri.day;
//       currentHijriDay -= 0; //adjust this to fix hijri date issue
//       document.getElementById("current-hijri-day").innerHTML = currentHijriDay;
//       var currentHijriMonth = data.data[dayOfMonth].date.hijri.month.en;
//       document.getElementById("current-hijri-month").innerHTML =
//         currentHijriMonth;
//       var currentHijriYear = data.data[dayOfMonth].date.hijri.year;
//       document.getElementById("current-hijri-year").innerHTML =
//         currentHijriYear;
//       document.getElementById("current-gregorian-day").innerHTML = dayOfMonth;
//       var GegorianMonthName = date.toLocaleString("default", { month: "long" });
//       document.getElementById("current-gregorian-month").innerHTML =
//         GegorianMonthName;
//       document.getElementById("current-gregorian-year").innerHTML = year;

//       //add current dates to dua page
//       document.getElementById("hijri-day-dua").innerHTML = currentHijriDay;
//       document.getElementById("hijiri-month-year-dua").innerHTML =
//         currentHijriMonth + " " + currentHijriYear;
//       document.getElementById("current-day-dua").innerHTML = dayOfMonth;
//       document.getElementById("current-month-year-dua").innerHTML =
//         GegorianMonthName + " " + year;

//       function calculateTimeDifference(prayerTime, label) {
//         const parts = prayerTime.split(":");
//         const prayerDateTime = new Date();
//         prayerDateTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
//         const diff = prayerDateTime - currentTime;

//         if (diff < 0) {
//           document.getElementById(label).innerHTML = `${label.replace(
//             "timeTill",
//             ""
//           )} has passed for today`;
//           return;
//         }

//         const diffHours = Math.floor(diff / (1000 * 60 * 60));
//         const diffMinutes = Math.floor(((diff / (1000 * 60)) % 60) + 1);
//         const timeString = `${diffHours} hrs & ${diffMinutes} mins`;
//         document.getElementById(
//           label
//         ).innerHTML = `<strong>Time left:</strong> ${timeString}`;
//       }

//       calculateTimeDifference(maghribTime, "timeTillMaghrib");
//       calculateTimeDifference(fajrTime, "timeTillFajr");

//       modifyNextPrayer();
//       return maghribTime, fajrTime;
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }
// function modifyNextPrayer() {
//   //if nextPrayerTime is nothing, set its value to Fajr
//   if (nextPrayerTime == "") {
//     nextPrayerTime = "Fajr";
//   }
//   console.log(`Next closest prayer time is ${nextPrayerTime}`);
//   const nextPrayerClass = document.getElementById(nextPrayerTime + "Container");
//   console.log(nextPrayerClass);
//   nextPrayerClass.classList.add("next-prayer");

//   const MainPrayerNextContainer = document.getElementById("mainContainer");
//   MainPrayerNextContainer.classList.add(
//     "main-container-" + nextPrayerTime.toLowerCase()
//   );
//   }

// function addCurrentTime() {
//   const time = new Date().toLocaleTimeString('en-US', {
//   hour: 'numeric',
//   minute: '2-digit',
//   // second: '2-digit',
//   hour12: true
  
// });

// console.log(time); // Example Output: "3:41 PM"
// document.getElementById("currentTime").innerHTML = `<p>${time}</p>`;

//}
// Global variables for modal
let overlay;

//for settings modal
function setupModalListeners() {
  const openModalButtons = document.querySelectorAll("[data-modal-target]");
  const closeModalButtons = document.querySelectorAll("[data-close-button]");
  overlay = document.getElementById("modalOverlay");

  console.log("Setting up modal listeners...");
  console.log("Found " + openModalButtons.length + " open buttons");
  console.log("Found " + closeModalButtons.length + " close buttons");
  console.log("Overlay element:", overlay);

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Open button clicked");
      const modal = document.querySelector(button.dataset.modalTarget);
      console.log("Modal target:", button.dataset.modalTarget, "Modal element:", modal);
      openModal(modal);
    });
  });

  if (overlay) {
    overlay.addEventListener("click", () => {
      console.log("Overlay clicked");
      const modals = document.querySelectorAll(".modal.modal-active");
      modals.forEach((modal) => {
        closeModal(modal);
      });
    });
  }

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      console.log("Close button clicked");
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });
}

function openModal(modal) {
  if (modal == null) {
    console.error("Modal is null");
    return;
  }
  console.log("Opening modal:", modal);
  modal.classList.add("modal-active");
  if (overlay) {
    overlay.classList.add("modal-active");
  }
  loadSavedSettings(); // Load saved settings when opening modal
}

function closeModal(modal) {
  if (modal == null) {
    console.error("Modal is null");
    return;
  }
  console.log("Closing modal:", modal);
  modal.classList.remove("modal-active");
  if (overlay) {
    overlay.classList.remove("modal-active");
  }
}

// Initialize settings on page load
function initializeSettings() {
  console.log("Initializing settings...");
  getCountry();
  loadSavedSettings();
  setupModalListeners(); // Set up modal listeners after DOM is ready
}

// Load saved settings from localStorage
function loadSavedSettings() {
  console.log("Loading saved settings...");
  
  // Load saved country
  const savedCountry = localStorage.getItem("selectedCountry") || "New Zealand";
  const countrySelect = document.getElementById("country-select");
  if (countrySelect) {
    countrySelect.value = savedCountry;
    console.log("Set country to:", savedCountry);
  } else {
    console.log("country-select element not found");
  }
  
  currentCountry = savedCountry;
  updateCityDropdown(savedCountry);
  
  // Load saved city and populate the city select in modal
  const savedCity = localStorage.getItem("selectedCity");
  const citySelect = document.getElementById("city-select");
  if (citySelect) {
    // Populate city-select with available cities
    const cities = cityCoordinates[savedCountry] || {};
    citySelect.innerHTML = '<option value="">Select a city</option>';
    Object.keys(cities).forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
    
    // Set the saved city if it exists
    if (savedCity) {
      citySelect.value = savedCity;
      console.log("Set city to:", savedCity);
    }
  }
  
  if (savedCity) {
    currentCity = savedCity;
    const myInput = document.getElementById("myInput");
    if (myInput) {
      myInput.value = savedCity;
      console.log("Set search bar city to:", savedCity);
    }
    
    // Update prayer times for the saved city
    const coords = cityCoordinates[savedCountry][savedCity];
    if (coords) {
      updatePrayerTimes(coords);
    }
  }
  
  // Load saved method
  const savedMethod = localStorage.getItem("selectedMethod") || "3";
  const methodSelect = document.getElementById("method-select");
  if (methodSelect) {
    methodSelect.value = savedMethod;
    console.log("Set method to:", savedMethod);
  } else {
    console.log("method-select element not found");
  }
  
  currentMethod = savedMethod;
  currentMethodText = methodMapping[savedMethod] || "MWL";
  
  // Update location display
  updateLocationDisplay();
}

// Update city dropdown based on selected country
function updateCityDropdown(country) {
  console.log("Updating city dropdown for:", country);
  const dropdownContent = document.getElementById("myDropdown");
  
  if (!dropdownContent) {
    console.log("myDropdown element not found");
    return;
  }
  
  const cities = cityCoordinates[country] || [];
  console.log("Available cities:", Object.keys(cities));
  
  dropdownContent.innerHTML = Object.keys(cities)
    .map((city) => `<a>${city}</a>`)
    .join("");
  
  // Add click listeners to city options
  const cityOptions = dropdownContent.getElementsByTagName("a");
  Array.from(cityOptions).forEach((option) => {
    option.addEventListener("click", (e) => {
      selectCity(e.target.textContent);
    });
  });
}

// Select a city and update prayer times
function selectCity(city) {
  currentCity = city;
  document.getElementById("myInput").value = city;
  localStorage.setItem("selectedCity", city);
  hideDropdown();
  
  // Update location display
  updateLocationDisplay();
  
  // Get coordinates and update prayer times
  const coords = cityCoordinates[currentCountry][city];
  if (coords) {
    updatePrayerTimes(coords);
  }
}

// Update prayer times with new location and method
function updatePrayerTimes(coords) {
  const praytime = new PrayTime();
  const methodName = methodMapping[currentMethod] || "MWL";
  const timezone = timezoneMapping[currentCountry] || "UTC";
  
  praytime.method(methodName).location(coords).timezone(timezone);
  praytime.getTimes();
}

// Handle country change
function countryChange() {
  const newCountry = document.getElementById("country-select").value;
  currentCountry = newCountry;
  localStorage.setItem("selectedCountry", newCountry);
  console.log("Country changed to:", newCountry);
  
  // Update city dropdown
  updateCityDropdown(newCountry);
  
  // Update city-select dropdown in settings modal
  const citySelect = document.getElementById("city-select");
  if (citySelect) {
    const cities = cityCoordinates[newCountry] || {};
    citySelect.innerHTML = '<option value="">Select a city</option>';
    Object.keys(cities).forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
    citySelect.value = ""; // Reset selection
  }
  
  // Update location display
  updateLocationDisplay();
  
  // Clear city selection
  document.getElementById("myInput").value = "";
  currentCity = null;
}

// Handle city change from settings modal
function handleCityChange() {
  const citySelect = document.getElementById("city-select");
  const selectedCity = citySelect.value;
  
  if (selectedCity) {
    currentCity = selectedCity;
    document.getElementById("myInput").value = selectedCity;
    localStorage.setItem("selectedCity", selectedCity);
    
    // Update location display
    updateLocationDisplay();
    
    // Get coordinates and update prayer times
    const coords = cityCoordinates[currentCountry][selectedCity];
    if (coords) {
      console.log("City changed to:", selectedCity, "with coords:", coords);
      updatePrayerTimes(coords);
    }
  }
}

// Handle method change
function handleMethodChange() {
  const selectElement = document.getElementById("method-select");
  currentMethod = selectElement.value;
  currentMethodText = methodMapping[currentMethod] || "MWL";
  localStorage.setItem("selectedMethod", currentMethod);
  
  console.log("Method changed to: " + currentMethodText);
  
  // If a city is selected, update prayer times with new method
  if (currentCity && currentCountry) {
    const coords = cityCoordinates[currentCountry][currentCity];
    if (coords) {
      updatePrayerTimes(coords);
    }
  }
}

// Initialize when DOM is loaded
function getCountry() {
  currentCountry = localStorage.getItem("selectedCountry") || "New Zealand";
  updateCityDropdown(currentCountry);
  const defaultCity = "Auckland";
  currentCity = localStorage.getItem("selectedCity") || defaultCity;
  
  if (cityCoordinates[currentCountry][currentCity]) {
    document.getElementById("myInput").value = currentCity;
  }
}


function getCurrentNav() {
console.log("scrolled nerd")
const selectors = [
  "#mainContainer",
  "#secondMainContainer",
  "#thirdMainContainer",
  "#fourthMainContainer",
];

const options = {
  rootMargin: "0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries, observer) => {
  let maxVisibleRatio = 0;
  let maxVisibleContainer = null;

  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
      maxVisibleRatio = entry.intersectionRatio;
      maxVisibleContainer = entry.target;
    }
  });

  let currentActiveContainer = document.querySelector(".active-nav");

  if (maxVisibleContainer && maxVisibleContainer !== currentActiveContainer) {
    currentActiveContainer?.classList.remove("active-nav");
    document
      .getElementById(maxVisibleContainer.id + "Nav")
      .classList.add("active-nav");
  }
}, options);

selectors.forEach((selector) => {
  const container = document.querySelector(selector);
  observer.observe(container);
});

}
