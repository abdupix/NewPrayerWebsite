let allTime;
var currentCity;
var currentMethod;
var currentMethodText;
var selectElementMethod = document.getElementById("method-select");
let currentCountry;

//create a function that checks if there is a current city saved in local storage

const date = new Date();
var dayOfMonth = date.getDate();
var monthOfYear = date.getMonth() + 1;
var year = date.getFullYear();
console.log("Todays date: " + dayOfMonth, monthOfYear, year);
// var forApi =
//   year + "/" + monthOfYear + "?address=Dunedin&method=2" + dayOfMonth;

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
async function getCountry() {
  try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
          const data = await response.json();
          currentCountry = data.country_name;
      } else {
          console.error('Failed to fetch country data');
          return null;
      }
  } catch (error) {
      console.error('Error fetching country data:', error);
      return null;
  }

// change the list of cities based on country
  
  if (currentCountry === "Fiji"){
    const fijiCities = ["Ba", "Labasa", "Lautoka", "Nadi","Rakiraki", "Suva"];

    const changeCityList =document.getElementById("myDropdown");
    changeCityList.innerHTML = fijiCities.map((city, index) => {
        if (index === 3) {
            return `<a id="defaultCity">${city}</a>`;
        } else {
            return `<a>${city}</a>`;
        }
    }).join("");
  }

  // getSavedCityAndMethod();
  getCurrentCity();
}


function getSavedCityAndMethod() {
  // check what is in the currentCity local storage, and then set the current city to that value. if it is empty, then set it to dunedin
defaultCity = document.getElementById("defaultCity").innerHTML;
  currentCity = localStorage.getItem("currentCity");
  if (currentCity === null) {
    currentCity = defaultCity;
    console.log("Default location: "+ currentCity);
    document.getElementById("current-location").innerHTML =
      currentCity + " Prayer Times";
  } else {
    console.log("Saved location: "+ currentCity);
    document.getElementById("current-location").innerHTML =
      currentCity + " Prayer Times";
  }

  currentMethod = localStorage.getItem("currentMethod");
  currentMethodText = localStorage.getItem("currentMethodText");

  if (currentMethod === null) {
    currentMethod = 2;
    console.log("Default method: " + currentMethod);
    document.getElementById("method-display").innerHTML =
      "Method: <strong>Islamic Society of North America (ISNA)</strong>";
  } else {
    console.log("Saved method: " + currentMethodText);
    document.getElementById("method-display").innerHTML =
      "Method: <strong>" + currentMethodText + "</strong>";
    selectElementMethod.value = currentMethod;
  }
  getPrayerTimes();

  // getMethod(currentMethod);
}

//runs the search for the current city
function getCurrentCity() {
  console.log("search opened");
  var dropDownOptions = document.getElementById("myDropdown");
  dropDownOptions.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      console.log("city selected" + event.target.textContent);
      currentCity = event.target.textContent;
      getPrayerTimes(currentCity);
      hideDropdown();
      console.log(currentCity);
      document.getElementById("current-location").innerHTML =
        currentCity + " Prayer Times";
      currentCity = localStorage.setItem("currentCity", currentCity);
      return currentCity;
    } else {
      currentCity = "Dunedin";

      console.log("location not set");
    }
  });
  getSavedCityAndMethod();
}
function getMethod() {
  console.log("method opened. The current method is: " + currentMethod);

  selectElementMethod.addEventListener("change", function () {
    currentMethod = this.value;
    selectElementMethod.value = currentMethod;
    currentMethodText = this.options[this.selectedIndex].text;
    document.getElementById("method-display").innerHTML =
      "Method: " + currentMethodText;
    localStorage.setItem("currentMethod", currentMethod);
    localStorage.setItem("currentMethodText", currentMethodText);
    console.log("Selected method:" + currentMethod + currentMethodText);
    // getPrayerTimes();
    getSavedCityAndMethod();

    // console.log('Selected method:' + currentMethodText);

    return currentMethodText;
  });

}

