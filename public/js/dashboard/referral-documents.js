// Referral code generation and sharing controls.
const referralCodeInput = document.getElementById("referral-code-value");
const referralGenerateButton = document.getElementById("generate-referral-code");
const referralCopyButton = document.getElementById("copy-referral-code");
const referralShareButton = document.getElementById("share-referral-code");
const referralStatus = document.getElementById("referral-code-status");
const referralStorageKey = "payontime-referral-code";

function setReferralCode(code) {
  referralCodeInput.value = code;
  const hasCode = Boolean(code);
  referralCopyButton.disabled = !hasCode;
  referralShareButton.disabled = !hasCode;
}

function createReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomValues = new Uint8Array(8);
  const cryptoApi = window.crypto;
  if (cryptoApi && typeof cryptoApi.getRandomValues === "function") {
    try {
      cryptoApi.getRandomValues(randomValues);
    } catch (error) {
      randomValues.forEach((_, index) => { randomValues[index] = Math.floor(Math.random() * 256); });
    }
  } else {
    randomValues.forEach((_, index) => { randomValues[index] = Math.floor(Math.random() * 256); });
  }
  return `POT-${Array.from(randomValues, (value) => alphabet[value % alphabet.length]).join("")}`;
}

async function copyReferralCode() {
  const code = referralCodeInput.value;
  if (!code) return false;
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch (error) {
    referralCodeInput.focus();
    referralCodeInput.select();
    return document.execCommand("copy");
  }
}

referralGenerateButton.addEventListener("click", () => {
  try {
    const code = createReferralCode();
    setReferralCode(code);
    referralStatus.textContent = "Your referral code is ready.";
    try { localStorage.setItem(referralStorageKey, code); } catch (error) { /* Keep this code for the current page view. */ }
  } catch (error) {
    referralStatus.textContent = "Could not generate a code. Please try again.";
  }
});

referralCopyButton.addEventListener("click", async () => {
  referralStatus.textContent = await copyReferralCode() ? "Referral code copied." : "Select and copy your referral code.";
});

referralShareButton.addEventListener("click", async () => {
  const code = referralCodeInput.value;
  const shareData = { title: "Pay On Time referral", text: `Use my Pay On Time referral code: ${code}`, url: window.location.origin };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      referralStatus.textContent = "Referral code shared.";
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  referralStatus.textContent = await copyReferralCode() ? "Sharing is unavailable here. Referral code copied instead." : "Sharing is unavailable here. Select and copy your referral code.";
});

try {
  setReferralCode(localStorage.getItem(referralStorageKey) || "");
} catch (error) {
  setReferralCode("");
}
