// Retrieve the saved API Server URL from the plugin
parent.postMessage({ pluginMessage: { type: "get-api-url" } }, "*");

// Set the initial value of the API Server URL input field
window.addEventListener("message", (event) => {
  const message = event.data.pluginMessage;
  if (message && message.type === "set-api-url") {
    document.getElementById("apiUrl").value = message.apiUrl;
  }
});

document.getElementById("generate").onclick = () => {
  const textbox = document.getElementById("eventID");
  const eventID = textbox.value;
  parent.postMessage(
    { pluginMessage: { type: "generate-certificate", eventID } },
    "*"
  );
};

document.getElementById("cancel").onclick = () => {
  parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
};

// Show the settings page when the Settings button is clicked
document.getElementById("settings").onclick = () => {
  document.getElementById("settingsPage").style.display = "block";
};

document.getElementById("saveSettings").onclick = () => {
  const apiUrlTextbox = document.getElementById("apiUrl");
  const apiUrl = apiUrlTextbox.value;

  parent.postMessage(
    { pluginMessage: { type: "save-settings", apiUrl } },
    "*"
  );
};
