/* FlexTimer Class

  The FlexTimer works by recording the start time of the timer offset by the 
  target amount of time (usually in minutes). This is the _referenceTime. 

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

  // Parses a stringified JSON of this object into a new timer
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

  // Returns either the current date/time, or the date/time at which the timer was paused.
  get _now() {
    if(this.isPaused)  return this._pausedTime;
    else return new Date().getTime();
  }

  get _countup() {
    return Math.max(0, this._now - this._referenceTime);
  }

  get _countdown() {
    return Math.max(0, this._referenceTime - this._now);
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
    if(this.type == "countup" || this._countdown > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  get value() {
    return this._displayValue;
  }

  set value(minutes) {
    let offsetMs = minutes * 60000;
    this._referenceDate = new Date(new Date().getTime() + offsetMs);
  }

  _toTimeString(msTotal, forceHours = this._format.forceHours) {
    let secTotal = Math.floor(Math.abs(msTotal) / 1000);
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

  /* The pause feature works by setting a 'Paused Date'. This value being non-null is
     the signal that the timer is paused. When unpausing, the reference time is updated
     by '_msValueAtPause' to maintain the same offset as the timer had when paused.
     
     isPaused:        Is _pausedDate set?
     _pausedDate:     A date object marking when the timer was paused. 
     _pausedTime:     The MS value of _pausedDate.
     _msValueAtPause: The MS value of the timer, so _pausedTime - _referenceTime.

     pause():         Sets pausedDate.
     unpause():       Updates the timer's _referenceTime to be the current time
                      minus the time elapsed when paused (_msValueAtPause).
                      Then, it resets pausedDate to null.
  */
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
      return this._pausedTime - this._referenceTime;
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
      this._referenceDate = new Date(nowInMS - this._msValueAtPause);
      this._pausedDate = null;
    }
  }

  togglepause() {
    if(this.isPaused) this.unpause();
    else this.pause();
  }
}
