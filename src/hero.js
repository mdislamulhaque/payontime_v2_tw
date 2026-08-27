// Initialize Icons
lucide.createIcons();

// --- 1. CAROUSEL SLIDER LOGIC ---
const slides = [
  {
    badge: "⚡ Instant Express Transfers",
    description: "Transfer directly to bKash, Nagad, Mobile Wallets, and Bank Accounts across East Africa & South Asia with locked-in FX rates."
  },
  {
    badge: "💎 Best Exchange Rates Guaranteed",
    description: "We match real interbank market rates with zero hidden markups or surprise transfer fees. What you see is what your family gets."
  },
  {
    badge: "🛡️ Bank-Grade Security",
    description: "Your hard-earned money is protected by multi-factor security protocols and end-to-end encrypted transaction audits."
  }
];

let currentSlide = 0;
const slideBadge = document.getElementById("slide-badge");
const slideDesc = document.getElementById("slide-desc");
const dotsContainer = document.getElementById("dots-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

// Generate Dots
function renderDots() {
  dotsContainer.innerHTML = "";
  slides.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = `h-2 rounded-full transition-all cursor-pointer ${
      currentSlide === idx ? "w-8 bg-[#E53935]" : "w-2 bg-slate-200 hover:bg-slate-300"
    }`;
    dot.addEventListener("click", () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  currentSlide = index;
  slideBadge.textContent = slides[currentSlide].badge;
  slideDesc.textContent = slides[currentSlide].description;
  renderDots();
}

prevBtn.addEventListener("click", () => {
  const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  goToSlide(newIndex);
});

nextBtn.addEventListener("click", () => {
  const newIndex = (currentSlide + 1) % slides.length;
  goToSlide(newIndex);
});

// Auto Slide every 5.5 seconds
setInterval(() => {
  const newIndex = (currentSlide + 1) % slides.length;
  goToSlide(newIndex);
}, 5500);

renderDots();

// --- 2. CALCULATOR & FX RATE LOGIC ---
// Available Currencies List
const currencies = [
  { code: 'USD', label: '🇺🇸 USD', rateToBase: 1 },
  { code: 'EUR', label: '🇪🇺 EUR', rateToBase: 1.08 },
  { code: 'GBP', label: '🇬🇧 GBP', rateToBase: 1.26 },
  { code: 'BDT', label: '🇧🇩 BDT', rateToBase: 0.0085 },
  { code: 'INR', label: '🇮🇳 INR', rateToBase: 0.012 },
  { code: 'PKR', label: '🇵🇰 PKR', rateToBase: 0.0036 }
];

let selectedSend = currencies[0];     // USD
let selectedReceive = currencies[3];  // BDT

const sendAmountInput = document.getElementById("send-amount");
const receiveAmountInput = document.getElementById("receive-amount");
const rateText = document.getElementById("rate-text");
const totalText = document.getElementById("total-text");
const swapBtn = document.getElementById("swap-btn");
const refreshBtn = document.getElementById("refresh-btn");
const refreshIcon = document.getElementById("refresh-icon");

// --- Searchable Dropdown Generator ---
function setupSearchableDropdown(type) {
  const btn = document.getElementById(`${type}-select-btn`);
  const menu = document.getElementById(`${type}-menu`);
  const searchInput = document.getElementById(`${type}-search`);
  const optionsContainer = document.getElementById(`${type}-options`);
  const selectedLabel = document.getElementById(`${type}-selected-label`);

  function renderOptions(filter = "") {
    optionsContainer.innerHTML = "";
    const filtered = currencies.filter(c => 
      c.code.toLowerCase().includes(filter.toLowerCase()) || 
      c.label.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(curr => {
      const opt = document.createElement("div");
      opt.className = "px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between";
      opt.innerHTML = `<span>${curr.label}</span> <span class="text-slate-400 text-[10px]">${curr.code}</span>`;
      
      opt.addEventListener("click", () => {
        if (type === "send") selectedSend = curr;
        else selectedReceive = curr;

        selectedLabel.textContent = curr.label;
        menu.classList.add("hidden");
        calculateTransfer();
      });

      optionsContainer.appendChild(opt);
    });
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("hidden");
    if (!menu.classList.contains("hidden")) {
      searchInput.value = "";
      renderOptions();
      searchInput.focus();
    }
  });

  searchInput.addEventListener("input", (e) => renderOptions(e.target.value));

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });
}

setupSearchableDropdown("send");
setupSearchableDropdown("receive");

// --- Exchange Rate Calculator ---
function calculateTransfer() {
  const amount = parseFloat(sendAmountInput.value) || 0;
  
  // Calculate relative exchange rate (Send / Receive)
  const currentRate = (selectedSend.rateToBase / selectedReceive.rateToBase).toFixed(2);
  const totalReceived = (amount * currentRate).toFixed(2);

  receiveAmountInput.value = totalReceived;
  rateText.textContent = `1 ${selectedSend.code} = ${currentRate} ${selectedReceive.code}`;
  totalText.textContent = `${amount} ${selectedSend.code}`;
}

// Input Listeners
sendAmountInput.addEventListener("input", calculateTransfer);

// --- Swap Button Logic ---
swapBtn.addEventListener("click", () => {
  // Swap Values
  const temp = selectedSend;
  selectedSend = selectedReceive;
  selectedReceive = temp;

  // Update Labels
  document.getElementById("send-selected-label").textContent = selectedSend.label;
  document.getElementById("receive-selected-label").textContent = selectedReceive.label;

  calculateTransfer();
});

// Refresh Rates Animation
refreshBtn.addEventListener("click", () => {
  refreshIcon.classList.add("animate-spin");
  setTimeout(() => {
    refreshIcon.classList.remove("animate-spin");
    calculateTransfer();
  }, 800);
});

// Initial Run
calculateTransfer();