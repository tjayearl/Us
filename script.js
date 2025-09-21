/* ---------------------------
   THEME TOGGLE
   --------------------------- */
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");

// Initialize theme from stored preference (optional)
if (localStorage.getItem("theme") === "dark") {
  body.classList.remove("light-mode");
  body.classList.add("dark-mode");
  themeToggle.setAttribute("aria-pressed", "true");
} else {
  body.classList.remove("dark-mode");
  body.classList.add("light-mode");
  themeToggle.setAttribute("aria-pressed", "false");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  body.classList.toggle("dark-mode");
  const isDark = body.classList.contains("dark-mode");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  // persist
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ---------------------------
   COUNTDOWNS
   --------------------------- */
const countdownContainer = document.getElementById('countdown-container');

// Use full date strings for accuracy
const events = [
  { name: "Her Birthday", date: "2025-08-31T00:00:00", icon: "🎂" },
  { name: "Anniversary", date: "2025-09-01T00:00:00", icon: "❤️" },
  { name: "My Birthday", date: "2025-09-05T00:00:00", icon: "🎉" }
];

// Create the HTML structure for each countdown
function setupCountdowns() {
  if (!countdownContainer) return;
  countdownContainer.innerHTML = ''; // Clear previous content
  events.forEach((event, index) => {
    const element = document.createElement('div');
    element.className = 'countdown-item';
    element.innerHTML = `
      <h3>${event.name} ${event.icon}</h3>
      <div class="timer" id="timer-${index}"></div>
    `;
    countdownContainer.appendChild(element);
  });
}

function celebrate() {
  // Create a burst of hearts when a countdown finishes
  for (let i = 0; i < 20; i++) {
    setTimeout(createHeart, i * 100);
  }
}

function updateAllCountdowns() {
  events.forEach((event, index) => {
    const now = new Date();
    let targetDate = new Date(event.date);

    // If the date has already passed this year, set it for next year
    if (targetDate < now) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    const diff = targetDate - now;

    // If the event is happening now, display a message
    if (diff <= 0 && diff > -1000 * 60 * 60 * 24) { // Within 24 hours after start
      const timerEl = document.getElementById(`timer-${index}`);
      if (timerEl && !timerEl.textContent.includes("Today")) {
        timerEl.textContent = `It's today! ${event.icon}`;
        celebrate();
      }
      // If it's already showing the message, just return.
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const format = (num) => String(num).padStart(2, '0');

    const timerEl = document.getElementById(`timer-${index}`);
    if (timerEl) {
      timerEl.innerHTML = `<span>${days}</span>d <span>${format(hours)}</span>h <span>${format(minutes)}</span>m <span>${format(seconds)}</span>s`;
    }
  });

  // After updating all, find and highlight the closest one
  highlightClosestEvent();
}

function highlightClosestEvent() {
  const now = new Date();
  let closestEventIndex = -1;
  let minDiff = Infinity;

  events.forEach((event, index) => {
    let targetDate = new Date(event.date);
    if (targetDate < now) targetDate.setFullYear(targetDate.getFullYear() + 1);
    const diff = targetDate - now;
    if (diff > 0 && diff < minDiff) {
      minDiff = diff;
      closestEventIndex = index;
    }
  });

  document.querySelectorAll('.countdown-item').forEach((item, index) => {
    item.classList.toggle('closest-event', index === closestEventIndex);
  });
}

// Initial setup and start the interval
if (countdownContainer) {
  setupCountdowns();
  updateAllCountdowns();
  setInterval(updateAllCountdowns, 1000);
}

/* ---------------------------
   SECRET MESSAGES (example with hash)
   --------------------------- */
const unlockBtn = document.getElementById("unlock-btn");
const lockBtn = document.getElementById("lock-btn");
const secretContent = document.getElementById("secret-content");
const secretInput = document.getElementById("secret-password");

// MD5 hash of "Foreverandforalways" (if using md5)
const correctHash = "fe8768bf842b5559ff0e69092c4bd865";

function unlockMessages() {
  const password = document.getElementById("secret-password").value.trim();

  try {
    if (md5(password) === correctHash) {
      document.getElementById("secret-content").style.display = "block";
      localStorage.setItem("unlocked", "true");
    } else {
      alert("Wrong password!");
    }
  } catch (e) {
    console.error("MD5 function is not working. Check if md5.min.js is loaded correctly.");
    alert("There was an error verifying the password.");
  }
}
unlockBtn.addEventListener("click", unlockMessages);

// Auto-unlock if previously unlocked
if (localStorage.getItem("unlocked") === "true") {
  document.getElementById("secret-content").style.display = "block";
}

/* ---------------------------
   FADE-IN: IntersectionObserver
   --------------------------- */
const faders = document.querySelectorAll(".fade-in");
const observerOptions = { root: null, threshold: 0.12, rootMargin: "0px 0px -80px 0px" };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      // optionally unobserve for performance
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

faders.forEach(el => observer.observe(el));

/* ---------------------------
   FLOATING HEARTS (improved)
   --------------------------- */
const heartsContainer = document.getElementById("hearts-container");
let heartsIntervalId = null;

function createHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.innerHTML = "❤️";

  // Randomize size and horizontal position
  const size = 12 + Math.random() * 28; // 12px - 40px
  heart.style.fontSize = `${size}px`;
  heart.style.left = `${Math.random() * 95}vw`;

  // Start somewhere near the bottom (so it floats upward)
  const startBottom = Math.random() * 12 + 0; // 0vh - 12vh
  heart.style.bottom = `${startBottom}vh`;

  // random color that shows on both themes (tweak as needed)
  const colors = ["#ff6fb5", "#b28cff", "#8fc9ff", "#ffd1f0"];
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];

  // random duration
  const duration = 4 + Math.random() * 5; // 4s - 9s
  heart.style.animation = `float-up ${duration}s linear forwards`;

  // ensure hearts are above content but below nav/toggle
  heart.style.zIndex = 450;

  heartsContainer.appendChild(heart);

  // remove after animation (duration + small buffer)
  setTimeout(() => {
    heart.remove();
  }, (duration + 0.6) * 1000);
}

// create hearts at intervals but stop if page is hidden
function startHearts() {
  if (heartsIntervalId) return;
  heartsIntervalId = setInterval(createHeart, 700); // new heart every 700ms
}
function stopHearts() {
  if (!heartsIntervalId) return;
  clearInterval(heartsIntervalId);
  heartsIntervalId = null;
}

// Respect page visibility (don't spawn when hidden)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopHearts();
  else startHearts();
});

// Start on load
startHearts();

/* ---------------------------
   Small UX: start music on user gesture (autoplay often blocked)
   --------------------------- */
const bgMusic = document.getElementById("bg-music");
function tryStartMusic() {
  if (bgMusic && bgMusic.paused) {
    bgMusic.play().catch(()=>{/* autoplay blocked: fine */});
    // remove handler once used
    window.removeEventListener("click", tryStartMusic);
  }
}
// Some browsers block autoplay; start on first user click if blocked
window.addEventListener("click", tryStartMusic, { once: true });