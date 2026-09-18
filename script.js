const API_URL =
  "https://elisy254-bot-backend.onrender.com";


let botRunning = false;


/*
==================================================
HELPER
==================================================
*/

async function apiRequest(
  endpoint,
  options = {}
) {

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      }
    );

  let data;

  try {

    data = await response.json();

  } catch {

    data = {
      success: false,
      message: "Invalid server response"
    };

  }

  if (!response.ok) {

    throw new Error(
      data.message ||
      `HTTP ${response.status}`
    );

  }

  return data;
}


/*
==================================================
BOT STATUS
==================================================
*/

async function loadBotStatus() {

  try {

    const data =
      await apiRequest(
        "/api/bot/status"
      );


    document
      .getElementById("connectionStatus")
      .textContent =
      "🟢 RENDER ONLINE";


    botRunning =
      Boolean(data.running);


    updateBotUI();


    if (data.lot !== undefined) {

      document
        .getElementById("lotSize")
        .value =
        data.lot;

    }


    if (
      data.maxOpenTrades !== undefined
    ) {

      document
        .getElementById("maxTrades")
        .value =
        data.maxOpenTrades;

    }


    if (data.balance !== undefined) {

      document
        .getElementById("balance")
        .textContent =
        `$${Number(data.balance).toFixed(2)}`;

    }


    if (data.openTrades !== undefined) {

      document
        .getElementById("openTrades")
        .textContent =
        data.openTrades;

    }


  } catch (error) {

    console.error(
      "Bot status error:",
      error
    );


    document
      .getElementById("connectionStatus")
      .textContent =
      "🔴 OFFLINE";

  }

}


/*
==================================================
BOT UI
==================================================
*/

function updateBotUI() {

  const status =
    document.getElementById(
      "botStatus"
    );


  const button =
    document.getElementById(
      "botButton"
    );


  if (botRunning) {

    status.textContent =
      "RUNNING";

    status.style.color =
      "#55ffb0";


    button.textContent =
      "⏹ STOP BOT";

    button.classList.add(
      "stop-button"
    );

  } else {

    status.textContent =
      "STOPPED";

    status.style.color =
      "#ffcf45";


    button.textContent =
      "▶ START BOT";

    button.classList.remove(
      "stop-button"
    );

  }

}


/*
==================================================
START / STOP BOT
==================================================
*/

async function toggleBot() {

  const action =
    botRunning
      ? "stop"
      : "start";


  const message =
    document.getElementById(
      "botMessage"
    );


  message.textContent =
    "🔵 Sending request...";


  try {

    const data =
      await apiRequest(
        `/api/bot/${action}`,
        {
          method: "POST"
        }
      );


    if (data.success) {

      botRunning =
        Boolean(data.running);


      updateBotUI();


      message.textContent =
        data.message ||
        (
          botRunning
            ? "Bot started."
            : "Bot stopped."
        );

    } else {

      message.textContent =
        "❌ Request failed";

    }


  } catch (error) {

    console.error(
      "Bot control error:",
      error
    );


    message.textContent =
      `❌ ${error.message}`;

  }

}


/*
==================================================
ANALYSIS MODE
==================================================

Confirmed backend endpoint:

GET /api/analysis-mode/mode

Expected response:

{
  success: true,
  mode: "ENGINE",
  availableModes: [
    "ENGINE",
    "AI",
    "HYBRID"
  ]
}

==================================================
*/

