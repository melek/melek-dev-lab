/* Enumeration */
/***************/
const defaultTimerLength 	 = 15 * 60; // 15 minutes default
const defaultTicketTimeBonus = defaultTimerLength;
const defaultShiftLength 	 = 60 * 60; // 60 minutes default

/* State Management */
/********************/
function getDefaultState() {
	return {
	"countDown":		new FlexTimer(15, true),
	"count": 			defaultTimerLength, 
	"pause": 			true,
	"allpause": 		true,
	"shiftTime":		defaultShiftLength,
	"elapsed":			0,
	"startTime":		null,
	"ticketTimeBonus": 	defaultTicketTimeBonus
	};
}
let state = Object.assign({}, getDefaultState());

function saveState() {
	if (typeof(Storage) !== "undefined") {
		window.localStorage.setItem('state', JSON.stringify(state));
		window.localStorage.setItem('timerHTML', document.getElementById("timer").innerHTML);		
    }
}

function recoverState() {
	if (typeof(Storage) !== "undefined") {
		if(window.localStorage.getItem("state") != null) {
			state = JSON.parse(window.localStorage.getItem("state"));
			state.countDown = new FlexTimer().parse(state.countDown);			
		}
		let storedDots = window.localStorage.getItem("timerHTML");
		if(storedDots != null) document.getElementById("timer").innerHTML = storedDots;
		setPauseDisplay(0);
		refreshClock();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    recoverState();
}, false);

/* Presentation details */
/************************/
function setActionLabel(label) {
	document.getElementById("pause").innerHTML = label;
}

function newDot(cssClass = "") {
	return `<div class='reset-dot ${cssClass}' title="${cssClass} at ${getElapsed()} second into timing"></div>`;
}

/* Clock Display */
/*****************/
function formatTime(secTotal, forceHours = false, showSeconds = true) {
	let hr = Math.floor(secTotal / 3600);
    if(hr < 1 && !forceHours) { hr = ""; } else { hr = hr + ":"; }

	let min = Math.floor(secTotal / 60) % 60;
    if(min < 10) { min = "0" + min; }

	let sec = "";
	if(showSeconds) {
		sec = secTotal % 60;
		if(sec < 10) sec = "0" + sec;
		sec = ":" + sec;
	}

    return `${hr}${min}${sec}`;
}

function getElapsed() {
	return Math.round((new Date().getTime() - state.startTime) / 1000);
}

function refreshClock() {
    document.getElementById("mainClock").innerHTML = formatTime(Math.min(state.count, state.shiftTime));
	document.getElementById("shiftClock").innerHTML = formatTime(state.shiftTime, true);
	if(state.startTime != null) {		
		document.getElementById("elapsedClock").innerHTML = formatTime(getElapsed(), true);
	} else {
		document.getElementById("elapsedClock").innerHTML = formatTime(0, true);
	}
	saveState();
}

function setPauseDisplay(setDot = 1) {
	if(state.pause) {
		document.getElementById("mainClock").classList.add("paused");
		if(!state.allpause) {
			setActionLabel("Resume");
			if(setDot) document.getElementById("resets").innerHTML += newDot("pause");
		} else {
			document.getElementById("shiftClock").classList.add("paused");
			document.getElementById("elapsedClock").classList.add("paused");
			setActionLabel("Start");
		}
	} else {
		document.getElementById("mainClock").classList.remove("paused");
		if(!state.allpause) {
			document.getElementById("shiftClock").classList.remove("paused");
			document.getElementById("elapsedClock").classList.remove("paused");
		}
		setActionLabel("Pause");
	}
}

/* Timer */
/*********/
function addTime(minutes, color = "") {
	if(!state.pause) {
		state.count += minutes * 60;
		document.getElementById("resets").innerHTML += newDot(color);
		refreshClock();
	}
}

function addShiftTime(minutes) {
	state.shiftTime += minutes * 60;
	if(state.shiftTime < 0) state.shiftTime = 0;
	refreshClock();
}

function setPause(newPause, newAllPause) {
	if(newPause == true) {
		state.countDown.pause();
	} 
	else {
		state.countDown.unpause();
	}
	state.pause = newPause;
	state.allpause = newAllPause;
	setPauseDisplay(!newAllPause);
	refreshClock();
}

function togglePause() {
	if(state.allpause && state.pause) startElapsedTimer();
	setPause(!state.pause);
}

function resetTimer() {
	if (typeof(Storage) !== "undefined") window.localStorage.clear();
	state = Object.assign({}, getDefaultState());
	document.getElementById("resets").innerHTML = "";
	setActionLabel("Start");
	setPause(1, 1);
}

function startElapsedTimer() {
	state.startTime = new Date().getTime();
}

// Start the countdown timer with a 1 second interval.
setInterval(() => {
	if (state.count > 0 && !state.pause) {		
		if(state.count > 0) state.count--;		
		if(state.count == 0 && !state.pause) addTime(5, "expire");
	}
	if (!state.allpause) {
		if(state.shiftTime > 0) state.shiftTime--;
		state.elapsed++;
		refreshClock();
	}
}, 1000);
