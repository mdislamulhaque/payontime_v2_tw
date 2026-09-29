// Demo-only referral policy. Set these values from the authorized admin API in production.
window.PAYONTIME_REFERRAL_RULE = Object.freeze({
  active: true,
  trigger: "registration", // registration | kyc | first-transaction
  points: 100,
});
