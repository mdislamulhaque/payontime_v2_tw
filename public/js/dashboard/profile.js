// User profile data and profile edit interactions.
      let isEditing = false;

      // Default data store
      const userData = {
        fullName: "Solomon Tekle",
        email: "solomon.tekle@example.com",
        phone: "+41 79 123 45 67",
        country: "Switzerland",
        address: "Bahnhofstrasse 12, 8001 Zürich",
      };

      function toggleEditing() {
        isEditing = !isEditing;

        const inputs = document.querySelectorAll(".profile-input");
        const editBtnText = document.getElementById("editBtnText");
        const saveBtnContainer = document.getElementById("saveBtnContainer");

        if (isEditing) {
          // Enable inputs
          inputs.forEach((input) => {
            input.removeAttribute("disabled");
            input.classList.remove("disabled:bg-slate-50");
            input.classList.add("bg-white");
          });
          editBtnText.innerText = "Cancel Editing";
          editBtnText.closest("button").classList.add("danger-action");
          saveBtnContainer.classList.remove("hidden");
        } else {
          // Disable inputs and reset to last saved values
          inputs.forEach((input) => {
            input.setAttribute("disabled", "true");
            input.classList.remove("bg-white");
            input.classList.add("disabled:bg-slate-50");
          });
          resetInputs();
          editBtnText.innerText = "Edit Profile";
          editBtnText.closest("button").classList.remove("danger-action");
          saveBtnContainer.classList.add("hidden");
        }
      }

      function resetInputs() {
        document.getElementById("inputFullName").value = userData.fullName;
        document.getElementById("inputEmail").value = userData.email;
        document.getElementById("inputPhone").value = userData.phone;
        document.getElementById("inputCountry").value = userData.country;
        document.getElementById("inputAddress").value = userData.address;
      }

      function handleSave(event) {
        event.preventDefault();

        // Update store
        userData.fullName = document.getElementById("inputFullName").value;
        userData.email = document.getElementById("inputEmail").value;
        userData.phone = document.getElementById("inputPhone").value;
        userData.country = document.getElementById("inputCountry").value;
        userData.address = document.getElementById("inputAddress").value;

        // Update Header Text & Avatar Letter
        document.getElementById("headerFullName").innerText = userData.fullName;
        document.getElementById("avatar").innerText =
          userData.fullName.trim().charAt(0).toUpperCase() || "U";

        // Turn off edit mode
        toggleEditing();

        alert("Profile updated successfully!");
      }
    