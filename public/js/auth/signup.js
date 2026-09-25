// Sign-up page slider, validation, and password visibility.
/* ── App Image Slider & Content ── */
const slides = document.querySelectorAll('.app-slide');
const dots   = document.querySelectorAll('.dot');
const sliderTitle = document.getElementById('sliderTitle');
const sliderDesc = document.getElementById('sliderDesc');

// Content for each slide
const slideContents = [
  {
    title: "Send Money Worldwide Effortlessly.",
    desc: "Enjoy guaranteed exchange rates and instant transfers to your loved ones anytime, anywhere."
  },
  {
    title: "Track Your Transfers in Real-Time.",
    desc: "Stay updated with live status notifications from transfer initiation to pickup."
  },
  {
    title: "Lowest Transfer Fees Guaranteed.",
    desc: "Transparent pricing with no hidden charges so your family gets more."
  },
  {
    title: "Bank-Grade Security for Peace of Mind.",
    desc: "Your transactions are shielded with 256-bit encryption and advanced fraud protection."
  }
];

let current = 0;
let timer;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  
  current = idx;
  
  slides[current].classList.add('active');
  dots[current].classList.add('active');

  // Update text content with subtle animation
  if (sliderTitle && sliderDesc) {
    sliderTitle.textContent = slideContents[current].title;
    sliderDesc.textContent = slideContents[current].desc;
  }
}

function next() { goTo((current + 1) % slides.length); }

function startSlider() { timer = setInterval(next, 4000); }
function stopSlider()  { clearInterval(timer); }

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    stopSlider();
    goTo(parseInt(dot.dataset.index));
    startSlider();
  });
});

startSlider();

/* ── Login Form ── */
const $ = id => document.getElementById(id);
let mode = "email";

$("emailTab").onclick = () => {
  mode = "email";
  $("emailTab").className = "flex-1 py-2.5 rounded-lg bg-white text-slate-900 shadow-sm font-bold transition-all";
  $("smsTab").className   = "flex-1 py-2.5 rounded-lg hover:text-slate-900 transition-all";
  $("identifierLabel").textContent = "Email Address";
  $("identifier").type        = "email";
  $("identifier").placeholder = "name@example.com";
};

$("smsTab").onclick = () => {
  mode = "sms";
  $("smsTab").className   = "flex-1 py-2.5 rounded-lg bg-white text-slate-900 shadow-sm font-bold transition-all";
  $("emailTab").className = "flex-1 py-2.5 rounded-lg hover:text-slate-900 transition-all";
  $("identifierLabel").textContent = "Registered Mobile Number";
  $("identifier").type        = "tel";
  $("identifier").placeholder = "+880 1XXXXXXXXX";
};

$("togglePassword").onclick = () => {
  $("password").type = $("password").type === "password" ? "text" : "password";
};

function showMessage(text, success = false) {
  $("message").textContent = text;
  $("message").className = "mb-4 p-3 rounded-xl text-xs font-medium " +
    (success ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
             : "bg-red-50 border border-red-200 text-red-700");
}

$("forgot").onclick = e => {
  e.preventDefault();
  showMessage("Password reset functionality should be connected to your backend/API.");
};

$("loginForm").onsubmit = e => {
  e.preventDefault();

  const identifier = $("identifier").value.trim();
  const password   = $("password").value;

  const users = JSON.parse(localStorage.getItem("payOnTimeUsers") || "[]");
  const user  = users.find(u =>
    mode === "email"
      ? u.email.toLowerCase() === identifier.toLowerCase() && u.password === password
      : u.phone === identifier && u.password === password
  );

  if (!user) {
    showMessage("Invalid login information. Please check your credentials.");
    return;
  }

  localStorage.setItem("payOnTimeCurrentUser", JSON.stringify(user));
  showMessage("Login successful! Redirecting...", true);

  setTimeout(() => { window.location.href = "/"; }, 700);
};
