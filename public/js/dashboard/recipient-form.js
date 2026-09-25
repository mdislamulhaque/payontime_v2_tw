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
        // Save logic here...
        closeAddRecipientModal();
      }
    