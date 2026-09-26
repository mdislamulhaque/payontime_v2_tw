// Recipient add/edit form and country flag preview.
      function updateRecipientCountryFlag(countryCode) {
        const flag = document.getElementById("recipient-country-flag");
        flag.classList.toggle("hidden", !countryCode);
        if (!countryCode) return;
        flag.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
        flag.alt = `${countryCode} flag`;
      }

      function openAddRecipientModal() {
        document
          .getElementById("add-recipient-modal")
          .classList.remove("hidden");
      }

      function closeAddRecipientModal() {
        document.getElementById("add-recipient-modal").classList.add("hidden");
      }

      function handleSaveRecipient(event) {
        event.preventDefault();
        const countryNames = { ET: "Ethiopia", BD: "Bangladesh", IN: "India", PH: "Philippines" };
        const fullName = [
          document.getElementById("quick-recipient-first-name").value.trim(),
          document.getElementById("quick-recipient-last-name").value.trim(),
        ].filter(Boolean).join(" ");
        const phone = document.getElementById("quick-recipient-phone").value.trim();
        const country = countryNames[document.getElementById("recipient-modal-country").value];
        const bankName = document.getElementById("quick-recipient-bank-name").value.trim();
        const bankAccountNumber = document.getElementById("quick-recipient-bank-account").value.trim();
        const tplusWalletNumber = document.getElementById("quick-recipient-wallet-number").value.trim();
        const cityName = document.getElementById("quick-recipient-city").value.trim();
        const id = `rec_${Date.now()}`;
        recipientsData[id] = {
          name: fullName,
          country,
          phone,
          bankName,
          bankAccountNumber,
          tplusWalletNumber,
          cityName,
          deliveryMethod: tplusWalletNumber ? "T-plus Wallet" : bankAccountNumber ? "Bank" : "Cash Pickup",
          payoutDetails: tplusWalletNumber ? `T-plus wallet: ${tplusWalletNumber}` : bankAccountNumber ? `Bank account: ${bankAccountNumber}` : "Cash pickup",
        };
        const recipientSelect = document.getElementById("recipient-select");
        recipientSelect.add(new Option(`${fullName} | ${phone}`, id));
        recipientSelect.value = id;
        closeAddRecipientModal();
        document.getElementById("add-recipient-form").reset();
        updateRecipientCountryFlag("");
        renderRecipientCard();
      }
