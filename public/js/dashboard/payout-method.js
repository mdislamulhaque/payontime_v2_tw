// Payout form selection and conditional payment fields.
      function switchPaymentMethod(method) {
        const formCard = document.getElementById("payment-card-form");
        const formBank = document.getElementById("payment-bank-form");
        const formOther = document.getElementById("payment-other-form");
        const otherLabel = document.getElementById("payment-other-label");
        const cardInputs = formCard.querySelectorAll("input");
        formOther.classList.add("hidden");
        if (method === "card") {
          formCard.classList.remove("hidden");
          formBank.classList.add("hidden");
          cardInputs.forEach((input) => input.setAttribute("required", "required"));
        } else if (method === "bank") {
          formBank.classList.remove("hidden");
          formCard.classList.add("hidden");
          cardInputs.forEach((input) => input.removeAttribute("required"));
        } else if (method === "cash" || method === "swish") {
          formCard.classList.add("hidden");
          formBank.classList.add("hidden");
          cardInputs.forEach((input) => input.removeAttribute("required"));
          otherLabel.textContent = `${method === "cash" ? "Cash" : "Swish"} payout selected.`;
          formOther.classList.remove("hidden");
        }
        if (typeof updateTplusRecipientFields === "function") updateTplusRecipientFields();
      }

      function handlePaymentSubmit(event) {
        event.preventDefault();
        // Action to handle submit and jump to Step 6
        if (typeof goToStep === "function") {
          goToStep(6);
        }
      }
    