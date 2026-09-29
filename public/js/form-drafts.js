// Keep in-progress form values through page reloads in the current tab.
(() => {
  let userScope = "guest";
  if (window.location.pathname.endsWith("dashboard.html")) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("payOnTimeCurrentUser") || "null");
      userScope = currentUser?.id || currentUser?.email || currentUser?.phone || userScope;
    } catch (error) {
      // Keep a guest draft scope when the saved user cannot be read.
    }
  }
  const storageKey = `payontime:form-drafts:${window.location.pathname}:${userScope}`;
  const selector = "input, textarea, select";
  const sensitiveField = /(?:password|passcode|one.?time|\botp\b|verification.?code|security.?code|\bcvv\b|\bcvc\b|card.?number|credit.?card|\bpin\b|access.?token)/i;
  let drafts = {};
  let restoring = false;

  try {
    drafts = JSON.parse(sessionStorage.getItem(storageKey) || "{}");
    if (!drafts || typeof drafts !== "object" || Array.isArray(drafts)) drafts = {};
  } catch (error) {
    drafts = {};
  }

  const isPersistable = (field) => {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) return false;
    if (field.disabled || field.readOnly || field.closest("[data-no-form-draft]")) return false;
    if (["hidden", "password", "file", "submit", "reset", "button", "image"].includes(field.type)) return false;
    if (field.id === "languageSelector" || field.getAttribute("aria-label") === "Select language") return false;
    const metadata = [field.id, field.name, field.autocomplete, field.getAttribute("aria-label")].join(" ");
    if (sensitiveField.test(metadata)) return false;
    if (["current-password", "new-password", "one-time-code", "cc-number", "cc-csc"].includes(field.autocomplete)) return false;
    return true;
  };

  const assignKey = (field, index) => {
    if (field.dataset.formDraftKey) return field.dataset.formDraftKey;
    const groupType = field.type === "radio" || field.type === "checkbox";
    const formKey = field.form?.id || `form-${Array.from(document.forms).indexOf(field.form)}`;
    const identity = field.id
      ? `id:${field.id}`
      : field.name
        ? `name:${formKey}:${field.name}${groupType ? `:${field.value}` : ""}`
        : `position:${index}`;
    field.dataset.formDraftKey = identity;
    return identity;
  };

  const fieldValue = (field) => {
    if (field instanceof HTMLInputElement && ["checkbox", "radio"].includes(field.type)) return field.checked;
    if (field instanceof HTMLSelectElement && field.multiple) {
      return Array.from(field.selectedOptions, (option) => option.value);
    }
    return field.value;
  };

  const restoreField = (field, index) => {
    if (!isPersistable(field)) return false;
    const key = assignKey(field, index);
    if (!Object.prototype.hasOwnProperty.call(drafts, key)) return false;
    const saved = drafts[key];
    if (field instanceof HTMLSelectElement) {
      const values = field.multiple && Array.isArray(saved) ? saved : [saved];
      const available = new Set(Array.from(field.options, (option) => option.value));
      if (values.some((value) => !available.has(value))) return false;
      if (field.multiple) Array.from(field.options).forEach((option) => { option.selected = values.includes(option.value); });
      else field.value = String(saved);
    } else if (field instanceof HTMLInputElement && ["checkbox", "radio"].includes(field.type)) {
      field.checked = Boolean(saved);
    } else {
      field.value = String(saved ?? "");
    }
    field.dataset.formDraftRestored = "true";
    if (field instanceof HTMLSelectElement || (field instanceof HTMLInputElement && ["checkbox", "radio"].includes(field.type))) {
      restoring = true;
      field.dispatchEvent(new Event("change", { bubbles: true }));
      restoring = false;
    }
    return true;
  };

  const restoreAll = () => {
    document.querySelectorAll(selector).forEach((field, index) => {
      if (field.dataset.formDraftRestored !== "true") restoreField(field, index);
    });
  };

  const saveField = (field) => {
    if (restoring || !isPersistable(field)) return;
    const index = Array.from(document.querySelectorAll(selector)).indexOf(field);
    if (field instanceof HTMLInputElement && field.type === "radio" && field.name) {
      document.querySelectorAll('input[type="radio"]').forEach((radio, radioIndex) => {
        if (radio.name === field.name && radio.form === field.form && isPersistable(radio)) {
          drafts[assignKey(radio, radioIndex)] = radio.checked;
        }
      });
    } else {
      drafts[assignKey(field, index)] = fieldValue(field);
    }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(drafts));
    } catch (error) {
      // The form remains usable if this tab cannot store a draft.
    }
  };

  const saveForm = (form) => form.querySelectorAll(selector).forEach(saveField);

  document.addEventListener("input", (event) => {
    if (event.target.matches(selector)) saveField(event.target);
  });
  document.addEventListener("change", (event) => {
    if (event.target.matches(selector)) saveField(event.target);
  });
  document.addEventListener("submit", (event) => saveForm(event.target), true);
  document.addEventListener("reset", (event) => {
    const form = event.target;
    form.querySelectorAll(selector).forEach((field, index) => {
      const key = assignKey(field, index);
      delete drafts[key];
      delete field.dataset.formDraftRestored;
    });
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(drafts));
    } catch (error) {
      // The form remains usable if this tab cannot store a draft.
    }
  }, true);

  restoreAll();
  new MutationObserver(restoreAll).observe(document.documentElement, { childList: true, subtree: true });
})();
