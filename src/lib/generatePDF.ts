import type { InstagramProfile } from "./instagram";

/**
 * Download PDF by opening the server endpoint in a new tab.
 * The server generates the PDF and returns it with Content-Disposition: attachment.
 * This method works in ALL browsers, iframes, sandboxes — no blob tricks needed.
 */
export async function generateProfilePDF(
  profile: InstagramProfile,
): Promise<boolean> {
  try {
    const username = (profile.username || "").replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
    if (!username) return false;

    // Simply open the GET endpoint — browser handles the download natively
    window.open(
      `/api/generate-pdf?username=${encodeURIComponent(username)}`,
      "_blank"
    );

    return true;
  } catch (err) {
    console.error("PDF download failed:", err);
    return false;
  }
}
