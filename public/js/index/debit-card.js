// Debit card visibility, freeze, and order interactions.
// Elements & State Variables
    let showCardNumber = false;
    let isFrozen = false;

    const cardNumberEl = document.getElementById('card-number');
    const toggleCardNumberBtn = document.getElementById('toggle-card-number-btn');
    const eyeIconEl = document.getElementById('eye-icon');
    
    const cardGraphicEl = document.getElementById('debit-card-graphic');
    const freezeCardBtn = document.getElementById('freeze-card-btn');
    const orderCardBtn = document.getElementById('order-card-btn');

    // 1. Toggle Card Number Visibility
    toggleCardNumberBtn.addEventListener('click', () => {
      showCardNumber = !showCardNumber;
      cardNumberEl.textContent = showCardNumber ? '4242 â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 8812' : 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 8812';
      
      // Update Lucide Icon dynamically
      eyeIconEl.setAttribute('data-lucide', showCardNumber ? 'eye-off' : 'eye');
      lucide.createIcons();
    });

    // 2. Freeze / Unfreeze Card Functionality
    freezeCardBtn.addEventListener('click', () => {
      isFrozen = !isFrozen;

      if (isFrozen) {
        // Frozen State Styling
        cardGraphicEl.className = 'w-full max-w-sm h-56 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-2 border-dashed border-sky-400/50 opacity-80';
        freezeCardBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-sky-500 text-white border-sky-400 shadow-sm cursor-pointer';
      freezeCardBtn.textContent = '❄️ Card Frozen (Click to Unfreeze)';
      } else {
        // Active State Styling
        cardGraphicEl.className = 'w-full max-w-sm h-56 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 bg-gradient-to-br from-slate-950 via-slate-900 to-[#D32F2F] border border-slate-700/80 shadow-green-50 0/20';
        freezeCardBtn.className = 'px-4 py-2 rounded-xl text-xs font-bold transition-all border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm cursor-pointer';
        freezeCardBtn.textContent = 'Freeze Card';
      }
    });

    // 3. Order Card Button Handler
    orderCardBtn.addEventListener('click', () => {
      alert('Your virtual Pay On Time Card request has been initiated!');
    });
    