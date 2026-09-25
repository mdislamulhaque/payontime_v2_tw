// OTP countdown and verification interactions.
      let otpTimerValue = 60;
      let otpCountdownInterval = null;

      function startOtpTimer() {
        clearInterval(otpCountdownInterval);
        otpTimerValue = 60;
        const timerContainer = document.getElementById("otp-timer-container");

        if (timerContainer) {
          timerContainer.innerHTML =
            'Resend code in <span id="otp-timer" class="font-bold text-slate-900">60s</span>';
        }

        otpCountdownInterval = setInterval(() => {
          otpTimerValue--;
          const timerSpan = document.getElementById("otp-timer");
          if (timerSpan) timerSpan.innerText = `${otpTimerValue}s`;

          if (otpTimerValue <= 0) {
            clearInterval(otpCountdownInterval);
            if (timerContainer) {
              timerContainer.innerHTML = `
            <button onclick="resendOTP()" class="text-[#36b647] font-bold hover:underline inline-flex items-center gap-1">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                <path d="M16 16h5v5"></path>
              </svg>
              <span>Resend OTP Code</span>
            </button>
          `;
            }
          }
        }, 1000);
      }

      function handleOtpInput(input, index) {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value && index < 5) {
          const nextInput = input.parentElement.children[index + 1];
          if (nextInput) nextInput.focus();
        }
      }

      function handleOtpKeyDown(input, event, index) {
        if (event.key === "Backspace" && !input.value && index > 0) {
          const prevInput = input.parentElement.children[index - 1];
          if (prevInput) prevInput.focus();
        }
      }

      function resendOTP() {
        const inputs = document.querySelectorAll("#otp-inputs-container input");
        const defaultCode = ["1", "2", "3", "4", "5", "6"];
        inputs.forEach((input, idx) => {
          input.value = defaultCode[idx];
        });
        startOtpTimer();
      }

      function verifyOTP() {
        const inputs = document.querySelectorAll("#otp-inputs-container input");
        let fullCode = "";
        inputs.forEach((i) => (fullCode += i.value));

        if (fullCode.length < 6) {
          alert("Please enter all 6 digits of the verification code.");
          return;
        }

        const btn = document.getElementById("verify-btn");
        btn.disabled = true;
        btn.innerHTML = `
      <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
        <path d="M16 16h5v5"></path>
      </svg>
      <span>Verifying Payment...</span>
    `;

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = `
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        <span>Verify & Complete Payment</span>
      `;
          if (typeof goToStep === "function") {
            goToStep(7);
          }
        }, 1200);
      }

      // Initialize countdown on step load
      document.addEventListener("DOMContentLoaded", () => {
        startOtpTimer();
      });
    