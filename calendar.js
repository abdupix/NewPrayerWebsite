let currentCity = "Dunedin";
let allTime;
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
function getSavedCity(){
  localStorage.setItem("currentCity", currentCity);
  console.log("Current city saved to local storage: "+ currentCity);
  if (localStorage.getItem("currentCity") !== null) {
    currentCity = localStorage.getItem("currentCity");
  }
  else{
    currentCity = "Dunedin";
  }
  console.log("Local Current city is: "+ currentCity);
  getPrayerTimes()
  }
  
function getCurrentCity(){
var dropDownOptions = document.getElementById("myDropdown");
dropDownOptions.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    currentCity = event.target.textContent;
    hideDropdown();
    document.getElementById("current-location").innerHTML =
      currentCity + " Prayer Times";
    getPrayerTimes();
    console.log("Current city set to:"+ currentCity);
    return currentCity;
  } else {
    console.log("location not set");
  }
});
}

function getPrayerTimes() {
  const PrayerTime =
    "https://api.aladhan.com/v1/calendarByCity/" +
    year +
    "/" +
    monthOfYear +
    "?city=" +
    currentCity +
    "&country=New Zealand&method=2";
  fetch(PrayerTime)
    .then((response) => response.json())
    .then((data) => {
      const timings = data.data[dayOfMonth].timings;
      allTime = data;
      const times = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      times.forEach((time) => {
        const timeElement = document.getElementById(
          `${time.toLowerCase()}-time`
        );
        timeElement.innerHTML = timings[time].replace(" (NZDT)", "");
      });

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
      document.getElementById("current-hijri-month").innerHTML = currentHijriMonth;
      var currentHijriYear = data.data[dayOfMonth].date.hijri.year;
      document.getElementById("current-hijri-year").innerHTML = currentHijriYear;
      document.getElementById("current-gregorian-day").innerHTML = dayOfMonth;
      var GegorianMonthName = date.toLocaleString('default', { month: 'long' });
      document.getElementById("current-gregorian-month").innerHTML = GegorianMonthName;
      document.getElementById("current-gregorian-year").innerHTML = year;

      //current method settings
      

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
  console.log(`Next closest prayer time is ${nextPrayerTime}`);
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
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      document
        .getElementById(entry.target.id + "Nav")
        .classList.add("active-nav");
    } else {
      document
        .getElementById(entry.target.id + "Nav")
        .classList.remove("active-nav");
    }
  });
}, options);

selectors.forEach((selector) => {
  const container = document.querySelector(selector);
  observer.observe(container);
});

