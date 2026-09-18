const API_URL = "https://elisy254-bot-backend.onrender.com";

async function enterKey() {
    const key = prompt("🔐 Enter your ELISY254 access key:");

    if (!key) {
        return;
    }

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
            alert("✅ ACCESS GRANTED");

            localStorage.setItem(
                "elisy254_session",
                data.token
            );

            window.location.href = "dashboard.html";
        } else {
            alert("❌ " + data.message);
        }

    } catch (error) {
        console.error(error);

        alert(
            "❌ Cannot connect to ELISY254 backend."
        );
    }
}
