function showCustomAlert(message) {
    const alertBox = document.getElementById("customAlert");
    const alertMessage = document.getElementById("customAlertMessage");
    const overlay = document.getElementById("blurOverlay");

    alertMessage.textContent = message;
    alertBox.classList.add("show");
    overlay.classList.add("show");
}

function hideCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    const overlay = document.getElementById("blurOverlay");

    alertBox.classList.remove("show");
    overlay.classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".signup_form");
    const auIdInput = form.querySelector('input[placeholder="AU ID"]');
    const passwordInput = form.querySelector('input[placeholder="Password"]');

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const auId = auIdInput.value.trim();
        const password = passwordInput.value.trim();

        const userData = sessionStorage.getItem(auId);

        if (!userData) {
            showCustomAlert("❌ Account not found. Please sign up first.");
            return;
        }

        const userInfo = JSON.parse(userData);

        if (userInfo.password !== password) {
            showCustomAlert("🔐 Incorrect password. Please try again.");
            return;
        }

        const role = userInfo.role;
        if (role === "trainer") {
            window.location.href = `/trainer?auid=${encodeURIComponent(auId)}`;
        } else if (role === "trainee") {
            window.location.href = `/trainee?auid=${encodeURIComponent(auId)}`;
        } else {
            showCustomAlert("⚠️ Unknown role. Please contact support.");
        }
    });

    const okBtn = document.getElementById("customAlertOkBtn");
    okBtn.addEventListener("click", hideCustomAlert);
});
