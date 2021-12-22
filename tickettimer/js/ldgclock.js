class FlexTimer {
    constructor(initialDate = new Date()) {  // Constructor
        this._referenceTime  = initialDate; // Date in Milliseconds to count down/up to.       
        this._pausedTime = null;           // Offset from _alarmTime in Milliseconds when the timer was last paused.
        this.type        = this._implicitType(initialDate);
      }

    get _implicitType() {
      if(this._referenceTime > Date()) {
        return "countdown";
      }
      else {
        return "countup";
      }
    }

    get _countdown() {
      Math.max(Date() - this._referenceTime, 0);
    }

    get _countup() {
      Math.max(this._referenceTime - Date(), 0);
    }

    get _timerValue(displayType = this.type) {
      if(displayType == "countdown") {
        return this._countdown();
      } else {
        return this._countup();
      }
    }

    _toTimeString(dateToFormat) {
      if(dateToFormat instanceof Number || dateToFormat instanceof String) {
        dateToFormat = new Date(dateToFormat);
      } 
      if( !(dateToFormat instanceof Date) ) {
        throw "FlexTimer._toTimeString requires a Date object, Number, or String.";
      }
      return dateToFormat.toTimeString().substring(0,8);
    }

    valueOf() {
      return this._toTimeString(this._timerValue);
    }
  
    reset(newReferenceTime = new Date()) {
        this._referenceTime = newReferenceTime;
    }

    get isPaused() {
      if(this._pausedTime instanceof Date) {
        return true;
      }
      else {
        return false;
      }
    }

    pause() {
      if(this.isPaused) {
        this._pausedTime = new Date();
      }
    }

    unpause() {
      if(this.isPaused) {
        this._referenceTime = new Date(Date() + (this._referenceTime - this.timePaused));
        this._pausedTime = null;
      }
    }
}
