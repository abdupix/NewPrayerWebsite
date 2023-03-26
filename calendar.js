let currentCity = "Dunedin";

const date = new Date();
var dayOfMonth = date.getDate();
console.log(dayOfMonth);
var monthOfYear = date.getMonth() + 1;
console.log(monthOfYear);
var year = date.getFullYear();
console.log(year);
var forApi =
  year + "/" + monthOfYear + "?address=Dunedin&method=2" + dayOfMonth;

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

var dropDownOptions = document.getElementById("myDropdown");
dropDownOptions.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    currentCity = event.target.textContent;
    hideDropdown();
    document.getElementById("current-location").innerHTML =
      currentCity + " Prayer Times";
      getPrayerTimes();
    return currentCity;
  } else {
    console.log("location not set");
  }
});

function getPrayerTimes() {
  const PrayerTime =
    "https://api.aladhan.com/v1/calendarByCity/" +
    year +
    "/" +
    monthOfYear +
    "?city="+
    currentCity+
    "&country=New Zealand&method=2";
  fetch(PrayerTime)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // document.getElementById("englishDateNumber").innerHTML = todayEnglishDate;
      const fajrTime = data.data[dayOfMonth].timings.Fajr;
      const sunsireTime = data.data[dayOfMonth].timings.Sunrise;
      const dhuhrTime = data.data[dayOfMonth].timings.Dhuhr;
      const asrTime = data.data[dayOfMonth].timings.Asr;
      const maghribTime = data.data[dayOfMonth].timings.Maghrib;
      const ishaTime = data.data[dayOfMonth].timings.Isha;
      console.log(fajrTime);
      document.getElementById("fajr-time").innerHTML = fajrTime;
      document.getElementById("sunrise-time").innerHTML = sunsireTime;
      document.getElementById("dhuhr-time").innerHTML = dhuhrTime;
      document.getElementById("asr-time").innerHTML = asrTime;
      document.getElementById("maghrib-time").innerHTML = maghribTime;
      document.getElementById("isha-time").innerHTML = ishaTime;
      console.log(currentCity);
    })
    .catch((error) => {
      console.error(error);
    });
}
