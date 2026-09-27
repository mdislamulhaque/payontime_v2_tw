// KYC questionnaire validation and local draft persistence.
const kycForm = document.getElementById("kyc-questionnaire-form");
const kycSubmitButton = document.getElementById("kyc-questionnaire-submit");
const kycStatus = document.getElementById("kyc-questionnaire-status");
const kycStorageKey = "payontime-kyc-questionnaire";
const kycFields = Array.from(kycForm.querySelectorAll("select"));

function updateKycSubmitState() {
  kycSubmitButton.disabled = !kycForm.checkValidity();
}

try {
  const savedAnswers = JSON.parse(localStorage.getItem(kycStorageKey) || "null");
  if (savedAnswers) {
    kycFields.forEach((field) => {
      if (typeof savedAnswers[field.id] === "string") field.value = savedAnswers[field.id];
    });
    kycStatus.textContent = "Your saved answers have been restored.";
  }
} catch (error) {
  // The questionnaire remains usable if browser storage is unavailable.
}

kycForm.addEventListener("input", updateKycSubmitState);
kycForm.addEventListener("change", updateKycSubmitState);
kycForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!kycForm.reportValidity()) return;
  const answers = Object.fromEntries(kycFields.map((field) => [field.id, field.value]));
  try { localStorage.setItem(kycStorageKey, JSON.stringify(answers)); } catch (error) {
    // Report the completed form even when saving locally is unavailable.
  }
  kycStatus.textContent = "Your KYC questionnaire has been submitted.";
});

updateKycSubmitState();
