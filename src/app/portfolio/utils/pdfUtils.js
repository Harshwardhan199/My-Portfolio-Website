/**
 * Opens a PDF document (whether standard URL, relative asset path, or Base64 Data URL)
 * cleanly in a new browser window/tab with full native PDF viewer capabilities.
 */
export function openPdfInNewTab(url) {
  if (!url) return;

  // Handle standard HTTP/HTTPS URLs or static site asset paths
  if (!url.startsWith("data:")) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  try {
    // Parse the Data URL (e.g. data:application/pdf;base64,JVBERi0...)
    const parts = url.split(",");
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "application/pdf";
    const base64Data = parts[1];

    // Decode base64 to binary byte array
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob with application/pdf MIME type
    const blob = new Blob([bytes], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    // Open Blob URL in a new window/tab
    const newWindow = window.open(blobUrl, "_blank");

    // If popup was blocked or failed, fall back to triggering link click
    if (!newWindow || newWindow.closed || typeof newWindow.closed === "undefined") {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  } catch (err) {
    console.error("Error generating PDF blob URL:", err);
    // Fallback if Blob creation fails
    window.open(url, "_blank");
  }
}
