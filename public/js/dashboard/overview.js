// Dashboard state, overview cards, and dashboard widgets.
      // App State (Replacing Context API)
      const state = {
        user: {
          fullName: "Ahmed Islam",
          kycStatus: "Verified",
        },
        liveRates: {
          BDT: 11.39,
          ERN: 1.43,
        },
        ratesLoading: false,
        dashboardTab: "overview",
        recipients: [
          {
            id: "1",
            fullName: "Rahim Uddin",
            country: "Bangladesh",
            deliveryMethod: "bKash Wallet",
          },
          {
            id: "2",
            fullName: "Solomon Tekle",
            country: "Eritrea",
            deliveryMethod: "Cash Pickup",
          },
          {
            id: "3",
            fullName: "Amina Khatun",
            country: "Bangladesh",
            deliveryMethod: "Bank Transfer",
          },
          {
            id: "4",
            fullName: "Nega Zerai",
            country: "Eritrea",
            deliveryMethod: "Eribank Payout",
          },
        ],
        transactions: [
          {
            id: "HID-88492019",
            recipientName: "Rahim Uddin",
            deliveryMethod: "bKash Wallet",
            sendAmount: 2500,
            sendCurrency: "SEK",
            receiveAmount: 28250,
            receiveCurrency: "BDT",
            status: "Completed",
          },
          {
            id: "HID-88492020",
            recipientName: "Solomon Tekle",
            deliveryMethod: "Cash Pickup",
            sendAmount: 5000,
            sendCurrency: "SEK",
            receiveAmount: 7100,
            receiveCurrency: "ERN",
            status: "Completed",
          },
          {
            id: "HID-88492021",
            recipientName: "Amina Khatun",
            deliveryMethod: "Bank Transfer",
            sendAmount: 1200,
            sendCurrency: "SEK",
            receiveAmount: 13560,
            receiveCurrency: "BDT",
            status: "Processing",
          },
        ],
        notifications: [
          {
            id: "n1",
            title: "Transfer Completed",
            desc: "HID-88492019 of 2,500 SEK was delivered to Ahmed Islam via bKash.",
            time: "10 min ago",
            read: false,
          },
          {
            id: "n2",
            title: "Exchange Rate Alert",
            desc: "BDT exchange rate increased to 11.30 per SEK.",
            time: "2 hours ago",
            read: true,
          },
          {
            id: "n3",
            title: "Security Verification",
            desc: "256-Bit SSL protection & KYC status confirmed.",
            time: "1 day ago",
            read: true,
          },
        ],
      };

      // UI Initializers & Renderers
      function initUser() {
        const firstChar = state.user.fullName.charAt(0);
        document.getElementById("userAvatarSidebar").innerText = firstChar;
        document.getElementById("userAvatarHeader").innerText = firstChar;
        document.getElementById("userNameSidebar").innerText =
          state.user.fullName;
        document.getElementById("userNameHeader").innerText =
          state.user.fullName;
        document.getElementById("headerWelcome").innerText =
          `Welcome back, ${state.user.fullName.split(" ")[0]} 👋`;
      }

      function renderNotifications() {
        const container = document.getElementById("notifListContainer");
        container.innerHTML = state.notifications
          .map(
            (n) => `
        <div class="p-3 rounded-2xl border text-xs transition-colors ${!n.read ? "bg-green-50/50 border-green-100" : "bg-slate-50 border-slate-100"}">
          <div class="flex justify-between items-start mb-1">
            <span class="font-bold text-slate-900">${n.title}</span>
            <span class="text-[10px] text-slate-400">${n.time}</span>
          </div>
          <p class="text-[11px] text-slate-600 leading-snug">${n.desc}</p>
        </div>
      `,
          )
          .join("");
      }

      function renderOverviewStats() {
        const totalSentSEK = state.transactions.reduce(
          (acc, t) => acc + (t.sendAmount || 0),
          0,
        );
        document.getElementById("statTotalSent").innerText =
          `${totalSentSEK.toLocaleString()} SEK`;
        document.getElementById("statRecipientsCount").innerText =
          state.recipients.length;
        document.getElementById("statTxCount").innerText =
          state.transactions.length;
        document.getElementById("viewAllRecipientsBtn").innerText =
          `View All ${state.recipients.length} Recipients`;
      }

      function renderRecentTransactions() {
        const tableBody = document.getElementById("recentTransactionsTable");
        const recent = state.transactions.slice(0, 5);

        tableBody.innerHTML = recent
          .map(
            (tx) => `
        <tr class="hover:bg-slate-50/80 transition-colors">
          <td class="py-3.5">
            <div class="font-bold text-slate-900">${tx.recipientName}</div>
            <div class="text-[11px] text-slate-400">${tx.deliveryMethod}</div>
          </td>
          <td class="py-3.5 font-bold text-slate-900">${tx.sendAmount} ${tx.sendCurrency}</td>
          <td class="py-3.5 font-bold text-emerald-700">${tx.receiveAmount} ${tx.receiveCurrency}</td>
          <td class="py-3.5">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${tx.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}">
              ${tx.status}
            </span>
          </td>
          <td class="py-3.5 text-right">
            <button onclick="openTxDetailModal('${tx.id}')" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="View Receipt">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
          </td>
        </tr>
      `,
          )
          .join("");
      }

      function renderQuickRecipients() {
        const container = document.getElementById("quickRecipientsList");
        container.innerHTML = state.recipients
          .slice(0, 4)
          .map(
            (rec) => `
        <div onclick="switchTab('send')" class="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 hover:bg-green-50/20 cursor-pointer transition-all flex items-center justify-between group">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs group-hover:bg-[#36b647] group-hover:text-white transition-colors">
              ${rec.fullName.charAt(0)}
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900">${rec.fullName}</h4>
              <p class="text-[11px] text-slate-500">${countryFlagMarkup(rec.country)} ${rec.country} • ${rec.deliveryMethod}</p>
            </div>
          </div>
          <svg class="w-4 h-4 text-slate-400 group-hover:text-[#36b647] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </div>
      `,
          )
          .join("");
      }

      // Navigation & Tab Switching
      function switchTab(tabId) {
        state.dashboardTab = tabId;

        // Only sidebar items receive active navigation styling.
        // Header profile and dashboard call-to-action buttons keep their own styles.
        document.querySelectorAll("#sidebar .nav-btn[data-tab]").forEach((btn) => {
          const isTarget = btn.getAttribute("data-tab") === tabId;
          if (isTarget) {
            btn.classList.add(
              "bg-[#36b647]",
              "text-white",
              "shadow-lg",
              "shadow-green-500/20",
            );
            btn.classList.remove(
              "text-slate-300",
              "hover:bg-slate-800",
              "bg-slate-50",
              "hover:bg-slate-100",
            );
          } else {
            btn.classList.remove(
              "bg-[#36b647]",
              "text-white",
              "shadow-lg",
              "shadow-green-500/20",
            );
            if (!btn.classList.contains("border")) {
              btn.classList.add("text-slate-300", "hover:bg-slate-800");
            }
          }
        });

        // Toggle Active Tab Content Area
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.add("hidden");
        });
        const activeContent = document.getElementById(`tab-${tabId}`);
        if (activeContent) {
          activeContent.classList.remove("hidden");
        }

        // Close Mobile Sidebar upon navigation
        closeMobileSidebar();
      }

      // Mobile Sidebar Handlers
      function openMobileSidebar() {
        document
          .getElementById("sidebar")
          .classList.remove("-translate-x-full");
        document.getElementById("mobileBackdrop").classList.remove("hidden");
        document.getElementById("toggleMobileSidebar").setAttribute("aria-expanded", "true");
      }

      function closeMobileSidebar() {
        document.getElementById("sidebar").classList.add("-translate-x-full");
        document.getElementById("mobileBackdrop").classList.add("hidden");
        document.getElementById("toggleMobileSidebar").setAttribute("aria-expanded", "false");
      }

      function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        const toggle = document.getElementById("toggleMobileSidebar");
        if (window.matchMedia("(min-width: 1024px)").matches) {
          const collapsed = document.getElementById("dashboardShell").classList.toggle("sidebar-collapsed");
          toggle.setAttribute("aria-expanded", String(!collapsed));
          return;
        }
        const isOpen = !sidebar.classList.contains("-translate-x-full");
        if (isOpen) closeMobileSidebar();
        else openMobileSidebar();
        toggle.setAttribute("aria-expanded", String(!isOpen));
      }

      // Modal Handlers
      function openTxDetailModal(txId) {
        const tx = state.transactions.find((t) => t.id === txId);
        if (!tx) return;

        document.getElementById("modalTxId").innerText = `#${tx.id}`;
        document.getElementById("modalRecipient").innerText = tx.recipientName;
        document.getElementById("modalDelivery").innerText = tx.deliveryMethod;
        document.getElementById("modalSent").innerText =
          `${tx.sendAmount} ${tx.sendCurrency}`;
        document.getElementById("modalReceived").innerText =
          `${tx.receiveAmount} ${tx.receiveCurrency}`;
        document.getElementById("modalStatus").innerText = tx.status;

        document.getElementById("txDetailModal").classList.remove("hidden");
      }

      function closeTxModal() {
        document.getElementById("txDetailModal").classList.add("hidden");
      }

      // Event Listeners Setup
      document.addEventListener("DOMContentLoaded", () => {
        initUser();
        renderNotifications();
        renderOverviewStats();
        renderRecentTransactions();
        renderQuickRecipients();

        const languageSelector = document.getElementById("languageSelector");
        const supportedLanguages = ["en", "sv"];
        try {
          const savedLanguage = localStorage.getItem("payontime-language");
          if (supportedLanguages.includes(savedLanguage)) languageSelector.value = savedLanguage;
        } catch (error) {
          // Keep the selector usable when browser storage is unavailable.
        }
        const languageFlag = document.getElementById("language-flag");
        const updateLanguageFlag = () => {
          const language = languageSelector.value === "sv" ? "Swedish" : "English";
          const flagCode = languageSelector.value === "sv" ? "se" : "gb";
          languageFlag.src = `https://flagcdn.com/w40/${flagCode}.png`;
          languageFlag.alt = `${language} flag`;
        };
        updateLanguageFlag();
        document.documentElement.lang = languageSelector.value;
        languageSelector.addEventListener("change", () => {
          document.documentElement.lang = languageSelector.value;
          updateLanguageFlag();
          try {
            localStorage.setItem("payontime-language", languageSelector.value);
          } catch (error) {
            // The selected language remains active for this page view.
          }
        });

        // Sidebar Toggles
        document
          .getElementById("toggleMobileSidebar")
          .addEventListener("click", toggleSidebar);
        document
          .getElementById("closeSidebarMobile")
          .addEventListener("click", closeMobileSidebar);
        document
          .getElementById("mobileBackdrop")
          .addEventListener("click", closeMobileSidebar);

        // Tab Buttons Listener
        document.addEventListener("click", (e) => {
          const navBtn = e.target.closest("[data-tab]");
          if (navBtn) {
            const tab = navBtn.getAttribute("data-tab");
            switchTab(tab);
          }
        });

        // Notification Dropdown Toggle
        const notifBellBtn = document.getElementById("notifBellBtn");
        const notifDropdown = document.getElementById("notifDropdown");
        notifBellBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          notifDropdown.classList.toggle("hidden");
        });
        document
          .getElementById("closeNotifBtn")
          .addEventListener("click", () => {
            notifDropdown.classList.add("hidden");
          });
        document.addEventListener("click", (e) => {
          if (
            !notifDropdown.contains(e.target) &&
            !notifBellBtn.contains(e.target)
          ) {
            notifDropdown.classList.add("hidden");
          }
        });

        // Modal Closers
        document
          .getElementById("closeTxModalBtn")
          .addEventListener("click", closeTxModal);
        document
          .getElementById("closeTxModalFooterBtn")
          .addEventListener("click", closeTxModal);

        restoreLandingTransfer();

        const requestedTab = new URLSearchParams(window.location.search).get("tab");
        const availableTabs = ["overview", "send", "recipients", "transactions", "profile"];
        if (availableTabs.includes(requestedTab)) {
          switchTab(requestedTab);
        }
      });
    
