// Currencies, exchange calculation, and delivery fees.

      // Initialize Icons
      lucide.createIcons();
      
     
      
 // Available Currencies List
      const currencies = [
        { country: "Sweden", code: "SEK", label: "Sweden - SEK", rateToBase: 0.096 },
        { country: "United States", code: "USD", label: "United States - USD", rateToBase: 1 },
        { country: "Bangladesh", code: "BDT", label: "Bangladesh - BDT", rateToBase: 0.0085 },
        { country: "India", code: "INR", label: "India - INR", rateToBase: 0.012 },
        { country: "Pakistan", code: "PKR", label: "Pakistan - PKR", rateToBase: 0.0036 },
        { country: "United Kingdom", code: "GBP", label: "United Kingdom - GBP", rateToBase: 1.26 },
        { country: "Eurozone", code: "EUR", label: "Eurozone - EUR", rateToBase: 1.08 },
        { country: "Kenya", code: "KES", label: "Kenya - KES", rateToBase: 0.0077 },
        { country: "Ethiopia", code: "ETB", label: "Ethiopia - ETB", rateToBase: 0.0069 },
        { country: "Eritrea", code: "ERN", label: "Eritrea - ERN", rateToBase: 0.056 },
        { country: "Somalia", code: "SOS", label: "Somalia - SOS", rateToBase: 0.00175 },
      ];

      let selectedSend = currencies[0];
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
      const inlineRate = document.getElementById("inline-rate");
      const refreshBtn = document.getElementById("refresh-btn");
      const refreshIcon = document.getElementById("refresh-icon");

      function setupSearchableDropdown(type) {
        const btn = document.getElementById(`${type}-select-btn`);
        const menu = document.getElementById(`${type}-menu`);
        const searchInput = document.getElementById(`${type}-search`);
        const optionsContainer = document.getElementById(`${type}-options`);
        const selectedLabel = document.getElementById(`${type}-selected-label`);

        function renderOptions(filter = "") {
          optionsContainer.innerHTML = "";
          const query = filter.toLowerCase();
          (type === "send" ? [currencies[0]] : currencies.filter((c) => ["Kenya", "Somalia"].includes(c.country)))
            .filter((c) => c.country.toLowerCase().includes(query) || c.code.toLowerCase().includes(query))
            .forEach((curr) => {
              const option = document.createElement("div");
              option.className = "px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-100 cursor-pointer flex items-center justify-between";
              option.innerHTML = `<span class="inline-flex items-center gap-2">${countryFlagMarkup(curr.country)} ${curr.country}</span><span class="text-slate-400 text-[10px]">${curr.code}</span>`;
              option.addEventListener("click", () => {
                if (type === "receive") selectedReceive = curr;
                selectedLabel.innerHTML = `${countryFlagMarkup(curr.country)} ${curr.country} · ${type === "receive" ? "USD" : curr.code}`;
                menu.classList.add("hidden");
                calculateTransfer();
              });
              optionsContainer.appendChild(option);
            });
        }

        btn.addEventListener("click", (event) => {
          event.stopPropagation();
          menu.classList.toggle("hidden");
          if (!menu.classList.contains("hidden")) {
            searchInput.value = "";
            renderOptions();
            searchInput.focus();
          }
        });
        searchInput.addEventListener("input", (event) => renderOptions(event.target.value));
        document.addEventListener("click", (event) => {
          if (!btn.contains(event.target) && !menu.contains(event.target)) menu.classList.add("hidden");
        });
      }

      setupSearchableDropdown("send");
      setupSearchableDropdown("receive");
      document.getElementById("send-selected-label").innerHTML = `${countryFlagMarkup("Sweden")} Sweden · SEK`;
      document.getElementById("receive-selected-label").textContent = "Select country";

      function calculateTransfer(changedField = "send") {
        let amount = parseFloat(sendAmountInput.value);
        let receiveAmount = parseFloat(receiveAmountInput.value);
        if (changedField === "receive" && Number.isFinite(receiveAmount)) {
          amount = receiveAmount / SEK_TO_USD_RATE;
          sendAmountInput.value = amount ? amount.toFixed(2) : "";
        } else if (changedField === "send" && Number.isFinite(amount)) {
          receiveAmount = amount * SEK_TO_USD_RATE;
          receiveAmountInput.value = receiveAmount ? receiveAmount.toFixed(2) : "";
        } else if (!Number.isFinite(amount)) {
          amount = 0;
          receiveAmount = 0;
          receiveAmountInput.value = "";
        }
        const ready = Boolean(selectedSend && selectedReceive && amount > 0);
        transactionInfo.classList.toggle("hidden", !ready);
        if (!selectedSend || !selectedReceive) {
          amountText.textContent = `${amount > 0 ? amount.toFixed(2) : "0.00"} SEK`;
          rateText.textContent = "1 SEK = 0.096 USD";
          inlineRate.textContent = "1 SEK = 0.096 USD";
          feeText.textContent = "-";
          totalText.textContent = "-";
          recipientReceivesText.textContent = "-";
          if (typeof updateStepButtonStates === "function") updateStepButtonStates();
          return;
        }
        const feesByMethod = { "tplus": 0, "mobile-money": 10, "bank-deposit": 15, "cash-pickup": 20 };
        const fee = feesByMethod[deliveryMethod.value] ?? 0;
        const exchangeRateText = `1 SEK = ${SEK_TO_USD_RATE.toFixed(3)} USD`;
        rateText.textContent = exchangeRateText;
        inlineRate.textContent = exchangeRateText;
        amountText.textContent = `${amount.toFixed(2)} ${selectedSend.code}`;
        feeText.textContent = `${fee.toFixed(2)} ${selectedSend.code}`;
        totalText.textContent = `${(amount + fee).toFixed(2)} ${selectedSend.code}`;
        recipientReceivesText.textContent = `${receiveAmount.toFixed(2)} USD`;
        const paymentTotal = document.getElementById("payment-total-amount");
        const payButtonText = document.getElementById("btn-pay-text");
        if (paymentTotal) paymentTotal.textContent = totalText.textContent;
        if (payButtonText) payButtonText.textContent = `Pay ${(amount + fee).toFixed(2)} ${selectedSend.code}`;
        if (typeof updateStepButtonStates === "function") updateStepButtonStates();
      }

      function restoreLandingTransfer() {
        let transferDraft;
        try {
          const savedDraft = sessionStorage.getItem("payontime:index-transfer");
          sessionStorage.removeItem("payontime:index-transfer");
          if (!savedDraft) return;
          transferDraft = JSON.parse(savedDraft);
        } catch (error) {
          return;
        }

        const receiveCurrency = currencies.find((currency) => currency.country === transferDraft.receiveCountry);
        if (receiveCurrency) {
          selectedReceive = receiveCurrency;
          document.getElementById("receive-selected-label").innerHTML = `${countryFlagMarkup(receiveCurrency.country)} ${receiveCurrency.country} Â· USD`;
        }

        const restoreAmount = (input, value) => {
          if (typeof value !== "string" || !value.trim()) return;
          const amount = Number(value);
          if (Number.isFinite(amount) && amount >= 0) input.value = value;
        };
        restoreAmount(sendAmountInput, transferDraft.sendAmount);
        restoreAmount(receiveAmountInput, transferDraft.receiveAmount);

        const validDeliveryMethods = ["tplus", "mobile-money", "bank-deposit", "cash-pickup"];
        if (validDeliveryMethods.includes(transferDraft.deliveryMethod)) {
          deliveryMethod.value = transferDraft.deliveryMethod;
        }

        calculateTransfer("restore");
      }

      sendAmountInput.addEventListener("input", () => calculateTransfer("send"));
      receiveAmountInput.addEventListener("input", () => calculateTransfer("receive"));
      deliveryMethod.addEventListener("change", () => {
        calculateTransfer();
        const recipientSelect = document.getElementById("recipient-select");
        if (recipientSelect.value) renderRecipientCard();
        else updateTplusRecipientFields();
      });
      refreshBtn.addEventListener("click", () => {
        sendAmountInput.value = "";
        receiveAmountInput.value = "";
        document.getElementById("send-search").value = "";
        document.getElementById("receive-search").value = "";
        document.getElementById("send-menu").classList.add("hidden");
        document.getElementById("receive-menu").classList.add("hidden");
        deliveryMethod.value = "tplus";
        calculateTransfer();
      });

      // Initial Run
      calculateTransfer();
      updateTplusRecipientFields();
      if (typeof updateStepButtonStates === "function") updateStepButtonStates();
    
