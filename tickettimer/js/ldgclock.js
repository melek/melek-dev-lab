class FlexTimer {
    constructor(initialDate = new Date()) {  // Constructor
        this._alarmTime  = initialDate; // Date in Milliseconds to count down/up to.
        this._isPaused   = null;        
        this._pausedTime = 0;           // Offset from _alarmTime in Milliseconds when the timer was last paused.
    }

    start(initialDate = new Date()) {
        this._moment = initialDate;
    }

    format(newFormat) {
        this._format = newFormat;
    }

    timer() {
        
    }

    countdown() {
        return 
    }

    printClock(tz = this._timeZone) {
        return new Date(this.format(tz));
    }
}