function getPrayerTimes() {
  console.log("in getPrayerTimes(), method: ", currentMethod, ". city: ", currentCity,". country: ", currentCountry);
  // currentCountry = "Fiji"
  const PrayerTime =
    "https://api.aladhan.com/v1/calendarByCity/" +
    year +
    "/" +
    monthOfYear +
    "?city=" +
    currentCity +
    "&country=" + currentCountry + "&method=" +
    // "&country=New%20Zealand&method=" +
    currentMethod;
    //this is only added for 29th feb lol. API doesnt work onleap years
    //dayOfMonth = 28;
  console.log(PrayerTime);
  fetch(PrayerTime)
    .then((response) => response.json())
    .then((data) => {
      const timings = data.data[dayOfMonth - 3].timings;
      allTime = data;
      // console.log(data.data[dayOfMonth - 1].date);
      const times =   ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      times.forEach((time) => {
        const timeElement = document.getElementById(
          `${time.toLowerCase()}-time`
        );
        timeElement.innerHTML = timings[time].replace(" (NZDT)", "");
        if (currentCountry === "Fiji"){
          timeElement.innerHTML = timings[time].replace(" (+12)", "");
        }
        console.log("fajr", timings.Fajr, "isha", "sunrise", timings.Sunrise, "dhuhr", timings.Dhuhr, "asr", timings.Asr, "maghrib", timings.Maghrib, "isha", timings.Isha);
      });
      var fajrTime = timings["Fajr"].replace(" (NZDT)", "");
      var maghribTime = timings["Maghrib"].replace(" (NZDT)", "");
      if (currentCountry === "Fiji"){
        var fajrTime = timings["Fajr"].replace(" (+12)", "");
      var maghribTime = timings["Maghrib"].replace(" (+12)", "");
      }

      document.getElementById("fajrTimeDua").innerHTML = fajrTime;
      document.getElementById("maghribTimeDua").innerHTML = maghribTime;


      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      nextPrayerTime = "";
      let minDiff = Infinity;
      times.forEach((time) => {
        prayerTime = timings[time].split(":")[0];
        const diff = prayerTime - currentHour;
        if (diff >= 0 && diff < minDiff) {
          minDiff = diff;
          nextPrayerTime = time;
        }
      });
      //add current hijri dates to top right and english dates
      var currentHijriDay = data.data[dayOfMonth].date.hijri.day;
      document.getElementById("current-hijri-day").innerHTML = currentHijriDay;
      var currentHijriMonth = data.data[dayOfMonth].date.hijri.month.en;
      document.getElementById("current-hijri-month").innerHTML =
        currentHijriMonth;
      var currentHijriYear = data.data[dayOfMonth].date.hijri.year;
      document.getElementById("current-hijri-year").innerHTML =
        currentHijriYear;
      document.getElementById("current-gregorian-day").innerHTML = dayOfMonth;
      var GegorianMonthName = date.toLocaleString("default", { month: "long" });
      document.getElementById("current-gregorian-month").innerHTML =
        GegorianMonthName;
      document.getElementById("current-gregorian-year").innerHTML = year;

      //add current dates to dua page
      document.getElementById("hijri-day-dua").innerHTML = currentHijriDay;
      document.getElementById("hijiri-month-year-dua").innerHTML =
        currentHijriMonth + " " + currentHijriYear;
      document.getElementById("current-day-dua").innerHTML = dayOfMonth;
      document.getElementById("current-month-year-dua").innerHTML =
        GegorianMonthName + " " + year;

      function calculateTimeDifference(prayerTime, label) {
        const parts = prayerTime.split(":");
        const prayerDateTime = new Date();
        prayerDateTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
        const diff = prayerDateTime - currentTime;

        if (diff < 0) {
          document.getElementById(label).innerHTML = `${label.replace(
            "timeTill",
            ""
          )} has passed for today`;
          return;
        }

        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffMinutes = Math.floor(((diff / (1000 * 60)) % 60) + 1);
        const timeString = `${diffHours} hrs & ${diffMinutes} mins`;
        document.getElementById(
          label
        ).innerHTML = `<strong>Time left:</strong> ${timeString}`;
      }

      calculateTimeDifference(maghribTime, "timeTillMaghrib");
      calculateTimeDifference(fajrTime, "timeTillFajr");

      modifyNextPrayer();
    })
    .catch((error) => {
      console.error(error);
    });
}

function modifyNextPrayer() {
  //if nextPrayerTime is nothing, set its value to Fajr
  if (nextPrayerTime == "") {
    nextPrayerTime = "Fajr";
  }
  // console.log(`Next closest prayer time is ${nextPrayerTime}`);
  const nextPrayerClass = document.getElementById(nextPrayerTime + "Container");
  nextPrayerClass.classList.add("next-prayer");




  const MainPrayerNextContainer = document.getElementById("mainContainer");
  MainPrayerNextContainer.classList.add(
    "main-container-" + nextPrayerTime.toLowerCase()
  );
  nextPrayerIn();
}

function nextPrayerIn() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();
}
//for settings modal
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("modalOverlay");

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  });
});
modalOverlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.modal-active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("modal-active");
  overlay.classList.add("modal-active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("modal-active");
  overlay.classList.remove("modal-active");
}

// document.getElementById("dua").classList.add("active-nav");

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