async function loadAnalysisMode() {

  const modeElement =
    document.getElementById(
      "analysisMode"
    );


  const description =
    document.getElementById(
      "modeDescription"
    );


  modeElement.textContent =
    "LOADING...";


  try {

    const data =
      await apiRequest(
        "/api/analysis-mode/mode"
      );


    if (!data.success) {

      throw new Error(
        data.message ||
        "Unable to read analysis mode"
      );

    }


    const mode =
      String(
        data.mode || "ENGINE"
      ).toUpperCase();


    modeElement.textContent =
      mode;


    /*
    ----------------------------------------------
    Mode description
    ----------------------------------------------
    */

    if (mode === "ENGINE") {

      description.textContent =
        "🔵 Engine analysis is active. No paid AI API is required.";

    }

    else if (mode === "AI") {

      description.textContent =
        "🤖 AI analysis is active.";

    }

    else if (mode === "HYBRID") {

      description.textContent =
        "🔵🤖 Engine + AI hybrid analysis is active.";

    }

    else {

      description.textContent =
        "Analysis mode received from backend.";

    }


    /*
    ----------------------------------------------
    Available modes
    ----------------------------------------------
    */

    const availableModes =
      Array.isArray(
        data.availableModes
      )
        ? data.availableModes
        : [];


    setModeAvailability(
      "engineStatus",
      availableModes.includes(
        "ENGINE"
      )
    );


    setModeAvailability(
      "aiStatus",
      availableModes.includes(
        "AI"
      )
    );


    setModeAvailability(
      "hybridStatus",
      availableModes.includes(
        "HYBRID"
      )
    );


  } catch (error) {

    console.error(
      "Analysis mode error:",
      error
    );


    modeElement.textContent =
      "OFFLINE";


    description.textContent =
      "❌ Cannot read analysis mode from backend.";

  }

}


/*
==================================================
MODE AVAILABILITY UI
==================================================
*/

function setModeAvailability(
  elementId,
  available
) {

  const element =
    document.getElementById(
      elementId
    );


  if (!element) {
    return;
  }


  element.textContent =
    available
      ? "AVAILABLE"
      : "UNAVAILABLE";


  element.classList.toggle(
    "mode-available",
    available
  );


  element.classList.toggle(
    "mode-unavailable",
    !available
  );

}


/*
==================================================
 MARKET / ENGINE / AI ANALYSIS
==================================================
*/

async function loadAnalysis() {

  const text =
    document.getElementById(
      "analysisText"
    );


  text.textContent =
    "🔵 Requesting market analysis...";


  try {

    const data =
      await apiRequest(
        "/api/analysis/latest"
      );


    if (!data.success) {

      throw new Error(
        data.message ||
        "No analysis available"
      );

    }


    const analysis =
      data.analysis || {};


    /*
    ----------------------------------------------
    Direction
    ----------------------------------------------
    */

    document
      .getElementById("direction")
      .textContent =
      analysis.direction ||
      "WAIT";


    /*
    ----------------------------------------------
    AI model results
    ----------------------------------------------
    */

    const models =
      analysis.models || {};


    document
      .getElementById("chatgpt")
      .textContent =
      models.chatgpt ||
      "WAITING";


    document
      .getElementById("gemini")
      .textContent =
      models.gemini ||
      "WAITING";


    document
      .getElementById("claude")
      .textContent =
      models.claude ||
      "WAITING";


    document
      .getElementById("deepseek")
      .textContent =
      models.deepseek ||
      "WAITING";


    /*
    ----------------------------------------------
    Analysis message
    ----------------------------------------------
    */

    text.textContent =
      analysis.message ||
      "Analysis received from backend.";


    /*
    ----------------------------------------------
    If backend returns its mode with analysis,
    show it too.
    ----------------------------------------------
    */

    if (analysis.mode) {

      document
        .getElementById(
          "analysisMode"
        )
        .textContent =
        String(
          analysis.mode
        ).toUpperCase();

    }


  } catch (error) {

    console.error(
      "Analysis error:",
      error
    );


    text.textContent =
      `❌ ${error.message}`;

  }

}


/*
==================================================
SETTINGS
==================================================
*/

async function saveSettings() {

  const lot =
    document.getElementById(
      "lotSize"
    ).value;


  const maxTrades =
    document.getElementById(
      "maxTrades"
    ).value;


  const message =
    document.getElementById(
      "settingsMessage"
    );


  /*
  IMPORTANT:
  We display the selected settings here.

  We do not invent a backend endpoint for saving
  settings because your confirmed backend API
  endpoint was not provided.
  */

  message.textContent =
    `💾 Settings selected: Lot ${lot}, Max trades ${maxTrades}`;

}


/*
==================================================
QUICK MENU
==================================================
*/

function showComingSoon(name) {

  alert(
    `🔵 ${name} module will be connected next.`
  );

}


/*
==================================================
LOGOUT
==================================================
*/

function logout() {

  localStorage.removeItem(
    "elisy254_session"
  );


  window.location.href =
    "index.html";

}


/*
==================================================
STARTUP
==================================================
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadBotStatus();

    loadAnalysisMode();

    loadAnalysis();

  }
);
