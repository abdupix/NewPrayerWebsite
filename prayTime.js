
// praytime.js - Prayer Times Calculator (v3.2)
// Copyright (c) 2007-2025 Hamid Zarrabi-Zadeh
// Source: https://praytimes.org
// License: MIT


//------------------------- User Interface ------------------------
/*
    method(method)          // set calculation method
    location(coordinates)   // set location
    timezone(timezone)      // set timezone
    utcOffset(number)       // set UTC offset in minutes or hours
    adjust(parameters)      // adjust calculation parameters
    tune(mins)              // tune times by given minutes
    format(format)          // options: 24h, 12h, 12H, x, X
    round(method)           // options: nearest, up, down, none
    getTimes(date)          // options: date, array, timestamp


//------------------------- Sample Usage --------------------------

    const praytime = new PrayTime('ISNA');
    praytime.location([43, -80]).timezone('America/Toronto');
    praytime.getTimes();

*/
//------------------------- PrayTime Class ------------------------
console.log("PrayTime.js loaded");
class PrayTime {

    constructor(method) {

        this.methods = {
            MWL: { fajr: 18, isha: 17 },
            ISNA: { fajr: 15, isha: 15 },
            Egypt: { fajr: 19.5, isha: 17.5 },
            Makkah: { fajr: 18.5, isha: '90 min' },
            Karachi: { fajr: 18, isha: 18 },
            Tehran: { fajr: 17.7, maghrib: 4.5, midnight: 'Jafari' },
            Jafari: { fajr: 16, maghrib: 4, midnight: 'Jafari' },
            France: { fajr: 12, isha: 12 },
            Russia: { fajr: 16, isha: 15 },
            Singapore: { fajr: 20, isha: 18 },
            defaults: { isha: 14, maghrib: '1 min', midnight: 'Standard' }
        };

        this.settings = {
            dhuhr: '0 min',
            asr: 'Standard',
            highLats: 'NightMiddle',
            tune: {},
            format: '12H',
            rounding: 'nearest',
            utcOffset: 'auto',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            location: [0, -(new Date()).getTimezoneOffset() / 4],
            iterations: 1
        };

        this.labels = [
            'Fajr', 'Sunrise', 'Dhuhr', 'Asr',
            'Sunset', 'Maghrib', 'Isha', 'Midnight'
        ];

        this.method(method || 'MWL');
    }


    //---------------------- Setters ------------------------

    // set calculation method
    method(method) {
        console.log(method);
        return this.set(this.methods.defaults).set(this.methods[method]);   
    }

    // set calculating parameters
    adjust(params) {
        return this.set(params);
    }

    // set location
    location(location) {
        return this.set({ location });
    }

    // set timezone
    timezone(timezone) {
        return this.set({ timezone });
    }

    // set tuning minutes
    tune(tune) {
        return this.set({ tune });
    }

    // set rounding method
    round(rounding = 'nearest') {
        return this.set({ rounding });
    }

    // set time format
    format(format) {
        return this.set({ format });
    }

    // set settings parameters
    set(settings) {
        Object.assign(this.settings, settings);
        return this;
    }

    // set utc offset
    utcOffset(utcOffset = 'auto') {
        if (typeof utcOffset === 'number' && Math.abs(utcOffset) < 16)
            utcOffset *= 60;
        this.set({ timezone: 'UTC' });
        return this.set({ utcOffset });
    }


    //---------------------- Getters ------------------------

