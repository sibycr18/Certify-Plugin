figma.showUI(__html__);

async function getApiUrl() {
  const data = await figma.clientStorage.getAsync("apiUrl");
  return data?.apiUrl || "";
}

async function setApiUrl(apiUrl: string) {
  await figma.clientStorage.setAsync("apiUrl", { apiUrl });
}

async function changeTextContent(textboxName: string, newContent: string) {
  const nodes = figma.currentPage.findAll((node) => node.name === textboxName);

  for (const node of nodes) {
    if (node.type === "TEXT") {
      await figma.loadFontAsync(node.fontName as FontName);
      node.characters = newContent;
    }
  }
}

async function getCertificateDetails(apiUrl: string, eventID: string) {
  try {
    const headers = {
      "API-Auth-Key": "random_key",
    };
    const response = await fetch(`${apiUrl}/${eventID}`, { headers });
    console.log(response);
    const certificateDetails = await response.json();

    return certificateDetails;
  } catch (error) {
    figma.closePlugin(
      "Error fetching certificate details. Please check the Event ID."
    );
    return error;
  }
}

// Retrieve the API Server URL from clientStorage
getApiUrl().then((apiUrl) => {
  // Use the apiUrl variable in your API requests

  // Example usage:
  // const response = await getCertificateDetails(apiUrl, eventID);
  // if (response instanceof Error) {
  //   figma.closePlugin(response.message);
  // } else {
  //   // Process the response
  // }
});

// Handle messages from the UI
figma.ui.onmessage = async (message) => {
  if (message.type === "generate-certificate") {
    const apiUrl = await getApiUrl();
    const response = await getCertificateDetails(apiUrl, message.eventID);
    if (response instanceof Error) {
      figma.closePlugin(response.message);
    } else {
      const eventDetails = response["event"];
      const participantDetails = response["participants"];

      // Addition of event details
      for (const key in eventDetails) {
        const value = eventDetails[key];
        await changeTextContent(`<event_${key}>`, value);
      }
    }
  } else if (message.type === "cancel") {
    figma.closePlugin();
  } else if (message.type === "save-settings") {
    const { apiUrl } = message;
    setApiUrl(apiUrl).then(() => {
      figma.notify("Settings saved successfully!");
    });
  }
};
