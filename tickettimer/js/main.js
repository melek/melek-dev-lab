/* Enumeration */
/***************/
const defaultTimerLength 	 = 15; // 15 minutes default
const defaultTicketTimeBonus = defaultTimerLength;
const defaultShiftLength 	 = 60; // 60 minutes default

/* State Management */
/********************/
function getDefaultState() {
	return {
	ticketCountDown:	new FlexTimer(defaultTimerLength, true, true),
	shiftCountDown:		new FlexTimer(60, true, true),
	elapsedCountUp:		new FlexTimer(0, true, true),
	pause: 				true,
	allpause: 			true,
	shiftTime:			defaultShiftLength * 60,
	elapsed:			0,
	startTime:			null,
	ticketTimeBonus: 	defaultTicketTimeBonus,
	timerIsExpired:		false
	};
}
let state = Object.assign({}, getDefaultState());

// Some global references, quicker to type. :P
var timer;
var shift;
var elapsed;

function updateShorthandReferences() {
	timer 	= state.ticketCountDown;
	shift 	= state.shiftCountDown;
	elapsed = state.elapsedCountUp;
}
updateShorthandReferences();

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
			state.ticketCountDown = new FlexTimer().parse(state.ticketCountDown);			
			state.shiftCountDown = new FlexTimer().parse(state.shiftCountDown);			
			state.elapsedCountUp = new FlexTimer().parse(state.elapsedCountUp);			
			updateShorthandReferences();
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
    document.getElementById("mainClock").innerHTML = timer.value;
	document.getElementById("shiftClock").innerHTML = formatTime(state.shiftTime, true) + "<br>" + shift.value;
	if(state.startTime != null) {		
		document.getElementById("elapsedClock").innerHTML = formatTime(getElapsed(), true)  + "<br>" + elapsed.value;

	} else {
		document.getElementById("elapsedClock").innerHTML = formatTime(0, true)  + "<br>" + elapsed.value;
	}
	saveState();
}

function setPauseDisplay(setDot = 1) {
	if(timer.isPaused) {		
		if(!elapsed.isPaused) {
			setActionLabel("Resume");
			document.getElementById("mainClock").classList.add("paused");
			if(setDot) {
				document.getElementById("resets").innerHTML += newDot("pause");
			}
		} else { // When the elapsed timer is paused, treat the whole timer as 'Off'.
			document.getElementById("shiftClock").classList.add("paused");
			document.getElementById("elapsedClock").classList.add("paused");
			setActionLabel("Start");
		}
	} else {
		document.getElementById("mainClock").classList.remove("paused");
		if(!elapsed.isPaused) {
			document.getElementById("shiftClock").classList.remove("paused");
			document.getElementById("elapsedClock").classList.remove("paused");
		}
		setActionLabel("Pause");
	}
}

/* Timer */
/*********/
function addTime(minutes, color = "") {
	timer.addMinutes(minutes);
	document.getElementById("resets").innerHTML += newDot(color);
	refreshClock();
}

function addTicketTime(minutes, color = "") {
	if(state.timerIsExpired) {
		state.timerIsExpired = false;
		timer.value = 0;
	}
	addTime(minutes, color);
}

function addShiftTime(minutes) {
	shift.addMinutes(minutes);
	state.shiftTime += minutes * 60;
	if(state.shiftTime < 0) state.shiftTime = 0;
	refreshClock();
}

function setPause(newPause, newAllPause) {
	if(newAllPause == true) newAllPause 
	if(newPause == true) {
		timer.pause();
	} 
	else {
		timer.unpause();
	}
	state.pause = newPause;
	state.allpause = newAllPause;
	if(newAllPause) {
		setPauseDisplay(!newAllPause);
	}
	refreshClock();
}

function togglePause() {
	if(state.allpause && state.pause) startElapsedTimer();
	if(timer.isPaused && shift.isPaused) elapsed.reset();
	setPause(!state.pause);
}

function resetTimer() {
	if (typeof(Storage) !== "undefined") window.localStorage.clear();
	state = Object.assign({}, getDefaultState());
	updateShorthandReferences();
	document.getElementById("resets").innerHTML = "";
	setActionLabel("Start");
	setPause(1, 1);
}

function startElapsedTimer() {
	state.startTime = new Date().getTime();
}

// Start the countdown timer with a 1 second interval.
setInterval(() => {
	if(timer.isExpired) {
		addTime(5, "expire");
		state.timerIsExpired = true;
	}
	if (!state.allpause) {
		if(state.shiftTime > 0) state.shiftTime--;
		state.elapsed++;
		refreshClock();
	}
}, 1000);
