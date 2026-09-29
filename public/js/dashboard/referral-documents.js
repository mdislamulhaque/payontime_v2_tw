// Local demo implementation. Replace this storage adapter with authenticated API calls in production.
const referralStoreKey = "payontime-referral-store";
const usersStoreKey = "payOnTimeUsers";
const currentUserKey = "payOnTimeCurrentUser";
const referralRule = window.PAYONTIME_REFERRAL_RULE || { active: false, trigger: "registration", points: 0 };

const referralEls = {
  code: document.getElementById("referral-code-value"),
  generate: document.getElementById("generate-referral-code"),
  copy: document.getElementById("copy-referral-code"),
  share: document.getElementById("share-referral-code"),
  status: document.getElementById("referral-code-status"),
  qr: document.getElementById("referral-qr-code"),
  qrEmpty: document.getElementById("referral-qr-empty"),
  history: document.getElementById("referral-history-body"),
};

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUser() {
  return readJson(currentUserKey, null);
}

function createReferralCode(usedCodes = []) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code;
  do {
    const values = new Uint8Array(8);
    crypto.getRandomValues(values);
    code = `POT-${Array.from(values, (value) => alphabet[value % alphabet.length]).join("")}`;
  } while (usedCodes.includes(code));
  return code;
}

function ensureDemoCode(user) {
  const users = readJson(usersStoreKey, []);
  const userIndex = users.findIndex((item) => item.email?.toLowerCase() === user?.email?.toLowerCase());
  const current = userIndex >= 0 ? users[userIndex] : user;
  if (!current) return null;
  if (!current.referralCode) {
    current.referralCode = createReferralCode(users.map((item) => item.referralCode).filter(Boolean));
    current.referrerEligible = true;
    if (userIndex >= 0) users[userIndex] = current;
    else users.push(current);
    saveJson(usersStoreKey, users);
  }
  saveJson(currentUserKey, current);
  return current;
}

function updateSummary(referrals) {
  const rows = referrals.filter((item) => item.referrerCode === referralEls.code.value);
  const successCount = rows.filter((item) => item.status === "Successful").length;
  const earned = rows.reduce((sum, item) => sum + (item.rewardStatus === "Pending" || item.rewardStatus === "Paid" ? item.points : 0), 0);
  const pending = rows.reduce((sum, item) => sum + (item.rewardStatus === "Pending" ? item.points : 0), 0);
  const redeemed = rows.reduce((sum, item) => sum + (item.rewardStatus === "Paid" ? item.points : 0), 0);
  document.getElementById("referral-success-count").textContent = successCount;
  document.getElementById("referral-earned-points").textContent = `${earned} pts`;
  document.getElementById("referral-pending-points").textContent = `${pending} pts`;
  document.getElementById("referral-redeemed-points").textContent = `${redeemed} pts`;
}

function renderReferral() {
  const user = ensureDemoCode(getCurrentUser());
  if (!user) {
    referralEls.code.value = "";
    referralEls.generate.disabled = true;
    referralEls.status.textContent = "Sign in to access your referral code and rewards.";
    return;
  }
  referralEls.code.value = user.referralCode;
  const referralUrl = `${location.origin}/signup.html?ref=${encodeURIComponent(user.referralCode)}`;
  const eligible = user.referrerEligible !== false;
  referralEls.copy.disabled = !eligible;
  referralEls.share.disabled = !eligible;
  referralEls.generate.disabled = true;
  referralEls.generate.title = "Your unique referral code is assigned to your account";
  referralEls.status.textContent = !eligible
    ? "Your account is not currently enabled to refer customers."
    : "Your unique referral code is ready to share.";
  if (referralEls.qr && referralEls.qrEmpty) {
    referralEls.qr.classList.toggle("hidden", !eligible);
    referralEls.qrEmpty.classList.toggle("hidden", eligible);
    referralEls.qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(referralUrl)}`;
  }

  const referrals = readJson(referralStoreKey, []);
  const rows = referrals.filter((item) => item.referrerCode === user.referralCode);
  updateSummary(rows);
  referralEls.history.innerHTML = rows.length ? rows.map((item) => {
    const joined = new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    const rewardLabel = item.rewardStatus === "Pending" ? `${item.points} pts · Pending` : item.rewardStatus === "Paid" ? `${item.points} pts · Credited` : "Not eligible";
    return `<tr class="border-t border-slate-100"><td class="px-5 py-4"><span class="font-bold text-slate-800">${escapeHtml(item.inviteeLabel || "New Payontime customer")}</span></td><td class="px-5 py-4 text-sm text-slate-500">${joined}</td><td class="px-5 py-4"><span class="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">${escapeHtml(item.status)}</span></td><td class="px-5 py-4 text-right text-sm font-bold text-slate-700">${rewardLabel}</td></tr>`;
  }).join("") : `<tr><td colspan="4" class="px-5 py-12 text-center"><span class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 text-slate-400"><i data-lucide="user-round-search" class="h-5 w-5"></i></span><p class="mt-3 text-sm font-bold text-slate-700">No referrals yet</p><p class="mt-1 text-xs text-slate-500">Share your code to see referral activity here.</p></td></tr>`;
  if (window.lucide) lucide.createIcons();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

async function copyReferralCode() {
  const code = referralEls.code.value;
  if (!code) return false;
  try { await navigator.clipboard.writeText(code); return true; }
  catch {
    referralEls.code.focus();
    referralEls.code.select();
    return document.execCommand("copy");
  }
}

referralEls.generate.addEventListener("click", () => renderReferral());
referralEls.copy.addEventListener("click", async () => {
  referralEls.status.textContent = await copyReferralCode() ? "Referral code copied." : "Select and copy your referral code.";
});
referralEls.share.addEventListener("click", async () => {
  const code = referralEls.code.value;
  if (!code) return;
  const url = `${location.origin}/signup.html?ref=${encodeURIComponent(code)}`;
  try {
    if (navigator.share) await navigator.share({ title: "Payontime referral", text: `Join Payontime with my referral code: ${code}`, url });
    else { await navigator.clipboard.writeText(url); }
    referralEls.status.textContent = "Your referral invite link is ready to share.";
  } catch (error) {
    if (error.name !== "AbortError") referralEls.status.textContent = "Could not share the invite. Please try again.";
  }
});

renderReferral();
