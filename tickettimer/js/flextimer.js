/* FlexTimer Class

  Each instance has 4 levers/variables that everything else is derived from:
  _referenceDate  Date object
  _pausedDate     null | Date object
  _format         Object
  type            string
*/

class FlexTimer {
  constructor(minuteOffset = 0, forceHours = false, startPaused = false) {  // constructor
    this.reset(minuteOffset, forceHours, startPaused);
  }

  reset(minuteOffset = 0, forceHours = this._format.forceHours, startPaused = true) {  // deferred constructor
    let msOffset = minuteOffset * 60000;
    let now = new Date();
    let nowInMs = now.getTime();
    let newReferenceDate = new Date(nowInMs + msOffset);

    this._referenceDate = newReferenceDate; // Date to count down to or up from.
    this.type = this._implicitType;
    this._format = {
      "forceHours": forceHours
    };

    if (startPaused) {
      this._pausedDate = now;
    }
    else {
      this._pausedDate = null;
    }
  }

  parse(source) {
    if (typeof source == "string") {
      source = JSON.parse(source);
    }
    this._referenceDate = new Date(source._referenceDate);
    if (source._pausedDate != null) {
      this._pausedDate = new Date(source._pausedDate);
    }
    else {
      this._pausedDate = null;
    }
    this._format = source._format;
    this.type = source.type;
    return this;
  }

  get _referenceTime() {
    return this._referenceDate.getTime();
  }

  get _implicitType() {
    if (this._referenceDate > new Date()) {
      return "countdown";
    }
    else {
      return "countup";
    }
  }

  addMinutes(minutes) {
    if(this.type == "countup") {
      minutes *= -1; // Pull the reference date earlier to make countup timers appear to increase.
    }
    this._referenceDate = new Date(this._referenceDate.getTime() + minutes * 60000);
  }

  get _countup() {
    let now = new Date().getTime();
    return Math.max(0, now - this._referenceTime);
  }

  get _countdown() {
    let now = new Date().getTime();
    return Math.max(0, this._referenceTime - now);
  }

  get _msValue() {
    if (this.type == "countdown") {
      return this._countdown;
    } else {
      return this._countup;
    }
  }

  get _displayValue() {
      return this._toTimeString(this._msValue);
  }

  get isExpired() {
    if(this.type == "countup" 
      || this._countdown > 0 
      || (this.isPaused && this._msValueAtPause > 0)) {
      return false;
    }
    else {
      return true;
    }
  }

  get value() {
    if (this.isPaused) {
      return this._valueAtPause;
    }
    return this._displayValue;
  }

  set value(minutes) {
    let offsetMs = minutes * 60000;
    this._referenceDate = new Date(new Date().getTime() + offsetMs);
  }

  _toTimeString(msTotal, forceHours = this._format.forceHours) {
    let secTotal = Math.floor(msTotal / 1000);
    let hr = Math.floor(secTotal / 3600);
    if (hr < 1 && forceHours) 
    {
      hr = "";
    }
    else {        
      hr = hr + ":";    
    }

    let min = Math.floor(secTotal / 60) % 60;
    if (min < 10) { 
      min = "0" + min; 
    }

    let sec = "";
    sec = secTotal % 60;
    if (sec < 10) sec = "0" + sec;
    sec = ":" + sec;

    return `${hr}${min}${sec}`;
  }

  get isPaused() {
    if (this._pausedDate instanceof Date) {
      return true;
    }
    else {
      return false;
    }
  }

  get _pausedTime() {
    if (this.isPaused) {
      return this._pausedDate.getTime();
    }
    else {
      return null;
    }
  }

  get _msValueAtPause() {
    if(this.isPaused) {
      return this._referenceTime - this._pausedTime;
    }
    else {
      return null;
    }
  }

  get _valueAtPause() {
    if(this.isPaused) {
      return this._toTimeString(this._msValueAtPause);
    }
    else {
      return null;
    }
  }

  pause() {
    if (!this.isPaused) {
      this._pausedDate = new Date();
    }
  }

  unpause() {
    if (this.isPaused) {
      let nowInMS = new Date().getTime();
      this._referenceDate = new Date(nowInMS + this._msValueAtPause);
      this._pausedDate = null;
    }
  }
}
