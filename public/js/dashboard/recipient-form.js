// Recipient forms share the Somalia and Kenya test data and phone lookup.
const recipientCountries = {
  SO: { name: "Somalia", flagCode: "so", dial: "+252", cities: ["Mogadishu", "Hargeisa", "Kismayo", "Garowe"] },
  KE: { name: "Kenya", flagCode: "ke", dial: "+254", cities: ["Nairobi", "Mombasa", "Kisumu", "Nakuru"] },
};
const testRecipients = {
  SO: { digits: "619333207", first: "MAXAMED", middle: "CALI", last: "JAAMAC", city: "Mogadishu" },
  KE: { digits: "712345678", first: "Brian", middle: "", last: "Otieno", city: "Nairobi" },
};

function recipientPhoneDigits(value) { return value.replace(/\D/g, ""); }

function setRecipientCityOptions(select, countryCode, selectedCity = "") {
  const country = recipientCountries[countryCode];
  select.innerHTML = '<option value="">Select city</option>' + country.cities.map((city) => `<option value="${city}">${city}</option>`).join("");
  select.value = country.cities.includes(selectedCity) ? selectedCity : "";
}

function updateQuickRecipientCountry(countryCode) {
  const country = recipientCountries[countryCode];
  setCountryFlagImage(document.getElementById("quick-country-code-flag"), country);
  setCountryDisplay(document.getElementById("quick-recipient-country-display"), country);
  updateWalletLabel("quick", countryCode);
  setRecipientCityOptions(document.getElementById("quick-recipient-city"), countryCode);
  lookupTestRecipient("quick", countryCode);
}

function updateFormRecipientCountry(countryCode, selectedCity = "") {
  const country = recipientCountries[countryCode];
  setCountryFlagImage(document.getElementById("form-country-code-flag"), country);
  setCountryDisplay(document.getElementById("form-country-display"), country);
  updateWalletLabel("form", countryCode);
  setRecipientCityOptions(document.getElementById("form-city-name"), countryCode, selectedCity);
  lookupTestRecipient("form", countryCode);
}

function setCountryFlagImage(image, country) {
  image.src = `https://flagcdn.com/w40/${country.flagCode}.png`;
  image.alt = `${country.name} flag`;
}

function setCountryDisplay(element, country) {
  element.innerHTML = `<img src="https://flagcdn.com/w40/${country.flagCode}.png" class="w-6 h-4 object-cover rounded-sm" alt="${country.name} flag" />${country.name}`;
}

function updateWalletLabel(form, countryCode) {
  const kenya = countryCode === "KE";
  const label = document.getElementById(form === "quick" ? "quick-wallet-label" : "form-wallet-label");
  const input = document.getElementById(form === "quick" ? "quick-recipient-wallet-number" : "form-wallet-number");
  if (!label || !input) return;
  label.textContent = kenya ? "M-Pesa Number" : "T-plus Wallet Number";
  input.placeholder = kenya ? "Enter M-Pesa number" : "Enter T-plus wallet number";
}

function lookupTestRecipient(form, countryCode) {
  const prefix = form === "quick" ? "quick-recipient-" : "form-";
  const phone = document.getElementById(`${prefix}phone`);
  const country = recipientCountries[countryCode];
  const digits = recipientPhoneDigits(phone.value);
  const match = testRecipients[countryCode];
  if (!match || !digits || !digits.endsWith(match.digits)) return;

  phone.value = match.digits;
  const first = document.getElementById(form === "quick" ? "quick-recipient-first-name" : "form-first-name");
  const middle = document.getElementById(form === "quick" ? "quick-recipient-middle-name" : "form-middle-name");
  const last = document.getElementById(form === "quick" ? "quick-recipient-last-name" : "form-last-name");
  first.value = match.first;
  middle.value = match.middle;
  last.value = match.last;
  setRecipientCityOptions(document.getElementById(form === "quick" ? "quick-recipient-city" : "form-city-name"), countryCode, match.city);
  const display = document.getElementById(form === "quick" ? "quick-recipient-country-display" : "form-country-display");
  setCountryDisplay(display, country);
  updateRecipientSaveButtons();
}

function updateRecipientSaveButtons() {
  document.getElementById("quick-recipient-save").disabled = !document.getElementById("add-recipient-form").checkValidity();
  document.getElementById("recipient-form-save").disabled = !document.getElementById("recipient-form").checkValidity();
}

document.getElementById("quick-recipient-phone").addEventListener("input", () => lookupTestRecipient("quick", document.getElementById("quick-recipient-country-code").value));
document.getElementById("form-phone").addEventListener("input", () => lookupTestRecipient("form", document.getElementById("form-country-code").value));
for (const formId of ["add-recipient-form", "recipient-form"]) {
  document.getElementById(formId).addEventListener("input", updateRecipientSaveButtons);
  document.getElementById(formId).addEventListener("change", updateRecipientSaveButtons);
}
updateQuickRecipientCountry("KE");
updateFormRecipientCountry("KE");
updateRecipientSaveButtons();

function openAddRecipientModal() {
  updateRecipientSaveButtons();
  document.getElementById("add-recipient-modal").classList.remove("hidden");
}
function closeAddRecipientModal() { document.getElementById("add-recipient-modal").classList.add("hidden"); }

function handleSaveRecipient(event) {
  event.preventDefault();
  const code = document.getElementById("quick-recipient-country-code").value;
  const country = recipientCountries[code];
  const fullName = ["first-name", "middle-name", "last-name"].map((part) => document.getElementById(`quick-recipient-${part}`).value.trim()).filter(Boolean).join(" ");
  const phone = `${country.dial} ${recipientPhoneDigits(document.getElementById("quick-recipient-phone").value)}`;
  const bankName = "";
  const bankAccountNumber = "";
  const tplusWalletNumber = "";
  const cityName = document.getElementById("quick-recipient-city").value;
  const id = `rec_${Date.now()}`;
  recipientsData[id] = { name: fullName, country: country.name, phone, bankName, bankAccountNumber, tplusWalletNumber, cityName, address: document.getElementById("quick-recipient-address").value.trim(), deliveryMethod: tplusWalletNumber ? "T-plus Wallet" : bankAccountNumber ? "Bank" : "Cash Pickup", payoutDetails: tplusWalletNumber ? `T-plus wallet: ${tplusWalletNumber}` : bankAccountNumber ? `Bank account: ${bankAccountNumber}` : "Cash pickup" };
  const recipientSelect = document.getElementById("recipient-select");
  recipientSelect.add(new Option(`${fullName} | ${phone}`, id));
  recipientSelect.value = id;
  closeAddRecipientModal();
  document.getElementById("add-recipient-form").reset();
  updateQuickRecipientCountry("KE");
  updateRecipientSaveButtons();
  renderRecipientCard();
}
