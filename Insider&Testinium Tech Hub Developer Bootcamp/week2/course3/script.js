const menu = document.getElementById("menu");
const screen = document.getElementById("screen");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("startBtn");

const yearInput = document.getElementById("yearInput");
const monthInput = document.getElementById("monthInput");
const dayInput = document.getElementById("dayInput");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secondInput = document.getElementById("secondInput");

const videoScreen = document.getElementById("videoScreen");
const videoFrame = document.getElementById("videoFrame");

let countdownInterval;

startBtn.addEventListener("click", () => {
  let totalMillis =
      (parseInt(yearInput.value) || 0) * 365 * 24 * 60 * 60 * 1000 +
      (parseInt(monthInput.value) || 0) * 30 * 24 * 60 * 60 * 1000 +
      (parseInt(dayInput.value) || 0) * 24 * 60 * 60 * 1000 +
      (parseInt(hourInput.value) || 0) * 60 * 60 * 1000 +
      (parseInt(minuteInput.value) || 0) * 60 * 1000 +
      (parseInt(secondInput.value) || 0) * 1000;

  if (totalMillis <= 0) {
    alert("enter a valid time greter than 0");
    return;
  }

  menu.classList.add("fade-out");

  setTimeout(() => {
    menu.style.display = "none";
    screen.classList.remove("hidden");
  }, 800);

  const targetTime = Date.now() + totalMillis;

  countdownInterval = setInterval(() => {
    const now = Date.now();
    let diff = targetTime - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      timeDisplay.textContent = "00:00:00:00:00:00";
      setTimeout(showVideo, 1000);
      return;
    }

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    diff %= (1000 * 60 * 60 * 24 * 365);

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    diff %= (1000 * 60 * 60 * 24 * 30);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff %= (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
    diff %= (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60)).toString().padStart(2, '0');
    diff %= (1000 * 60);

    const seconds = Math.floor(diff / 1000).toString().padStart(2, '0');

    timeDisplay.textContent = `${years}:${months}:${days}:${hours}:${minutes}:${seconds}`;
  }, 1000);
});

function showVideo() {
  screen.classList.add("hidden");
  videoScreen.classList.remove("hidden");
  videoFrame.src = "https://www.youtube.com/embed/XZMlxtIOUjA?autoplay=1";
}