/* Full screen capability */
/**************************/

// Lifted directly from https://www.w3schools.com/howto/howto_js_fullscreen.asp
/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

function setFullscreenControl() {}

/* View in fullscreen */
function openFullscreen() {
	document.getElementById("openFullScreen").classList.add("hidden");
	document.getElementById("closeFullScreen").classList.remove("hidden");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
	document.getElementById("openFullScreen").classList.remove("hidden");
	document.getElementById("closeFullScreen").classList.add("hidden");
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
