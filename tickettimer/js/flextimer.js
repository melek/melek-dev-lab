class FlexTimer {
    constructor(minuteOffset = 0) {  // constructor
        let newReferenceDate = undefined;

        if(minuteOffset == 0) {
            newReferenceDate = new Date();
        }
        else { 
            let msOffset = minuteOffset * 60000;
            let nowInMs = new Date().getTime();
            newReferenceDate = new Date( nowInMs + msOffset );
        }

        this._referenceDate = newReferenceDate;     // Date to count down to or up from.
        this._pausedDate    = null;
        this._valueAtPause  = null;           
        this.type           = this._implicitType;
      }

    get _referenceTime() {
        return this._referenceDate.getTime();
    }

    get _implicitType() {
      if(this._referenceDate > new Date()) {
        return "countdown";
      }
      else {
        return "countup";
      }
    }

    get _countup() {
        let now = new Date().getTime();
        return Math.max(0, now - this._referenceTime);
    }

    get _countdown() {
        let now = new Date().getTime();
        return Math.max(0, this._referenceTime - now);
    }

    get value() {
        if(this.isPaused) {
            return this._valueAtPause;
        }
        if(this.type == "countdown") {
            return this._toTimeString(this._countdown);
        } else {
            return this._toTimeString(this._countup);
        }
    }

    _toTimeString(msTotal) { 
        let secTotal = Math.floor(msTotal / 1000);
        let hr = Math.floor(secTotal / 3600);
        if(hr < 1 ) { hr = hr + ":"; }

        let min = Math.floor(secTotal / 60) % 60;
        if(min < 10) { min = "0" + min; }

        let sec = "";       
        sec = secTotal % 60;
        if(sec < 10) sec = "0" + sec;
        sec = ":" + sec;

        return `${hr}${min}${sec}`;
    }

    // Positive values will set a countdown timer; Values <= 0 will set an elapsed timer.
    reset(minuteOffset = 0) {
        if(minuteOffset == 0) {
            this.constructor();
        }
        else { 
            let msOffset = minuteOffset * 60000;
            let nowInMs = new Date().getTime();
            let newDate = new Date( nowInMs + msOffset );
            this.constructor(newDate);
        }
    }

    get _pausedTime() {
        if(this.isPaused) {
            return this._pausedDate.getTime();
        }
        else {
            return null;
        }
    }

    get isPaused() {
      if(this._pausedDate instanceof Date) {
        return true;
      }
      else {
        return false;
      }
    }

    pause() {
      if(this.isPaused) {
        this._valueAtPause = this.value;
        this._pausedDate = new Date();
      }
    }

    unpause() {
      if(this.isPaused) {
        let now = new Date().getTime();
        this._referenceDate = new Date(now + (this._referenceTime - this._pausedTime));
        this._pausedDate = null;
      }
    }
}