    // get prayer times
    times(date = 0) {
        if (typeof date === 'number')
            date = new Date((date < 1000) ? Date.now() + date * 864e5 : date);
        if (date.constructor === Date)
            date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        this.utcTime = Date.UTC(date[0], date[1] - 1, date[2]);

        let times = this.computeTimes();
        const rawTimes = { ...times }; // keep numeric timestamps before formatting
        this.formatTimes(times);
        
        // Console log prayer times
        console.log('Prayer Times:');
        console.log('Fajr:', times.fajr);
        console.log('Sunrise:', times.sunrise);
        console.log('Dhuhr:', times.dhuhr);
        console.log('Asr:', times.asr);
        console.log('Maghrib:', times.maghrib);
        console.log('Isha:', times.isha);

        // Console log next prayer and remaining time
        const order = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const now = Date.now();
        const formatDuration = (ms) => {
            const totalMinutes = Math.max(0, Math.floor(ms / 60000));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
        };

        let nextKey = null;
        let nextTime = null;
        let lastKey = null;
        let lastTime = null;
        let nextIndex = -1;

        for (let i = 0; i < order.length; i++) {
            const key = order[i];
            const t = rawTimes[key];
            if (!isNaN(t) && t >= now) {
                nextKey = key;
                nextTime = t;
                nextIndex = i;
                break;
            }
        }

        if (!nextKey) {
            nextKey = 'fajr';
            nextTime = rawTimes.fajr + 86400000; // fallback to tomorrow's Fajr
            nextIndex = 0;
        }

        // Find the last prayer (previous prayer that has passed)
        if (nextIndex > 0) {
            // Previous prayer is the one before next prayer
            lastKey = order[nextIndex - 1];
            lastTime = rawTimes[lastKey];
        } else {
            // Current time is before first prayer, so last prayer is yesterday's last prayer (Isha)
            lastKey = 'isha';
            lastTime = rawTimes.isha - 86400000; // yesterday's Isha
        }

        // Calculate progress percentage between last and next prayer
        const totalDuration = nextTime - lastTime;
        const elapsedTime = now - lastTime;
        const progressPercentage = Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100));

        console.log('Last Prayer:', lastKey, 'at', this.formatTime(lastTime));
        console.log('Progress:', progressPercentage.toFixed(1) + '%');

        // Update circular progress bar
        const countdownBorder = document.getElementById('timeTillNextPrayerText')?.parentElement;
        if (countdownBorder) {
            countdownBorder.style.setProperty('--progress', progressPercentage);
        }

        // Log today's dates in both calendars using configured timezone
        const { gregorian, hijri } = this.currentDates();
        const hijriDayText = document.getElementById('currentHijri');
        hijriDayText.innerHTML = hijri;
        const gregorianDayText = document.getElementById('currentGregorian');
        gregorianDayText.innerHTML = gregorian;

        console.log('Today (Gregorian):', gregorian);
        console.log('Today (Hijri):', hijri);

        // Log and optionally render current time in configured timezone/format
        const currentTime = this.formatTime(Date.now());
        console.log('Current Time:', currentTime);
        const currentTimeElement = (typeof document !== 'undefined') ? document.getElementById('currentTime') : null;
        if (currentTimeElement) currentTimeElement.innerHTML = `<p>${currentTime}</p>`;

        const label = nextKey === 'fajr' && nextTime > rawTimes.fajr ? 'Fajr (tomorrow)' : nextKey.charAt(0).toUpperCase() + nextKey.slice(1);
        const nextTimeStr = this.formatTime(nextTime);
        const timeLeft = formatDuration(nextTime - now);
        console.log('Next Prayer:', `${label} <br> - in ${timeLeft}`);

        // Update DOM with formatted prayer times (mirrors previous calendar.js snippet)
        if (typeof document !== 'undefined') {
            const timings = {
                Fajr: times.fajr,
                Sunrise: times.sunrise,
                Dhuhr: times.dhuhr,
                Asr: times.asr,
                Maghrib: times.maghrib,
                Isha: times.isha
            };

            const displayNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const selectedCountry = (typeof currentCountry !== 'undefined') ? currentCountry : '';
            const todayDay = (typeof dayOfMonth !== 'undefined') ? dayOfMonth : (new Date()).getDate();

            displayNames.forEach((name) => {
                const timeElement = document.getElementById(`${name.toLowerCase()}-time`);
                if (!timeElement || !timings[name]) return;

                let displayValue = timings[name];
    
                timeElement.innerHTML = displayValue;

                const ramadhanMaghrib = document.getElementById('maghribTimeDua');
                ramadhanMaghrib.innerHTML = timings.Maghrib;
                const ramadhanFajr = document.getElementById('fajrTimeDua');
                ramadhanFajr.innerHTML = timings.Fajr;
            });

            console.log(
                'fajr', timings.Fajr,
                'sunrise', timings.Sunrise,
                'dhuhr', timings.Dhuhr,
                'asr', timings.Asr,
                'maghrib', timings.Maghrib,
                'isha', timings.Isha,
                'ramadhanFajr', timings.Fajr,
                'ramadhanMaghrib', timings.Maghrib,
                selectedCountry,
                todayDay
            );
            const nextPrayerElement = document.getElementById('timeTillNextPrayerText');
            if (nextPrayerElement) {
                nextPrayerElement.innerHTML = `Next Prayer: <br> <h2>${label} in </h2> <h1> ${timeLeft} </h1>`;
            }


            
            console.log(label);
            // console.log(nextPrayerClass);
            // nextPrayerClass.classList.add("next-prayer");
            const nextPrayerClass = document.getElementById(label + "Container");

            if (nextPrayerClass === null) {
                const nextPrayerClass = document.getElementById("FajrContainer");
                console.log("Element with ID " + label + "Container not found.");
                nextPrayerClass.classList.add("next-prayer");

            } else {
                nextPrayerClass.classList.add("next-prayer");
            }
        }
        
        return times;
    }

    // get prayer times (backward compatible)
    getTimes(date, location, timezone = 'auto', dst = 0, format = '24h') {
        if (!location) return this.times(date);
        const utcOffset = (timezone == 'auto') ? timezone : timezone + dst;
        this.location(location).utcOffset(utcOffset).format(format);
        return this.times(date);
    }

    // get current Gregorian and Hijri dates based on configured timezone
    currentDates() {
        const now = new Date();
        const tz = this.settings.timezone;
        const longParts = { year: 'numeric', month: 'long', day: 'numeric', timeZone: tz };
        const dayOnly = { day: 'numeric', timeZone: tz };
        const monthYear = { month: 'long', year: 'numeric', timeZone: tz };

        const gregorian = new Intl.DateTimeFormat('en-US', longParts).format(now);
        const gregorianDay = new Intl.DateTimeFormat('en-US', dayOnly).format(now);
        const gregorianMonthYear = new Intl.DateTimeFormat('en-US', monthYear).format(now);

        const hijri = new Intl.DateTimeFormat('en-US-u-ca-islamic', longParts).format(now);
        const hijriDay = new Intl.DateTimeFormat('en-US-u-ca-islamic', dayOnly).format(now);
        const hijriMonthYear = new Intl.DateTimeFormat('en-US-u-ca-islamic', monthYear).format(now);

        document.getElementById('current-day-dua').innerHTML = gregorianDay;
        document.getElementById('current-month-year-dua').innerHTML = gregorianMonthYear;
        document.getElementById('hijri-day-dua').innerHTML = hijriDay;
        document.getElementById('hijri-month-year-dua').innerHTML = hijriMonthYear;

        return { gregorian, hijri, gregorianDay, gregorianMonthYear, hijriDay, hijriMonthYear };
    }


    //---------------------- Deprecated -------------------------

    // deprecated: set calculation method
    setMethod(method) {
        this.method(method);
    }


    //---------------------- Compute Times -----------------------

    // compute prayer times
    computeTimes() {
        let times = {
            fajr: 5,
            sunrise: 6,
            dhuhr: 12,
            asr: 13,
            sunset: 18,
            maghrib: 18,
            isha: 18,
            midnight: 24
        };

        for (let i = 0; i < this.settings.iterations; i++)
            times = this.processTimes(times);

        this.adjustHighLats(times);
        this.updateTimes(times);
        this.tuneTimes(times);
        this.convertTimes(times);
        return times;
    }

    // process prayer times
    processTimes(times) {
        const params = this.settings;
        const horizon = 0.833;

        return {
            fajr: this.angleTime(params.fajr, times.fajr, -1),
            sunrise: this.angleTime(horizon, times.sunrise, -1),
            dhuhr: this.midDay(times.dhuhr),
            asr: this.angleTime(this.asrAngle(params.asr, times.asr), times.asr),
            sunset: this.angleTime(horizon, times.sunset),
            maghrib: this.angleTime(params.maghrib, times.maghrib),
            isha: this.angleTime(params.isha, times.isha),
            midnight: this.midDay(times.midnight) + 12
        }
    }

    // update times
    updateTimes(times) {
        const params = this.settings;

        if (this.isMin(params.maghrib))
            times.maghrib = times.sunset + this.value(params.maghrib) / 60;
        if (this.isMin(params.isha))
            times.isha = times.maghrib + this.value(params.isha) / 60;
        if (params.midnight == 'Jafari') {
            const nextFajr = this.angleTime(params.fajr, 29, -1) + 24;
            times.midnight = (times.sunset + (this.adjusted ? times.fajr + 24 : nextFajr)) / 2;
        }
        times.dhuhr += this.value(params.dhuhr) / 60;
    }

    // tune times
    tuneTimes(times) {
        const mins = this.settings.tune
        for (let i in times)
            if (i in mins)
                times[i] += mins[i] / 60;
    }

    // convert times
    convertTimes(times) {
        const lng = this.settings.location[1];
        for (let i in times) {
            const time = times[i] - lng / 15;
            const timestamp = this.utcTime + Math.floor(time * 36e5);
            times[i] = this.roundTime(timestamp);
        }
    }

    // round time
    roundTime(timestamp) {
        const rounding = {
            up: 'ceil',
            down: 'floor',
            nearest: 'round'
        }[this.settings.rounding];
        if (!rounding)
            return timestamp;
        const OneMinute = 6e4;
        return Math[rounding](timestamp / OneMinute) * OneMinute;
    }


    //---------------------- Calculation Functions -----------------------

    // compute sun position
    sunPosition(time) {
        const lng = this.settings.location[1];
        const D = this.utcTime / 864e5 - 10957.5 + this.value(time) / 24 - lng / 360;

        const g = this.mod(357.529 + 0.98560028 * D, 360);
        const q = this.mod(280.459 + 0.98564736 * D, 360);
        const L = this.mod(q + 1.915 * this.sin(g) + 0.020 * this.sin(2 * g), 360);
        const e = 23.439 - 0.00000036 * D;
        const RA = this.mod(this.arctan2(this.cos(e) * this.sin(L), this.cos(L)) / 15, 24);

        return {
            declination: this.arcsin(this.sin(e) * this.sin(L)),
            equation: q / 15 - RA,
        }
    }

    // compute mid-day
    midDay(time) {
        const eqt = this.sunPosition(time).equation;
        const noon = this.mod(12 - eqt, 24);
        return noon;
    }

    // compute the time when sun reaches a specific angle below horizon
    angleTime(angle, time, direction = 1) {
        const lat = this.settings.location[0];
        const decl = this.sunPosition(time).declination;
        const numerator = -this.sin(angle) - this.sin(lat) * this.sin(decl);
        const diff = this.arccos(numerator / (this.cos(lat) * this.cos(decl))) / 15;
        return this.midDay(time) + diff * direction;
    }

    // compute asr angle
    asrAngle(asrParam, time) {
        const shadowFactor = { Standard: 1, Hanafi: 2 }[asrParam] || this.value(asrParam);
        const lat = this.settings.location[0];
        const decl = this.sunPosition(time).declination;
        return -this.arccot(shadowFactor + this.tan(Math.abs(lat - decl)));
    }


    //---------------------- Higher Latitudes -----------------------

    // adjust times for higher latitudes
    adjustHighLats(times) {
        const params = this.settings;
        if (params.highLats == 'None')
            return;

        this.adjusted = false;
        const night = 24 + times.sunrise - times.sunset;

        Object.assign(times, {
            fajr: this.adjustTime(times.fajr, times.sunrise, params.fajr, night, -1),
            isha: this.adjustTime(times.isha, times.sunset, params.isha, night),
            maghrib: this.adjustTime(times.maghrib, times.sunset, params.maghrib, night)
        });
    }

    // adjust time in higher latitudes
    adjustTime(time, base, angle, night, direction = 1) {
        const factors = {
            NightMiddle: 1 / 2,
            OneSeventh: 1 / 7,
            AngleBased: 1 / 60 * this.value(angle)
        };
        const portion = factors[this.settings.highLats] * night;
        const timeDiff = (time - base) * direction;
        if (isNaN(time) || timeDiff > portion) {
            time = base + portion * direction;
            this.adjusted = true;
        }
        return time;
    }


    //---------------------- Formatting Functions ---------------------

    // format times
    formatTimes(times) {
        for (let i in times)
            times[i] = this.formatTime(times[i]);
    }

    // format time
    formatTime(timestamp) {
        const format = this.settings.format;
        const InvalidTime = '-----';
        if (isNaN(timestamp))
            return InvalidTime;
        if (typeof format === 'function')
            return format(timestamp);
        if (format.toLowerCase() == 'x')
            return Math.floor(timestamp / ((format == 'X') ? 1000 : 1));
        return this.timeToString(timestamp, format);
    }

    // convert time to string
    timeToString(timestamp, format) {
        const utcOffset = this.settings.utcOffset;
        const date = new Date(timestamp + (utcOffset == 'auto' ? 0 : utcOffset) * 6e4);
        const str = date.toLocaleTimeString('en-US', {
            timeZone: this.settings.timezone,
            hour12: format == '24h' ? false : true,
            hour: format == '24h' ? '2-digit' : 'numeric',
            minute: '2-digit'
        });
        return format == '12H' ? str.replace(/ ?[AP]M/, '') : str;
    }


    //---------------------- Misc Functions -----------------------

    // convert string to number
    value(str) {
        return +String(str).split(/[^0-9.+-]/)[0];
    }

    // detect if input contains 'min'
    isMin(str) {
        return String(str).indexOf('min') != -1;
    }

    // positive modulo
    mod(a, b) {
        return ((a % b) + b) % b;
    }


    //--------------------- Degree-Based Trigonometry -----------------

    dtr = (d) => d * Math.PI / 180;
    rtd = (r) => r * 180 / Math.PI;

    sin = (d) => Math.sin(this.dtr(d));
    cos = (d) => Math.cos(this.dtr(d));
    tan = (d) => Math.tan(this.dtr(d));

    arcsin = (d) => this.rtd(Math.asin(d));
    arccos = (d) => this.rtd(Math.acos(d));
    arctan = (d) => this.rtd(Math.atan(d));

    arccot = (x) => this.rtd(Math.atan(1 / x));
    arctan2 = (y, x) => this.rtd(Math.atan2(y, x));
}


//------------------------- Export ------------------------

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PrayTime };
}