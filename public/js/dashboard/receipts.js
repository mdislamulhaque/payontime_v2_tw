// Transfer receipt actions and print/download helpers.
      function handleReceiptPrint() {
        const value = (id) => document.getElementById(id)?.textContent?.trim() || "—";
        openReceiptPrint({
          title: "Transfer Receipt",
          tracking: value("receipt-id"),
          status: "Payment Verified",
          recipient: value("receipt-recipient-name"),
          sent: value("receipt-send-amount"),
          received: value("receipt-receive-amount"),
          delivery: value("receipt-delivery-method"),
          rate: value("receipt-exchange-rate"),
          payout: "Instant (Under 60s)",
        });
      }

      function handleReceiptDownload() {
        handleReceiptPrint();
      }

      function openReceiptPrint(data) {
        const rows = [
          ["Sender", data.sender], ["Recipient", data.recipient], ["Recipient phone", data.phone],
          ["Amount sent", data.sent], ["Recipient receives", data.received],
          ["Delivery method", data.delivery], ["Exchange rate", data.rate],
          ["Transfer fee", data.fee], ["Payment method", data.payment],
          ["Transfer purpose", data.purpose], ["Date & time", data.date],
          ["Estimated payout", data.payout],
        ].filter(([, value]) => value);
        const popup = window.open("", "_blank", "width=800,height=900");
        if (!popup) {
          window.print();
          return;
        }

        const printDoc = popup.document;
        printDoc.title = data.title || "Transfer Receipt";
        printDoc.documentElement.lang = "en";
        const style = printDoc.createElement("style");
        style.textContent = [
          "*{box-sizing:border-box}", "@page{size:A4 portrait;margin:14mm}",
          "body{margin:0;background:#f1f5f9;color:#0f172a;font:14px/1.55 Arial,sans-serif}",
          ".receipt{width:min(100%,760px);margin:24px auto;padding:32px;background:#fff;border:1px solid #e2e8f0;border-radius:16px}",
          ".head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;padding-bottom:20px;border-bottom:2px solid #36b647}",
          ".brand{font-size:20px;font-weight:800;color:#071b79}.muted{color:#64748b;font-size:12px}",
          ".status{padding:7px 12px;border-radius:99px;background:#dcfce7;color:#166534;font-size:11px;font-weight:700;white-space:nowrap}",
          ".tracking{margin:20px 0;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px}",
          ".tracking strong{display:block;margin-top:3px;color:#071b79;overflow-wrap:anywhere}",
          "table{width:100%;border-collapse:collapse}th,td{padding:13px 8px;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top;overflow-wrap:anywhere}",
          "th{width:38%;color:#64748b;font-weight:600}.foot{margin-top:24px;padding-top:14px;border-top:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:11px}",
          ".print-button{display:block;margin:20px auto;padding:10px 18px;border:0;border-radius:8px;background:#36b647;color:white;font-weight:700;cursor:pointer}",
          "@media(max-width:520px){.receipt{width:100%;margin:0;padding:20px;border:0;border-radius:0}.head{gap:8px}.brand{font-size:18px}th{width:42%;padding-right:10px}td,th{font-size:13px}}",
          "@media print{body{background:#fff}.receipt{width:auto;margin:0;padding:0;border:0;border-radius:0}.print-button{display:none}tr{break-inside:avoid}}",
        ].join("");
        printDoc.head.appendChild(style);

        const receipt = printDoc.createElement("main");
        receipt.className = "receipt";
        const header = printDoc.createElement("header");
        header.className = "head";
        const brandBlock = printDoc.createElement("div");
        const brand = printDoc.createElement("div");
        brand.className = "brand";
        brand.textContent = "payontime";
        const subtitle = printDoc.createElement("div");
        subtitle.className = "muted";
        subtitle.textContent = "Official money transfer receipt";
        brandBlock.append(brand, subtitle);
        const status = printDoc.createElement("span");
        status.className = "status";
        status.textContent = data.status || "Receipt";
        header.append(brandBlock, status);

        const tracking = printDoc.createElement("section");
        tracking.className = "tracking";
        const trackingLabel = printDoc.createElement("span");
        trackingLabel.className = "muted";
        trackingLabel.textContent = "Tracking number";
        const trackingValue = printDoc.createElement("strong");
        trackingValue.textContent = data.tracking || "—";
        tracking.append(trackingLabel, trackingValue);

        const table = printDoc.createElement("table");
        const tbody = printDoc.createElement("tbody");
        rows.forEach(([label, value]) => {
          const row = printDoc.createElement("tr");
          const heading = printDoc.createElement("th");
          heading.scope = "row";
          heading.textContent = label;
          const cell = printDoc.createElement("td");
          cell.textContent = value;
          row.append(heading, cell);
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        const footer = printDoc.createElement("footer");
        footer.className = "foot";
        footer.textContent = "Keep this receipt for your records.";
        receipt.append(header, tracking, table, footer);
        printDoc.body.replaceChildren(receipt);

        const printButton = printDoc.createElement("button");
        printButton.className = "print-button";
        printButton.type = "button";
        printButton.textContent = "Print / Save as PDF";
        printButton.addEventListener("click", () => popup.print());
        printDoc.body.appendChild(printButton);
        popup.focus();
        setTimeout(() => popup.print(), 400);
      }
      function handleSendAgain() {
        if (typeof resetTransferState === "function") {
          resetTransferState();
        }
        if (typeof goToStep === "function") {
          goToStep(1);
        }
      }

      function returnToDashboard() {
        if (typeof resetTransferState === "function") {
          resetTransferState();
        }
        if (typeof setDashboardTab === "function") {
          setDashboardTab("overview");
        } else if (typeof goToStep === "function") {
          goToStep(1);
        }
      }
    