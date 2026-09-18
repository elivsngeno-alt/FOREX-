const API_URL = "https://elisy254-bot-backend.onrender.com";

const enterButton = document.getElementById("enterBot");
const status = document.getElementById("status");

enterButton.addEventListener("click", async () => {

    const key = prompt("🔐 Enter your ELISY254 access key:");

    if (!key) {
        return;
    }

    status.textContent = "🔵 Connecting to ELISY254...";

    try {
        const response = await fetch(
            `${API_URL}/api/auth/enter-key`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: key
                })
            }
        );

        const data = await response.json();

        if (data.success) {

            status.textContent = "✅ ACCESS GRANTED";

            localStorage.setItem(
                "elisy254_session",
                data.token
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {

            status.textContent = "❌ " + data.message;
        }

    } catch (error) {

        console.error(error);

        status.textContent =
            "❌ Cannot connect to Render backend.";
    }
});
