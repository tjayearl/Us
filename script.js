/* ---------------------------
   HAMBURGER MENU
   --------------------------- */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

/* ---------------------------
   THEME TOGGLE
   --------------------------- */
const themeToggle = document.getElementById("theme-toggle");

// Only run theme logic if the toggle button exists on the page
if (themeToggle) {
  const body = document.body;

  // Initialize theme from stored preference
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
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

/* ---------------------------
   COUNTDOWNS
   --------------------------- */
const countdownContainer = document.getElementById('countdown-container');

// Use full date strings for accuracy
const events = [
  { name: "Your Birthday", date: "2025-08-31T00:00:00", icon: "🎂" },
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

/* Function to navigate home, used by secret.html */
function goHome() {
  window.location.href = 'index.html';
}

/* ---------------------------
   SECRET MESSAGES (example with hash)
   --------------------------- */
if (document.getElementById('passwordInput')) {
  const secretPassword = "Foreverandforalways";
  let wrongAttempts = 0;

  function checkPassword() {
    const input = document.getElementById("passwordInput").value;
    if (input === secretPassword) {
      document.getElementById("secretMessage").style.display = "block";
      document.getElementById("passwordSection").style.display = "none";
  
      createHearts();
  
      let audio = new Audio("media/romantic-song.mp3"); // Assuming music is in a 'media' folder like your other audio
      audio.volume = 0.5;
      audio.play();

      wrongAttempts = 0; // reset attempts when correct
    } else {
      wrongAttempts++;
  
      if (wrongAttempts >= 3) {
        showCuteMessage();
        wrongAttempts = 0; // reset attempts after showing message
      } else {
        alert("Hmm… do you remember? 😉 Try again!");
      }
    }
  }

  function showCuteMessage() {
    // Create a full-screen overlay with a cute message
    const overlay = document.createElement("div");
    overlay.classList.add("cute-message");
    overlay.innerHTML = `
      <div class="message-box">
        <h2>Babe... 😘</h2>
        <p>You’re forgetting our special phrase ❤️</p>
        <button onclick="closeCuteMessage()">Let me try again</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }
  
  function closeCuteMessage() {
    document.querySelector(".cute-message").remove();
  }

  function createHearts() {
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.innerHTML = "❤️";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.animationDuration = Math.random() * 3 + 2 + "s";
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
  }
}

/* ---------------------------
   INTERACTIVE GOAL CARDS
   --------------------------- */
let goals = JSON.parse(localStorage.getItem('goals')) || [
  {
    title: "Travel The World ✈️",
    description: "Exploring new cultures and creating memories together.",
    status: "Dreaming 💭" // Can be: Dreaming 💭, Planning 📝, In Progress 🔄, Achieved ✅
  },
  {
    title: "Move In Together 🏡",
    description: "Starting our new chapter in a place we can call our own.",
    status: "Dreaming 💭"
  },
  {
    title: "Get Married 💍",
    description: "Tying the knot and celebrating our love with family and friends.Na sio watu walikuwa wanakudai",
    status: "Dreaming 💭"
  },
  {
    title: "Buy Our First Car 🚗",
    description: "For all our future road trips and adventures.Lazima ka aventure!",
    status: "Dreaming 💭"
  }
];

const goalsContainer = document.getElementById('goals-container');

function saveGoals() {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function updateGoalsProgress() {
  const achievedCount = goals.filter(goal => goal.status.includes('Achieved')).length;
  const totalGoals = goals.length;
  const progressTracker = document.getElementById('goals-progress-tracker');
  if (progressTracker) {
    progressTracker.innerHTML = `<span>${achievedCount}/${totalGoals} Achieved 🎯</span>`;
  }
}

function renderGoals() {
  if (!goalsContainer) return;
  goalsContainer.innerHTML = ''; // Clear existing goals

  goals.forEach((goal, index) => {
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.draggable = true;
    card.dataset.index = index;
    // Add a class based on status for styling
    const statusClass = goal.status.split(' ')[0].toLowerCase();
    card.classList.add(`status-${statusClass}`);

    card.innerHTML = `
      <div class="goal-card-content">
        <h3>${goal.title}</h3>
        <p>${goal.description}</p>
        <div class="goal-status">${goal.status}</div>
      </div>
    `;

    // Add confetti for achieved goals
    if (goal.status.includes('Achieved')) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.innerHTML = '🎉';
      card.appendChild(confetti);
    }

    goalsContainer.appendChild(card);
  });

  updateGoalsProgress();
}

// Initial render on page load
if (goalsContainer) {
  // --- Drag and Drop Logic ---
  let dragStartIndex;

  function dragStart() {
    dragStartIndex = +this.dataset.index;
  }

  function dragOver(e) {
    e.preventDefault(); // Necessary to allow drop
  }

  function drop() {
    const dragEndIndex = +this.dataset.index;
    swapGoals(dragStartIndex, dragEndIndex);
    this.classList.remove('over');
  }

  function swapGoals(fromIndex, toIndex) {
    const itemOne = goals[fromIndex];
    const itemTwo = goals[toIndex];

    goals[fromIndex] = itemTwo;
    goals[toIndex] = itemOne;

    saveGoals();
    renderGoals();
  }

  function addDragListeners() {
    const draggables = document.querySelectorAll('.goal-card');
    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', dragStart);
      draggable.addEventListener('dragover', dragOver);
      draggable.addEventListener('drop', drop);
    });
  }

  renderGoals();
  addDragListeners();
}

/* ---------------------------
   MOTIVATIONAL QUOTES
   --------------------------- */
const quotes = [
  "The future belongs to those who believe in the beauty of their dreams.",
  "Together is a beautiful place to be.",
  "A journey of a thousand miles begins with a single step.",
  "The best is yet to come.",
  "Let's build a life we love."
];

const quoteContainer = document.getElementById('motivational-quote');
let currentQuoteIndex = 0;

function showNextQuote() {
  if (!quoteContainer) return;
  quoteContainer.classList.remove('visible');
  setTimeout(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    quoteContainer.textContent = `"${quotes[currentQuoteIndex]}"`;
    quoteContainer.classList.add('visible');
  }, 500); // Wait for fade-out transition
}

if (quoteContainer) {
  showNextQuote(); // Initial quote
  setInterval(showNextQuote, 7000); // Change quote every 7 seconds
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
   VIDEO FILTERING
   --------------------------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const videoItems = document.querySelectorAll('.video-item');

if (filterButtons.length > 0 && videoItems.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      videoItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          // You can add a fade-in animation class here if you like
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}


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
