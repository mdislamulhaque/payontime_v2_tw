// 1. Data Array
    const locations = [
      {
        country: 'Bangladesh',
        code: 'BD',
        flag: '🇧🇩',
        region: 'asia',
        payoutMethods: ['bKash (Instant)', 'Nagad (Instant)', 'Bank Transfer', 'Cash Pickup'],
        agents: '25,000+ Agents',
      },
      {
        country: 'Eritrea',
        code: 'ER',
        flag: '🇪🇷',
        region: 'africa',
        payoutMethods: ['Cash Pickup (Commercial Bank)', 'Direct Bank Transfer'],
        agents: '1,200+ Counters',
      },
      {
        country: 'Kenya',
        code: 'KE',
        flag: '🇰🇪',
        region: 'africa',
        payoutMethods: ['M-Pesa Mobile Wallet', 'Bank Transfer', 'Equity Cash Pickup'],
        agents: '45,000+ Agents',
      },
      {
        country: 'Ethiopia',
        code: 'ET',
        flag: '🇪🇹',
        region: 'africa',
        payoutMethods: ['CBE Birr Wallet', 'Telebirr', 'Commercial Bank of Ethiopia'],
        agents: '15,000+ Branches',
      },
      {
        country: 'Sweden & EU',
        code: 'SE',
        flag: '🇸🇪',
        region: 'europe',
        payoutMethods: ['Bank Direct', 'SEPA Transfer', 'Card Payout'],
        agents: 'Digital Instant',
      },
      {
        country: 'India',
        code: 'IN',
        flag: '🇮🇳',
        region: 'asia',
        payoutMethods: ['UPI Payment', 'IMPS Bank Transfer', 'Cash Pickup'],
        agents: '60,000+ Locations',
      },
    ];

    let currentRegion = 'all';
    const gridContainer = document.getElementById('locations-grid');
    const regionButtons = document.querySelectorAll('.region-btn');

    // 2. Render Location Cards Function
    function renderLocations() {
      const filteredLocations = locations.filter(
        loc => currentRegion === 'all' || loc.region === currentRegion
      );

      gridContainer.innerHTML = filteredLocations.map(loc => `
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2.5">
              <span class="text-3xl">${loc.flag}</span>
              <div>
                <h3 class="text-base font-extrabold text-slate-900">${loc.country}</h3>
                <span class="text-[11px] text-slate-500 font-medium">${loc.agents}</span>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Corridor
            </span>
          </div>

          <div class="space-y-1.5 pt-2 border-t border-slate-100">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Supported Delivery Channels
            </span>
            ${loc.payoutMethods.map(pm => `
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-[#E53935]"></i>
                <span>${pm}</span>
              </div>
            `).join('')}
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              onclick="handleSendMoney('${loc.country}')"
              className="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
              class="text-xs font-bold text-[#E53935] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Send to ${loc.country}</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('');

      // Re-initialize Lucide Icons after DOM update
      lucide.createIcons();
    }

    // 3. Tab Filtering Event Listeners
    regionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        currentRegion = btn.getAttribute('data-region');

        // Update active tab styles
        regionButtons.forEach(b => {
          if (b.getAttribute('data-region') === currentRegion) {
            b.className = 'region-btn px-4 py-2 rounded-xl capitalize transition-all bg-white text-slate-900 shadow-sm font-extrabold cursor-pointer';
          } else {
            b.className = 'region-btn px-4 py-2 rounded-xl capitalize transition-all hover:text-slate-900 cursor-pointer';
          }
        });

        // Re-render filtered items
        renderLocations();
      });
    });

    // 4. Send Money Click Action Handler
    function handleSendMoney(country) {
      alert(`Navigating to Transfer page for ${country}...`);
    }

    // Initial Render
    renderLocations();