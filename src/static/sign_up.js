let shouldRedirectAfterAlert = false;

function showCustomAlert(message, redirectAfter = false) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("customAlertMessage");
    const overlay = document.getElementById("blurOverlay");

    alertMessage.textContent = message;
    alertBox.classList.add("show");
    overlay.classList.add("show");

    shouldRedirectAfterAlert = redirectAfter;
}

function hideCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    const overlay = document.getElementById("blurOverlay");

    alertBox.classList.remove("show");
    overlay.classList.remove("show");

    if (shouldRedirectAfterAlert) {
        window.location.href = "/sign_in";
    }
}

// document.addEventListener("DOMContentLoaded", () => {
//     const form = document.querySelector(".signup_form");
//     const auIdInput = form.querySelector('input[placeholder="AU ID"]');
//     const passwordInput = form.querySelector('input[placeholder="Password"]');
//     const roleInputs = form.querySelectorAll('input[name="role"]');
//
//     form.addEventListener("submit", function (e) {
//         e.preventDefault();
//
//         const auId = auIdInput.value.trim();
//         const password = passwordInput.value.trim();
//         let selectedRole = "";
//
//         roleInputs.forEach(input => {
//             if (input.checked) {
//                 selectedRole = input.value;
//             }
//         });
//
//         if (auId.length !== 7) {
//             showCustomAlert("🚫 AU ID must be exactly 7 characters!");
//             auIdInput.focus();
//             return;
//         }
//
//         if (password.length < 6) {
//             showCustomAlert("🔐 Password must be at least 6 characters long!");
//             passwordInput.focus();
//             return;
//         }
//
//         if (!selectedRole) {
//             showCustomAlert("⚠️ Please select either Trainer or Trainee!");
//             return;
//         }
//
//         const userInfo = {
//             password: password,
//             role: selectedRole
//         };
//
//         sessionStorage.setItem(auId, JSON.stringify(userInfo));
//         showCustomAlert("✅ Account created successfully! You can now sign in.", true);
//         form.reset();
//     });
//
//     const okBtn = document.getElementById("customAlertOkBtn");
//     okBtn.addEventListener("click", hideCustomAlert);
// });



document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm");
    const auIdInput = document.getElementById("auId");
    const fullNameInput = document.getElementById("fullName");
    const passwordInput = document.getElementById("password");
    const trainerRoleInput = document.getElementById("trainerRole");
    const traineeRoleInput = document.getElementById("traineeRole");
    const trainerFields = document.getElementById("trainerFields");

    // Show/hide trainer fields based on role selection
    trainerRoleInput.addEventListener("change", () => {
        trainerFields.style.display = trainerRoleInput.checked ? "block" : "none";
    });

    traineeRoleInput.addEventListener("change", () => {
        trainerFields.style.display = "none";
    });

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const auId = auIdInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const password = passwordInput.value.trim();
    const isTrainer = trainerRoleInput.checked;
    let selectedRole = isTrainer ? "trainer" : "trainee";

    // Validation (same as before)

    if (isTrainer) {
        const specialization = document.getElementById("specialization").value;
        const experience = document.getElementById("experience").value;

        if (!specialization) {
            showCustomAlert("💪 Please select your specialization!");
            return;
        }

        if (!experience) {
            showCustomAlert("📅 Please select your experience level!");
            return;
        }
    }

    // Create user object
    const userInfo = {
        password: password,
        role: selectedRole,
        name: fullName,
        username: auId,
    };

    if (isTrainer) {
        userInfo.specialty = document.getElementById("specialization").value;
        userInfo.experience = document.getElementById("experience").value;
        userInfo.bio = document.getElementById("bio").value.trim();
        userInfo.icon = getTrainerIcon(document.getElementById("specialization").value);
    }
        sessionStorage.setItem(auId, JSON.stringify(userInfo));


        showCustomAlert("✅ Account created successfully! You can now sign in.", true);
        form.reset();
});

    const okBtn = document.getElementById("customAlertOkBtn");
    okBtn.addEventListener("click", hideCustomAlert);

// Updated icon assignment function
function getTrainerIcon(specialty) {
    const iconMap = {
        "Strength Training": "💪",
        "Yoga & Flexibility": "🧘",
        "Weight Loss": "⚖️",
        "CrossFit": "🏋️",
        "Sports Performance": "🏃",
        "Post-Rehab Training": "🩺",
        "Senior Fitness": "🧓",
        "Prenatal/Postnatal": "🤰"
    };
    return iconMap[specialty] || "👤";
}
});