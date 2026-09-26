// Recipient list, search, management, and detail dialogs.
      let recipients = [
        {
          id: "1",
          fullName: "Sarah Jenkins",
          email: "sarah.j@example.com",
          country: "United States",
          phone: "+1 555-0192",
          bankAccountNumber: "9876543210",
          tplusWalletNumber: "",
          bankName: "Chase Bank",
          cityName: "New York",
          createdAt: "Oct 24, 2024",
        },
        {
          id: "2",
          fullName: "Michael Chen",
          email: "",
          country: "Singapore",
          phone: "+65 9123 4567",
          bankAccountNumber: "",
          tplusWalletNumber: "+65 9123 4567",
          bankName: "",
          cityName: "Singapore",
          createdAt: "Nov 02, 2024",
        },
      ];

      function renderRecipients(data = recipients) {
        const tbody = document.getElementById("recipients-tbody");
        tbody.innerHTML = "";

        if (data.length === 0) {
          const q = document.getElementById("search-input").value;
          tbody.innerHTML = `
        <tr>
          <td colspan="6" class="py-12 text-center text-slate-400">
            No recipients found matching "${q}".
          </td>
        </tr>
      `;
          return;
        }

        data.forEach((rec) => {
          const initial = rec.fullName.charAt(0).toUpperCase();
          const details = [
            rec.bankName && `Bank: ${rec.bankName}`,
            (rec.bankAccountNumber || rec.accountNumber) && `Bank account: ${rec.bankAccountNumber || rec.accountNumber}`,
            (rec.tplusWalletNumber || rec.mobileWalletNumber) && `T-plus wallet: ${rec.tplusWalletNumber || rec.mobileWalletNumber}`,
            rec.cityName && `City: ${rec.cityName}`,
          ].filter(Boolean).join(" · ") || "—";

          const tr = document.createElement("tr");
          tr.className = "hover:bg-slate-50/80 transition-colors";
          tr.innerHTML = `
        <td class="p-4 font-bold text-slate-900">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs border border-slate-200">
              ${initial}
            </div>
            <div>
              <div>${rec.fullName}</div>
              ${rec.email ? `<div class="text-[11px] text-slate-400 font-normal">${rec.email}</div>` : ""}
            </div>
          </div>
        </td>
        <td class="p-4 font-semibold text-slate-700">
          <div class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${countryFlagMarkup(rec.country)} ${rec.country}</span>
          </div>
        </td>
        <td class="p-4 font-mono text-slate-800 font-semibold">${rec.phone}</td>
        <td class="p-4">
          <span class="text-[11px] text-slate-600">${details}</span>
        </td>
        <td class="p-4 text-slate-500 font-medium">${rec.createdAt}</td>
        <td class="p-4 text-right">
          <div class="flex items-center justify-end gap-1.5">
            <button onclick="openViewModal('${rec.id}')" class="table-action p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors cursor-pointer" title="View Details">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button onclick="openEditModal('${rec.id}')" class="table-action p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors cursor-pointer" title="Edit Recipient">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button onclick="deleteRecipient('${rec.id}')" class="danger-action p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-[#36b647] transition-colors cursor-pointer" title="Delete Recipient">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      `;
          tbody.appendChild(tr);
        });
      }

      function filterRecipients() {
        const q = document.getElementById("search-input").value.toLowerCase();
        document.getElementById("clear-btn").classList.toggle("hidden", !q);
        const filtered = recipients.filter(
          (rec) =>
            rec.fullName.toLowerCase().includes(q) ||
            rec.phone.toLowerCase().includes(q) ||
            rec.country.toLowerCase().includes(q),
        );
        renderRecipients(filtered);
      }

      function clearSearch() {
        document.getElementById("search-input").value = "";
        filterRecipients();
      }

      function openAddModal() {
        document.getElementById("modal-title").innerText = "Add New Recipient";
        document.getElementById("recipient-id").value = "";
        document.getElementById("recipient-form").reset();
        document.getElementById("recipient-modal").classList.remove("hidden");
      }

      function openEditModal(id) {
        const rec = recipients.find((r) => r.id === id);
        if (!rec) return;

        document.getElementById("modal-title").innerText = "Edit Recipient";
        document.getElementById("recipient-id").value = rec.id;
        document.getElementById("form-name").value = rec.fullName;
        document.getElementById("form-email").value = rec.email || "";
        document.getElementById("form-country").value = rec.country;
        updateFormCountryFlag(rec.country);
        document.getElementById("form-phone").value = rec.phone;
        document.getElementById("form-bank-name").value = rec.bankName || "";
        document.getElementById("form-bank-account-number").value =
          rec.bankAccountNumber || rec.accountNumber || "";
        document.getElementById("form-wallet-number").value =
          rec.tplusWalletNumber || rec.mobileWalletNumber || "";
        document.getElementById("form-city-name").value = rec.cityName || "";

        document.getElementById("recipient-modal").classList.remove("hidden");
      }

      function openViewModal(id) {
        const rec = recipients.find((r) => r.id === id);
        if (!rec) return;

        document.getElementById("view-avatar").innerText = rec.fullName
          .charAt(0)
          .toUpperCase();
        document.getElementById("view-name").innerText = rec.fullName;
        document.getElementById("view-email").innerText = rec.email || "N/A";
        document.getElementById("view-country").innerHTML = `${countryFlagMarkup(rec.country)} ${rec.country}`;
        document.getElementById("view-phone").innerText = rec.phone;
        document.getElementById("view-bank-name").innerText = rec.bankName || "—";
        document.getElementById("view-bank-account").innerText = rec.bankAccountNumber || rec.accountNumber || "—";
        document.getElementById("view-wallet-number").innerText = rec.tplusWalletNumber || rec.mobileWalletNumber || "—";
        document.getElementById("view-city-name").innerText = rec.cityName || "—";
        document.getElementById("view-created").innerText = rec.createdAt;

        document.getElementById("view-modal").classList.remove("hidden");
      }

      function closeRecipientModal() {
        document.getElementById("recipient-modal").classList.add("hidden");
      }

      function closeViewModal() {
        document.getElementById("view-modal").classList.add("hidden");
      }

      function handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById("recipient-id").value;
        const recData = {
          id: id || Date.now().toString(),
          fullName: document.getElementById("form-name").value,
          email: document.getElementById("form-email").value,
          country: document.getElementById("form-country").value,
          phone: document.getElementById("form-phone").value,
          bankName: document.getElementById("form-bank-name").value,
          bankAccountNumber: document.getElementById("form-bank-account-number").value,
          tplusWalletNumber:
            document.getElementById("form-wallet-number").value,
          cityName: document.getElementById("form-city-name").value,
          createdAt: id
            ? recipients.find((r) => r.id === id)?.createdAt || "Just Now"
            : "Just Now",
        };

        if (id) {
          recipients = recipients.map((r) => (r.id === id ? recData : r));
        } else {
          recipients.unshift(recData);
        }

        closeRecipientModal();
        filterRecipients();
      }

      function deleteRecipient(id) {
        if (confirm("Are you sure you want to delete this recipient?")) {
          recipients = recipients.filter((r) => r.id !== id);
          filterRecipients();
        }
      }

      // Initial Execution
      renderRecipients();
