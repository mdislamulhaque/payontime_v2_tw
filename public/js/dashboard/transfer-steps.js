// Multi-step transfer form state and step navigation.
      // State Data
      let currentStep = 1;
      let selectedPurpose = "";

      const stepsList = [
        { number: 1, label: "Transfer" },
        { number: 2, label: "Recipient" },
        { number: 3, label: "Review" },
        { number: 4, label: "Pay" },
      ];

      const recipientsData = {
        rec_1: {
          name: "Amanuel Tesfay",
          country: "Ethiopia",
          phone: "+251 91 234 5678",
          deliveryMethod: "Cash Pickup",
          payoutDetails: "Cash pickup at partner location",
          bankName: "",
          bankAccountNumber: "",
          tplusWalletNumber: "",
          cityName: "Addis Ababa",
        },
        rec_2: {
          name: "Rahim Ahmed",
          country: "Bangladesh",
          phone: "+880 17 0000 0000",
          deliveryMethod: "bKash / Nagad Wallet",
          payoutDetails: "Mobile wallet payout",
          bankName: "",
          bankAccountNumber: "",
          tplusWalletNumber: "+880 17 0000 0000",
          cityName: "Dhaka",
        },
        rec_3: {
          name: "MAXAMED CALI JAAMAC",
          country: "Somalia",
          phone: "252619333207",
          deliveryMethod: "Bank",
          payoutDetails: "Bank account: 31052160",
          bankAccountNumber: "31052160",
          bankName: "Dahabshiil Bank",
          tplusWalletNumber: "",
          cityName: "Mogadishu",
        },
      };

      const countryFlags = {
        Sweden: "se", "Sweden & EU": "se", Somalia: "so", Kenya: "ke",
        Ethiopia: "et", Bangladesh: "bd", India: "in", Pakistan: "pk",
        "United States": "us", "United Kingdom": "gb", Eurozone: "eu",
        Eritrea: "er", Philippines: "ph", Singapore: "sg", Switzerland: "ch",
      };

      function countryFlagMarkup(country, altText = country) {
        const code = countryFlags[country];
        return code ? `<img src="https://flagcdn.com/w40/${code}.png" alt="${altText} flag" class="inline-block w-8 h-auto rounded-sm align-middle mr-1.5" loading="lazy">` : "";
      }

      function updateFormCountryFlag(country) {
        const image = document.getElementById("form-country-flag");
        const name = Object.keys(countryFlags).find((candidate) => candidate.toLowerCase() === country.trim().toLowerCase());
        image.classList.toggle("hidden", !name);
        if (name) {
          image.src = `https://flagcdn.com/w40/${countryFlags[name]}.png`;
          image.alt = `${name} flag`;
        }
      }

      document.getElementById("form-country").addEventListener("input", (event) => updateFormCountryFlag(event.target.value));

      Object.entries(recipientsData).forEach(([recipientId, recipient]) => {
        const option = document.querySelector(`#recipient-select option[value="${recipientId}"]`);
        if (option) option.textContent = `${recipient.name} | ${recipient.phone}`;
      });

      const purposes = [
        "Family Support",
        "Medical Expenses",
        "Education Fees",
        "Savings & Investment",
        "Business Payment",
      ];

      // Initialize Stepper Bar
      function renderStepper() {
        const stepperEl = document.getElementById("stepper-bar");
        stepperEl.innerHTML = "";

        stepsList.forEach((step, idx) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          const circleBg = isCompleted
            ? "bg-emerald-500 text-white"
            : isActive
              ? "bg-[#36b647] text-white scale-105 shadow-lg shadow-green-500/30"
              : "bg-slate-100 text-slate-400";

          const stepHTML = `
          <div class="flex flex-col items-center gap-1">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all ${circleBg}">
              ${isCompleted ? "✓" : step.number}
            </div>
            <span class="text-[10px] font-bold hidden md:inline ${isActive ? "text-slate-900" : "text-slate-400"}">${step.label}</span>
          </div>
        `;

          stepperEl.insertAdjacentHTML("beforeend", stepHTML);

          if (idx < stepsList.length - 1) {
            const lineBg =
              currentStep > step.number ? "bg-emerald-500" : "bg-slate-100";
            stepperEl.insertAdjacentHTML(
              "beforeend",
              `<div class="flex-1 h-1 mx-1 rounded-full ${lineBg}"></div>`,
            );
          }
        });
      }

      // Navigation Switcher
      function goToStep(stepNum) {
        if (stepNum === 2 && (!selectedSend || !selectedReceive || (parseFloat(sendAmountInput.value) || 0) <= 0)) {
          alert("Choose both countries and enter an amount first.");
          return;
        }
        if (stepNum === 3 && (!document.getElementById("recipient-select").value || !selectedPurpose || !document.getElementById("payment-method-select").value || (deliveryMethod.value === "tplus" && !document.getElementById("tplus-city").value) || (deliveryMethod.value === "bank-deposit" && !document.getElementById("recipient-bank-account").value.trim()))) {
          alert(deliveryMethod.value === "tplus" ? "Choose a recipient, city, transfer purpose, and payout method to continue." : "Choose a recipient, transfer purpose, and payout method to continue.");
          return;
        }
        if (stepNum === 4 && !document.getElementById("terms-agree").checked) {
          alert("Please accept Terms & Conditions before proceeding.");
          return;
        }

        currentStep = Math.min(stepNum, 4);
        if (stepNum === 3) updateReviewSummary();

        // Hide all steps
        document
          .querySelectorAll(".step-container")
          .forEach((el) => el.classList.add("hidden"));

        // Show targeted step
        const targetStep = document.getElementById(`step-${stepNum}`);
        if (targetStep) targetStep.classList.remove("hidden");

        renderStepper();
      }

      function updateStepButtonStates() {
        const amount = Number.parseFloat(sendAmountInput.value) || 0;
        const transferReady = Boolean(selectedSend && selectedReceive && amount > 0);
        const recipientId = document.getElementById("recipient-select").value;
        const purposeReady = Boolean(selectedPurpose || document.getElementById("purpose-select").value);
        const payoutMethod = document.getElementById("payment-method-select").value;
        const deliveryReady = deliveryMethod.value !== "tplus" || !recipientId || Boolean(document.getElementById("tplus-city").value);
        const bankReady = deliveryMethod.value !== "bank-deposit" || !recipientId || Boolean(document.getElementById("recipient-bank-account").value.trim());
        const recipientReady = Boolean(recipientId && purposeReady && payoutMethod && deliveryReady && bankReady);
        const termsReady = document.getElementById("terms-agree").checked;
        const paymentForm = document.querySelector("#step-4 form");

        document.querySelector('#step-1 button[onclick="goToStep(2)"]').disabled = !transferReady;
        document.querySelector('#step-2 button[onclick="goToStep(3)"]').disabled = !recipientReady;
        document.querySelector('#step-3 button[onclick="goToStep(4)"]').disabled = !termsReady;
        document.querySelector("#step-4 form button[type=submit]").disabled = !(payoutMethod && paymentForm.checkValidity());
      }

      document.addEventListener("input", updateStepButtonStates);
      document.addEventListener("change", updateStepButtonStates);


      function updateReviewSummary() {
        const recipient = recipientsData[document.getElementById("recipient-select").value];
        if (!recipient || !selectedSend || !selectedReceive) return;
        document.getElementById("review-send-amount").textContent = amountText.textContent;
        document.getElementById("review-receive-amount").textContent = recipientReceivesText.textContent;
        document.getElementById("review-exchange-rate").textContent = rateText.textContent;
        document.getElementById("review-fee").textContent = feeText.textContent;
        document.getElementById("review-total-payable").textContent = totalText.textContent;
        document.getElementById("review-rec-name").textContent = recipient.name;
        document.getElementById("review-rec-country").innerHTML = `${countryFlagMarkup(recipient.country)} ${recipient.country}`;
        document.getElementById("review-rec-phone").textContent = recipient.phone;
        document.getElementById("review-rec-payout").textContent = recipient.payoutDetails;
        document.getElementById("review-rec-delivery").textContent = recipient.deliveryMethod;
        document.getElementById("review-rec-purpose").textContent = selectedPurpose;
        document.getElementById("review-payment-method").textContent = document.getElementById("payment-method-select").selectedOptions[0].text;
      }

      // Step 2 Recipient Display
      function renderRecipientCard() {
        const val = document.getElementById("recipient-select").value;
        const card = document.getElementById("recipient-card-display");
        const emptyState = document.getElementById("recipient-card-empty");
        const selectedRecipient = recipientsData[val];

        if (val && selectedRecipient) {
          card.classList.remove("hidden");
          emptyState.classList.add("hidden");
          const recipientSelectFlag = document.getElementById("recipient-select-flag");
          const recipientFlagCode = countryFlags[selectedRecipient.country];
          recipientSelectFlag.classList.toggle("hidden", !recipientFlagCode);
          if (recipientFlagCode) {
            recipientSelectFlag.src = `https://flagcdn.com/w40/${recipientFlagCode}.png`;
            recipientSelectFlag.alt = `${selectedRecipient.country} flag`;
          }
          const recipientCurrency = currencies.find((currency) => currency.country === selectedRecipient.country);
          if (recipientCurrency) {
            selectedReceive = recipientCurrency;
            configureDeliveryMethods(recipientCurrency.country, deliveryMethod.value);
            document.getElementById("receive-selected-label").innerHTML = `${countryFlagMarkup(recipientCurrency.country)} ${recipientCurrency.country} ${recipientCurrency.code}`;
            calculateTransfer();
          }
          document.getElementById("rec-name").innerText = selectedRecipient.name;
          document.getElementById("rec-info").innerHTML =
            `${countryFlagMarkup(selectedRecipient.country)} ${selectedRecipient.country} | ${selectedRecipient.phone}`;
          document.getElementById("rec-details").innerHTML = `
            <div class="space-y-2 text-start">
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">Full name</span><span class="font-semibold text-slate-900">${selectedRecipient.name}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">Country</span><span class="font-semibold text-slate-900">${countryFlagMarkup(selectedRecipient.country)} ${selectedRecipient.country}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">Phone</span><span class="font-semibold text-slate-900">${selectedRecipient.phone}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">Bank name</span><span class="font-semibold text-slate-900">${selectedRecipient.bankName || "—"}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">Bank account</span><span class="font-semibold text-slate-900">${selectedRecipient.bankAccountNumber || "—"}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">T-plus wallet</span><span class="font-semibold text-slate-900">${selectedRecipient.tplusWalletNumber || "—"}</span></div>
              <div class="grid grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)] gap-3 items-start"><span class="font-bold text-slate-500">City</span><span class="font-semibold text-slate-900">${selectedRecipient.cityName || "—"}</span></div>
            </div>`;
          if (deliveryMethod.value === "tplus" || deliveryMethod.value === "bank-deposit") {
            document.getElementById("tplus-recipient-phone").value = selectedRecipient.phone;
            document.getElementById("tplus-recipient-status").classList.add("hidden");
          }
          if (deliveryMethod.value === "bank-deposit") {
            document.getElementById("recipient-bank-account").value = selectedRecipient.bankAccountNumber || "";
          }
          updateTplusCityOptions(selectedRecipient.country, selectedRecipient.cityName);

        } else {
          card.classList.add("hidden");
          document.getElementById("recipient-select-flag").classList.add("hidden");
          if (typeof selectedReceive !== "undefined") {
            selectedReceive = null;
            calculateTransfer();
          }
          document.getElementById("tplus-city").value = "";
        }
        updateTplusRecipientFields();
      }

      function updateTplusRecipientFields() {
        const tplus = deliveryMethod.value === "tplus";
        const bankDeposit = deliveryMethod.value === "bank-deposit";
        const recipientLookupMode = tplus || bankDeposit;
        const recipientSelected = Boolean(document.getElementById("recipient-select").value);
        const selectedRecipient = recipientsData[document.getElementById("recipient-select").value];
        document.getElementById("recipient-add-button").classList.toggle("hidden", recipientLookupMode);
        document.getElementById("tplus-recipient-lookup").classList.toggle("hidden", !recipientLookupMode);
        document.getElementById("recipient-card-empty").classList.toggle("hidden", recipientLookupMode || recipientSelected);
        document.getElementById("tplus-city-wrapper").classList.toggle("hidden", !tplus || !recipientSelected);
        document.getElementById("tplus-city").required = tplus && recipientSelected;
        document.getElementById("bank-account-field").classList.toggle("hidden", !bankDeposit);
        document.getElementById("recipient-bank-account").required = bankDeposit;
        if (recipientLookupMode && selectedRecipient) {
          document.getElementById("tplus-recipient-phone").value = selectedRecipient.phone;
        }
        if (bankDeposit && selectedRecipient?.bankAccountNumber && !document.getElementById("recipient-bank-account").value) {
          document.getElementById("recipient-bank-account").value = selectedRecipient.bankAccountNumber;
        }
      }

      function updateTplusCityOptions(country, preferredCity = "") {
        const citySelect = document.getElementById("tplus-city");
        const citiesByCountry = {
          Ethiopia: ["Addis Ababa", "Dire Dawa", "Hawassa", "Mekelle"],
          Bangladesh: ["Dhaka", "Chattogram", "Khulna", "Sylhet"],
          Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"],
          Somalia: ["Mogadishu", "Hargeisa", "Kismayo", "Bosaso"],
          India: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
          Philippines: ["Manila", "Cebu City", "Davao City"],
        };
        const cities = [...new Set([...(citiesByCountry[country] || []), preferredCity].filter(Boolean))];
        citySelect.innerHTML = '<option value="" disabled selected>City</option>' + cities.map((city) => `<option value="${city}">${city}</option>`).join("");
        if (preferredCity) citySelect.value = preferredCity;
      }

      function findRecipientByNumber(value, field) {
        const enteredNumber = value.replace(/\D/g, "");
        if (!enteredNumber) return null;
        return Object.entries(recipientsData).find(([, recipient]) => {
          const savedNumber = field === "phone" ? recipient.phone : recipient.bankAccountNumber;
          return savedNumber && savedNumber.replace(/\D/g, "") === enteredNumber;
        }) || null;
      }

      function selectRecipientFromNumber(value, field) {
        const status = document.getElementById("tplus-recipient-status");
        const match = findRecipientByNumber(value, field);
        const recipientSelect = document.getElementById("recipient-select");
        if (match) {
          recipientSelect.value = match[0];
          status.textContent = "Saved recipient selected.";
          status.classList.remove("hidden", "text-amber-600");
          status.classList.add("text-emerald-600");
          renderRecipientCard();
        } else {
          if (recipientSelect.value) {
            recipientSelect.value = "";
            renderRecipientCard();
          }
          if (field === "phone") document.getElementById("recipient-bank-account").value = "";
          else document.getElementById("tplus-recipient-phone").value = "";
          const enteredNumber = value.replace(/\D/g, "");
          status.classList.toggle("hidden", !enteredNumber);
          status.classList.remove("text-emerald-600");
          status.classList.add("text-amber-600");
          status.textContent = enteredNumber ? "No saved recipient matches this number." : "";
        }
      }

      document.getElementById("tplus-recipient-phone").addEventListener("input", (event) => {
        selectRecipientFromNumber(event.target.value, "phone");
      });
      document.getElementById("recipient-bank-account").addEventListener("input", (event) => {
        selectRecipientFromNumber(event.target.value, "account");
      });

      // Step 3 Purpose Renderer
      function renderPurposes() {
        const purposeSelect = document.getElementById("purpose-select");
        purposeSelect.innerHTML = '<option value="" disabled>Select transfer purpose</option>' + purposes.map((purpose) => '<option value="' + purpose + '">' + purpose + '</option>').join("");
        purposeSelect.value = selectedPurpose;
        purposeSelect.addEventListener("change", () => { selectedPurpose = purposeSelect.value; updateStepButtonStates(); });
      }

      // Payment method selection is made in Recipient and controls the Pay form.
      // Step 5 Submit Handler
      function handlePaymentSubmit(e) {
        e.preventDefault();
        goToStep(6);
      }

      // Step 6 OTP Verification
      function verifyOTP() {
        const otp = document.getElementById("otp-input").value;
        if (otp.length < 6) {
          alert("Please enter valid 6 digit OTP.");
          return;
        }
        const btn = document.getElementById("verify-btn");
        btn.innerText = "Verifying...";
        btn.disabled = true;

        setTimeout(() => {
          btn.innerText = "Verify & Complete Payment";
          btn.disabled = false;
          document.getElementById("receipt-id").innerText =
            "HID-" + Math.floor(100000 + Math.random() * 900000);
          goToStep(7);
        }, 1200);
      }

      // On Load Initializers
      renderStepper();
      renderPurposes();
