// Landing page hero carousel and its controls.
// Initialize Icons
lucide.createIcons();

// --- 1. CAROUSEL SLIDER LOGIC ---
const slides = [
  {
    badge: "âš¡ Instant Express Transfers",
    description: "Transfer directly to bKash, Nagad, Mobile Wallets, and Bank Accounts across East Africa & South Asia with locked-in FX rates."
  },
  {
    badge: "ðŸ’Ž Best Exchange Rates Guaranteed",
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
      currentSlide === idx ? "w-8 bg-green-500" : "w-2 bg-slate-200 hover:bg-slate-300"
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
  { country: 'Sweden', code: 'SEK', label: 'Sweden · SEK', flagCode: 'se' },
  { country: 'Somalia', code: 'SOS', label: 'Somalia · USD', flagCode: 'so' },
  { country: 'Kenya', code: 'KES', label: 'Kenya · USD', flagCode: 'ke' }
];

const selectedSend = currencies[0];
let selectedReceive = null;
const SEK_TO_USD_RATE = 0.096;

const sendAmountInput = document.getElementById("send-amount");
const receiveAmountInput = document.getElementById("receive-amount");
const rateText = document.getElementById("rate-text");
const totalText = document.getElementById("total-text");
const amountText = document.getElementById("amount-text");
const feeText = document.getElementById("fee-text");
const recipientReceivesText = document.getElementById("recipient-receives-text");
const transactionInfo = document.getElementById("transaction-info");
const deliveryMethod = document.getElementById("delivery-method");
const refreshBtn = document.getElementById("refresh-btn");
const refreshIcon = document.getElementById("refresh-icon");
const inlineRate = document.getElementById("inline-rate");

// --- Searchable Dropdown Generator ---
function setupSearchableDropdown(type) {
  const btn = document.getElementById(`${type}-select-btn`);
  const menu = document.getElementById(`${type}-menu`);
  const searchInput = document.getElementById(`${type}-search`);
  const optionsContainer = document.getElementById(`${type}-options`);
  const selectedLabel = document.getElementById(`${type}-selected-label`);

  function renderOptions(filter = "") {
    optionsContainer.innerHTML = "";
    const availableCurrencies = type === "send" ? [currencies[0]] : currencies.slice(1);
    const filtered = availableCurrencies.filter(c =>
      c.country.toLowerCase().includes(filter.toLowerCase()) ||
      c.code.toLowerCase().includes(filter.toLowerCase()) || 
      c.label.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(curr => {
      const opt = document.createElement("div");
      opt.className = "px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between";
      opt.innerHTML = `<span class="inline-flex items-center gap-2">${flagImageMarkup(curr.flagCode, curr.country)} ${curr.country}</span> <span class="text-slate-400 text-[10px]">${curr.code}</span>`;
      
      opt.addEventListener("click", () => {
        if (type === "receive") selectedReceive = curr;

        selectedLabel.innerHTML = `${flagImageMarkup(curr.flagCode, curr.country)} ${curr.label}`;
        menu.classList.add("hidden");
        calculateTransfer("send");
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
function calculateTransfer(changedField = "send") {
  let amount = parseFloat(sendAmountInput.value);
  let received = parseFloat(receiveAmountInput.value);
  if (changedField === "receive" && Number.isFinite(received)) {
    amount = received / SEK_TO_USD_RATE;
    sendAmountInput.value = amount ? amount.toFixed(2) : "";
  } else if (Number.isFinite(amount)) {
    received = amount * SEK_TO_USD_RATE;
    receiveAmountInput.value = received ? received.toFixed(2) : "";
  } else {
    amount = 0;
    received = 0;
    receiveAmountInput.value = "";
  }
  transactionInfo.classList.toggle("hidden", !selectedReceive || amount <= 0);
  if (!selectedReceive) {
    amountText.textContent = `${amount > 0 ? amount.toFixed(2) : "0.00"} SEK`;
    rateText.textContent = "Select a receiving country to see the rate";
    feeText.textContent = "-";
    totalText.textContent = "-";
    recipientReceivesText.textContent = "-";
    return;
  }
  const feesByMethod = {
    "tplus": 0,
    "mobile-money": 10,
    "bank-deposit": 15,
    "cash-pickup": 20
  };
  const fee = feesByMethod[deliveryMethod.value] ?? 0;
  const exchangeRate = `1 SEK = ${SEK_TO_USD_RATE.toFixed(3)} USD`;
  inlineRate.textContent = exchangeRate;
  rateText.textContent = exchangeRate;
  amountText.textContent = `${amount.toFixed(2)} ${selectedSend.code}`;
  feeText.textContent = `${fee.toFixed(0)} ${selectedSend.code}`;
  totalText.textContent = `${(amount + fee).toFixed(2)} ${selectedSend.code}`;
  recipientReceivesText.textContent = `${received.toFixed(2)} USD`;
}

// Input Listeners
sendAmountInput.addEventListener("input", () => calculateTransfer("send"));
receiveAmountInput.addEventListener("input", () => calculateTransfer("receive"));
deliveryMethod.addEventListener("change", calculateTransfer);

// Reset the From country and amount
refreshBtn.addEventListener("click", () => {
  sendAmountInput.value = "";
  receiveAmountInput.value = "";
  calculateTransfer();
});

// Initial Run
calculateTransfer();

// Carry the calculator choices into the dashboard transfer form.
document.getElementById("send-now-btn").addEventListener("click", () => {
  const transferDraft = {
    sendAmount: sendAmountInput.value,
    receiveAmount: receiveAmountInput.value,
    receiveCountry: selectedReceive?.country ?? "",
    deliveryMethod: deliveryMethod.value,
  };

  try {
    sessionStorage.setItem("payontime:index-transfer", JSON.stringify(transferDraft));
  } catch (error) {
    // The dashboard still opens if browser storage is unavailable.
  }

  window.location.href = "/dashboard.html?tab=send";
});
    
