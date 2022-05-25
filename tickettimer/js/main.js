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
	return `<div class='reset-dot ${cssClass}' title="${cssClass} at ${elapsed.value}"></div>`;
}

/* Clock Display */
/*****************/
function refreshClock() {
    document.getElementById("mainClock").innerHTML = timer.value;
	document.getElementById("shiftClock").innerHTML = shift.value;
	document.getElementById("elapsedClock").innerHTML = elapsed.value;

	saveState();
}

function setPauseDisplay(setDot = 1) {
	if(timer.isPaused) document.getElementById("mainClock").classList.add("paused");
		else document.getElementById("mainClock").classList.remove("paused");
	if(shift.isPaused) document.getElementById("shiftClock").classList.add("paused");
		else document.getElementById("shiftClock").classList.remove("paused");
	if(elapsed.isPaused) document.getElementById("elapsedClock").classList.add("paused");
		else document.getElementById("elapsedClock").classList.remove("paused");

	if( timer.isPaused &&  elapsed.isPaused) setActionLabel("Start");	
	if(!timer.isPaused && !elapsed.isPaused) setActionLabel("Pause");
	if( timer.isPaused && !elapsed.isPaused) {
		if(setDot) document.getElementById("resets").innerHTML += newDot("pause");	
		setActionLabel("Unpause");
	}
}

/* Button Action Control */
/*************************/

function mainButtonAction() {
	if( timer.isPaused &&  elapsed.isPaused) startTimer();
	else togglePause();
}

/* Timer */
/*********/
function startTimer() {
	timer.unpause();
	elapsed.unpause();
	shift.unpause();
	setPauseDisplay(false);
	setActionLabel("Pause");
}

function togglePause() {
	if(timer.isPaused) timer.unpause();
		else timer.pause();
	setPauseDisplay(true);
}

function resetTimer() {
	if (typeof(Storage) !== "undefined") window.localStorage.clear();
	state = Object.assign({}, getDefaultState());
	updateShorthandReferences();
	document.getElementById("resets").innerHTML = "";
	setActionLabel("Start");
}

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
	refreshClock();
}

function addShiftTime(minutes) {
	shift.addMinutes(minutes);
	state.shiftTime += minutes * 60;
	if(state.shiftTime < 0) state.shiftTime = 0;
	refreshClock();
}

function setPause(newPause) {	
	if(newPause == true) {
		timer.pause();
		setPauseDisplay(1);
	} 
	else {
		timer.unpause();
		shift.unpause();
		elapsed.unpause();
	}
	state.pause = newPause;
	state.allpause = newAllPause;
	if(newAllPause) {
		setPauseDisplay(!newAllPause);
	}
	refreshClock();
}

// Refresh the clock on an interval to display the countdown
setInterval(() => {
	if(timer.isExpired) {
		addTime(5, "expire");
		state.timerIsExpired = true;
	}			
	refreshClock();
}, 100);
