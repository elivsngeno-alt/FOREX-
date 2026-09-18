const enterButton =
  document.getElementById("enterBot");

const status =
  document.getElementById("status");


enterButton.addEventListener("click", function () {

  status.textContent =
    "🔵 Preparing ELISY254 DOLLARS ZONE...";

  enterButton.style.boxShadow =
    "0 0 50px rgba(30,170,255,1)";


  setTimeout(function () {

    /*
      NEXT STEP:

      This button will eventually open:

      /login.html

      or

      /enter-key.html

      The real MT5 connection and AI system
      will NOT be placed inside this frontend.
    */

    status.textContent =
      "🔵 ENTER KEY SYSTEM READY";

  }, 1000);

});
