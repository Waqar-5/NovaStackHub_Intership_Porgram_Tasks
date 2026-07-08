// ===== Countdown Timer Logic =====

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const eventLabel = document.getElementById('eventLabel');
const expiredMessage = document.getElementById('expiredMessage');
const countdownGrid = document.querySelector('.countdown-grid');

const customForm = document.getElementById('customForm');
const eventNameInput = document.getElementById('eventName');
const eventDateInput = document.getElementById('eventDate');
const presetButtons = document.querySelectorAll('.preset-btn');

let countdownInterval = null;
let targetDate = null;

// ===== Default: countdown to next New Year =====
function getNextNewYear() {
  const now = new Date();
  return new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
}

function startCountdown(date, label) {
  targetDate = date;
  eventLabel.textContent = label;
  expiredMessage.classList.add('hidden');
  countdownGrid.classList.remove('hidden');

  if (countdownInterval) clearInterval(countdownInterval);

  updateCountdown(); // run immediately so there's no 1-second blank delay
  countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance <= 0) {
    clearInterval(countdownInterval);
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    expiredMessage.classList.remove('hidden');
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ===== Custom Form Submit =====
customForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const dateValue = eventDateInput.value;
  if (!dateValue) return;

  const chosenDate = new Date(dateValue);
  const label = eventNameInput.value.trim() || 'Custom Countdown';

  startCountdown(chosenDate, label);
});

// ===== Preset Buttons =====
presetButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = btn.dataset.preset;
    const now = new Date();
    let date, label;

    switch (preset) {
      case 'newyear':
        date = getNextNewYear();
        label = `New Year ${date.getFullYear()}`;
        break;
      case '1hour':
        date = new Date(now.getTime() + 60 * 60 * 1000);
        label = '1 Hour From Now';
        break;
      case '1day':
        date = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        label = '1 Day From Now';
        break;
      case '1week':
        date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        label = '1 Week From Now';
        break;
      default:
        return;
    }

    startCountdown(date, label);
  });
});

// ===== Initialize on Load =====
window.addEventListener('DOMContentLoaded', () => {
  const nextNewYear = getNextNewYear();
  startCountdown(nextNewYear, `New Year ${nextNewYear.getFullYear()}`);
});
