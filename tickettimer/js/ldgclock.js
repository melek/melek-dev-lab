class dev.melek.Clock {
  constructor(initialDate = new Date()) {  // Constructor
    this.moment = initialDate; // The Reference time is used for timers and countdowns.
    this.timezone = 0; // The Timezone is used for clock displays. It is an integer for UTC offset.
    this.direction = forward;
    this.paused = null; // Pausing a countdown or timer 
  }


}
}
