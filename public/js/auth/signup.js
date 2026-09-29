// Client-side account and referral demo. Production registration must use a secure backend.
const form = document.getElementById("signupForm");
const message = document.getElementById("message");
const initialReferralCode = new URLSearchParams(location.search).get("ref") || "";

function showSignupMessage(text, success = false) {
  message.textContent = text;
  message.className = `mb-4 rounded-xl border p-3 text-xs font-medium ${success ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`;
}

window.togglePassword = (id, button) => {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
  button?.setAttribute("aria-label", input.type === "password" ? "Show password" : "Hide password");
};

if (initialReferralCode) {
  const referralField = document.createElement("div");
  referralField.innerHTML = `<label for="signup-referral-code" class="mb-1 block text-xs font-bold text-slate-700">Referral code <span class="font-medium text-slate-400">(optional)</span></label><input id="signup-referral-code" type="text" maxlength="24" value="${initialReferralCode.replace(/[&<>"']/g, "")}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-bold uppercase tracking-wider" />`;
  form.insertBefore(referralField, form.querySelector("button[type='submit']"));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  if (password !== document.getElementById("confirmPassword").value) {
    showSignupMessage("Passwords do not match.");
    return;
  }
  let users;
  try { users = JSON.parse(localStorage.getItem("payOnTimeUsers") || "[]"); }
  catch { users = []; }
  if (users.some((user) => user.email?.toLowerCase() === email || user.phone === phone)) {
    showSignupMessage("An account with this email or phone number already exists.");
    return;
  }
  const codeInput = document.getElementById("signup-referral-code");
  const referralCode = (codeInput?.value || initialReferralCode).trim().toUpperCase();
  const user = {
    id: crypto.randomUUID(), fullName: name, email, phone,
    dob: document.getElementById("dob").value,
    country: document.getElementById("country").value,
    password, kycStatus: "Pending", createdAt: new Date().toISOString(), referrerEligible: true,
  };
  try {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const createCode = () => {
      const random = new Uint8Array(8);
      crypto.getRandomValues(random);
      return `POT-${Array.from(random, (byte) => alphabet[byte % alphabet.length]).join("")}`;
    };
    let assignedCode = createCode();
    while (users.some((existing) => existing.referralCode === assignedCode)) assignedCode = createCode();
    user.referralCode = assignedCode;
    const inviter = users.find((existing) => existing.referralCode?.toUpperCase() === referralCode && existing.referrerEligible !== false);
    users.push(user);
    localStorage.setItem("payOnTimeUsers", JSON.stringify(users));
    if (inviter && inviter.email.toLowerCase() !== email) {
      const referrals = JSON.parse(localStorage.getItem("payontime-referral-store") || "[]");
      if (!referrals.some((item) => item.inviteeEmail === email)) {
        const rule = window.PAYONTIME_REFERRAL_RULE || { active: false, trigger: "registration", points: 0 };
        const registrationQualifies = rule.active && rule.trigger === "registration";
        referrals.push({
          id: crypto.randomUUID(), referrerCode: inviter.referralCode,
          inviteeEmail: email, inviteeLabel: `Customer ${assignedCode.slice(-4)}`,
          status: registrationQualifies ? "Successful" : "Registered",
          rewardStatus: rule.active ? "Pending" : "Not eligible",
          points: registrationQualifies ? Number(rule.points) || 0 : 0,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("payontime-referral-store", JSON.stringify(referrals));
      }
    }
    const registeredUser = user;
    localStorage.setItem("payOnTimeCurrentUser", JSON.stringify(registeredUser));
    showSignupMessage("Account created. Opening your dashboard…", true);
    window.setTimeout(() => { location.href = "/dashboard.html?tab=referral-code"; }, 500);
  } catch {
    showSignupMessage("Could not create your account. Please try again.");
  }
});
