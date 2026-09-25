// Transaction list, filters, details, and actions.
      // Sample Data
      let transactions = [
        {
          id: "1",
          trackingNumber: "HID-88492019",
          senderName: "Solomon Tekle",
          recipientName: "Abebe Bikila",
          recipientPhone: "+251 91 123 4567",
          sendAmount: "500.00",
          sendCurrency: "USD",
          receiveAmount: "28,500.00",
          receiveCurrency: "ETB",
          deliveryMethod: "Bank Deposit",
          date: "Oct 24, 2026 • 14:32",
          status: "Completed",
          exchangeRate: "57.00",
          fee: "5.00",
          paymentMethod: "Debit Card",
          purpose: "Family Support",
        },
        {
          id: "2",
          trackingNumber: "HID-90124812",
          senderName: "Solomon Tekle",
          recipientName: "Saba Kebede",
          recipientPhone: "+251 92 987 6543",
          sendAmount: "250.00",
          sendCurrency: "EUR",
          receiveAmount: "15,400.00",
          receiveCurrency: "ETB",
          deliveryMethod: "Mobile Wallet",
          date: "Oct 26, 2026 • 09:15",
          status: "Pending",
          exchangeRate: "61.60",
          fee: "3.50",
          paymentMethod: "Bank Transfer",
          purpose: "Medical Expenses",
        },
        {
          id: "3",
          trackingNumber: "HID-44810293",
          senderName: "Solomon Tekle",
          recipientName: "Dawit Isaac",
          recipientPhone: "+251 93 456 7890",
          sendAmount: "100.00",
          sendCurrency: "USD",
          receiveAmount: "5,700.00",
          receiveCurrency: "ETB",
          deliveryMethod: "Cash Pickup",
          date: "Oct 20, 2026 • 18:04",
          status: "Failed",
          exchangeRate: "57.00",
          fee: "2.00",
          paymentMethod: "Credit Card",
          purpose: "Education",
        },
      ];

      let currentSelectedTx = null;

      // Render Table
      function renderTable(data) {
        const tbody = document.getElementById("transactionTableBody");
        tbody.innerHTML = "";

        if (data.length === 0) {
          tbody.innerHTML = `
          <tr>
            <td colSpan="8" class="py-12 text-center text-slate-400">
              No transactions found.
            </td>
          </tr>`;
          return;
        }

        data.forEach((tx) => {
          const badgeColor =
            tx.status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : tx.status === "Pending"
                ? "bg-amber-50 text-amber-700"
                : "bg-green-50 text-green-700";

          const row = document.createElement("tr");
          row.className = "hover:bg-slate-50/80 transition-colors";
          row.innerHTML = `
          <td class="p-4 font-mono font-bold text-slate-900">${tx.trackingNumber}</td>
          <td class="p-4 font-bold text-slate-900">
            <div>${tx.recipientName}</div>
            <div class="text-[11px] text-slate-400 font-normal">${tx.recipientPhone}</div>
          </td>
          <td class="p-4 font-bold text-slate-900">${tx.sendAmount} ${tx.sendCurrency}</td>
          <td class="p-4 font-bold text-emerald-700">${tx.receiveAmount} ${tx.receiveCurrency}</td>
          <td class="p-4 text-slate-700 font-medium">${tx.deliveryMethod}</td>
          <td class="p-4 text-slate-500 font-medium">${tx.date}</td>
          <td class="p-4">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeColor}">
              ${tx.status}
            </span>
          </td>
          <td class="p-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="openModal('${tx.id}')" title="View Receipt" class="table-action p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
              <button onclick="deleteTx('${tx.id}')" title="Delete Record" class="danger-action p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-[#36b647] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </td>
        `;
          tbody.appendChild(row);
        });
      }

      // Filter Logic
      function filterTransactions() {
        const q = document.getElementById("searchInput").value.toLowerCase();
        const status = document.getElementById("statusFilter").value;

        const filtered = transactions.filter((tx) => {
          const matchesSearch =
            tx.trackingNumber.toLowerCase().includes(q) ||
            tx.recipientName.toLowerCase().includes(q) ||
            tx.recipientPhone.toLowerCase().includes(q);

          const matchesStatus = status === "All" || tx.status === status;

          return matchesSearch && matchesStatus;
        });

        renderTable(filtered);
      }

      // Delete Logic
      function deleteTx(id) {
        if (
          confirm("Are you sure you want to delete this transaction record?")
        ) {
          transactions = transactions.filter((tx) => tx.id !== id);
          filterTransactions();
        }
      }

      // Modal Logic
      function openModal(id) {
        const tx = transactions.find((t) => t.id === id);
        if (!tx) return;
        currentSelectedTx = tx;

        document.getElementById("mTracking").innerText = tx.trackingNumber;
        document.getElementById("mSendAmount").innerText =
          `${tx.sendAmount} ${tx.sendCurrency}`;
        document.getElementById("mReceiveAmount").innerText =
          `${tx.receiveAmount} ${tx.receiveCurrency}`;
        document.getElementById("mSenderName").innerText = tx.senderName;
        document.getElementById("mRecipientName").innerText = tx.recipientName;
        document.getElementById("mRecipientPhone").innerText =
          tx.recipientPhone;
        document.getElementById("mDeliveryMethod").innerText =
          tx.deliveryMethod;
        document.getElementById("mExchangeRate").innerText =
          `1 ${tx.sendCurrency} = ${tx.exchangeRate} ${tx.receiveCurrency}`;
        document.getElementById("mFee").innerText =
          `${tx.fee} ${tx.sendCurrency}`;
        document.getElementById("mPaymentMethod").innerText = tx.paymentMethod;
        document.getElementById("mPurpose").innerText = tx.purpose;
        document.getElementById("mDate").innerText = tx.date;

        const badge = document.getElementById("mStatusBadge");
        const badgeStyle =
          tx.status === "Completed"
            ? "bg-emerald-100 text-emerald-800"
            : tx.status === "Pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-green-100 text-green-800";

        badge.className = `px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 ${badgeStyle}`;
        badge.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        ${tx.status}
      `;

        document.getElementById("txModal").classList.remove("hidden");
      }

      function closeModal() {
        document.getElementById("txModal").classList.add("hidden");
      }

      // Print Logic
      function printReceipt() {
        if (!currentSelectedTx) return;
        const tx = currentSelectedTx;
        openReceiptPrint({
          title: "Transfer Receipt",
          tracking: tx.trackingNumber,
          status: tx.status,
          sender: tx.senderName,
          recipient: tx.recipientName,
          phone: tx.recipientPhone,
          sent: `${tx.sendAmount} ${tx.sendCurrency}`,
          received: `${tx.receiveAmount} ${tx.receiveCurrency}`,
          delivery: tx.deliveryMethod,
          rate: `1 ${tx.sendCurrency} = ${tx.exchangeRate} ${tx.receiveCurrency}`,
          fee: `${tx.fee} ${tx.sendCurrency}`,
          payment: tx.paymentMethod,
          purpose: tx.purpose,
          date: tx.date,
        });
      }

      // Open the browser print dialog; users can print or save the receipt as PDF.
      function downloadPDF() {
        if (!currentSelectedTx) return;
        printReceipt();
      }

      // Initial Render
      renderTable(transactions);
    