let allTime;
var currentCity;
var currentMethod;
var currentMethodText;
var selectElementMethod = document.getElementById('method-select');



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
function getSavedCityAndMethod(){
  // check what is in the currentCity local storage, and then set the current city to that value. if it is empty, then set it to dunedin
    
  currentCity = localStorage.getItem("currentCity");
    if (currentCity === null) {
      currentCity = "Dunedin";
      console.log(currentCity);
      document.getElementById("current-location").innerHTML =currentCity + " Prayer Times";
    } 
    else {
      console.log(currentCity);
     document.getElementById("current-location").innerHTML =currentCity + " Prayer Times";
    }
    
  currentMethod = localStorage.getItem("currentMethod");
  currentMethodText = localStorage.getItem("currentMethodText");

    if (currentMethod === null) {
      currentMethod = 2;
      console.log("getSavedCityAndMethod() if. Should be ISNA " + currentMethod);
      document.getElementById("method-display").innerHTML = "Method: <strong>Islamic Society of North America (ISNA)</strong>";

    } 
    else {
      console.log("getSavedCityAndMethod() else " + currentMethodText);
      document.getElementById("method-display").innerHTML = "Method: <strong>" + currentMethodText + "</strong>";
      selectElementMethod.value = currentMethod;
    }
    // getMethod(currentMethod);
    getPrayerTimes();
  
}
  
//runs the search for the current city
function getCurrentCity(){
  console.log("search opened");
  var dropDownOptions = document.getElementById("myDropdown");
  dropDownOptions.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    console.log("city selected" + event.target.textContent);
      currentCity = event.target.textContent;
      getPrayerTimes(currentCity);
     hideDropdown();
     console.log(currentCity);
      document.getElementById("current-location").innerHTML = currentCity + " Prayer Times";
      currentCity = localStorage.setItem("currentCity", currentCity);
      return currentCity;
  } else {
      currentCity = "Dunedin";
      
      console.log("location not set");
  }
});


}
function getMethod() {
  console.log("method opened" + currentMethod);
  
  selectElementMethod.addEventListener('change', function() {
  currentMethod = this.value;
  selectElementMethod.value = currentMethod;
  currentMethodText = this.options[this.selectedIndex].text;
  document.getElementById("method-display").innerHTML = "Method: " + currentMethodText;
  localStorage.setItem("currentMethod", currentMethod);
  localStorage.setItem("currentMethodText", currentMethodText);
  console.log('Selected method:' + currentMethod + currentMethodText);
  getPrayerTimes();
  
  // console.log('Selected method:' + currentMethodText);
  
  return currentMethodText;
});
getPrayerTimes();
}



function getPrayerTimes() {
  console.log(currentMethod, currentCity);
  const PrayerTime =
    "https://api.aladhan.com/v1/calendarByCity/" +
    year +
    "/" +
    monthOfYear +
    "?city=" +
    currentCity +
    "&country=New Zealand&method="+
    currentMethod
    ;
  fetch(PrayerTime)
    .then((response) => response.json())
    .then((data) => {
      const timings = data.data[dayOfMonth].timings;
      allTime = data;
      const times = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      times.forEach((time) => {
        const timeElement = document.getElementById(`${time.toLowerCase()}-time`);
        timeElement.innerHTML = timings[time].replace(" (NZDT)", "");
      });
      const fajrTime = timings["Fajr"].replace(" (NZDT)", "");
      document.getElementById("fajrTimeDua").innerHTML = fajrTime;

      const maghribTime = timings["Maghrib"].replace(" (NZDT)", "");
      document.getElementById("maghribTimeDua").innerHTML = maghribTime;


        console.log(maghribTime,fajrTime);
        console.log(maghribTime.replace(":", "") - fajrTime.replace(":", ""));

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

      //add current dates to dua page
      document.getElementById("hijri-day-dua").innerHTML = currentHijriDay;
      document.getElementById("hijiri-month-year-dua").innerHTML = currentHijriMonth + " " + currentHijriYear;
      document.getElementById("current-day-dua").innerHTML = dayOfMonth;
      document.getElementById("current-month-year-dua").innerHTML = GegorianMonthName + " " + year;

      function calculateTimeDifference(prayerTime, label) {
        const parts = prayerTime.split(":");
        const prayerDateTime = new Date();
        prayerDateTime.setHours(parseInt(parts[0]), parseInt(parts[1]), 0, 0);
        const diff = prayerDateTime - currentTime;

        if (diff < 0) {
          document.getElementById(label).innerHTML = `${label.replace('timeTill', '')} has passed for today`;
          return;
        }

        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diff / (1000 * 60)) % 60 + 1);
        const timeString = `${diffHours} hrs & ${diffMinutes} mins`;
        document.getElementById(label).innerHTML = `<strong>Time left:</strong> ${timeString}`;
      }

      calculateTimeDifference(maghribTime, 'timeTillMaghrib');
      calculateTimeDifference(fajrTime, 'timeTillFajr');



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
    document.getElementById(maxVisibleContainer.id + "Nav").classList.add("active-nav");
  }
}, options);

selectors.forEach((selector) => {
  const container = document.querySelector(selector);
  observer.observe(container);
});

