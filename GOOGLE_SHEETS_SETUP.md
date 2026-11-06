# Mekhi Studio — enable live reporting to the parent Google Sheet

**Parent dashboard:** https://docs.google.com/spreadsheets/d/1bc3LV6I1S9mpJaWSsGD26ST6STUMnPImUpFk__g6OFA/edit#gid=1065506819

**CURRENT WEBSITE:** https://mekhistudio.netlify.app/

**Legacy fixed-deployment address:** https://6ae9d3a76e9b8ce8832be360--mekhistudio.netlify.app/

The legacy address is frozen and separate from the production website. Safari saves data and Google sync settings independently for these two addresses. Do not erase the old address until unsent work is recovered.

## ONE-TIME step: Update the Apps Script already attached to the Google Sheet

1. Open the parent Google Sheet. Choose **Extensions → Apps Script**.
2. Open the latest complete code here: https://github.com/inclusivityinstitute/mekhistudio/blob/main/server/Code.gs . Click **Raw**, select all, and copy.
3. In Apps Script, **replace all code** in `Code.gs` with the updated source. Save.
4. In the function selector choose `setupMekhiSync`, click **Run**, and approve the new Google Drive and Sheets permissions.
5. Choose **Deploy → Manage deployments**. Edit the existing **Web app** deployment (pencil icon). Choose **New version** and **Deploy**. Using Manage deployments preserves the existing `/exec` URL.
6. Keep the token private. The existing long token from the initial setup is retained by the script; if you do not have it, run `setupMekhiSync` and check the Execution log. Do not send the token by email or chat.
7. On Mekhi's iPhone open **https://mekhistudio.netlify.app/#settings**. Enter the Apps Script `/exec` URL and token, check **Turn on automatic result submission**, then save and click **Send a test result**. The website and old deployment address have separate settings.
8. Select **Retry unsent results**, **Send saved checklist ticks**, and **Retry pending photos**. Then verify the parent sheet receives real rows/checkmarks/photos. A test result by itself does not add a row.

## Recover work done on the OLD deployment address

Do this **on the same iPhone/browser used to complete the work**:

1. Open the original fixed-deployment URL above. Open Settings → **Export backup (JSON)**. Keep the file in Files on the phone.
2. If the old Studio includes a working cloud photo option, try uploading pending photos there before switching; the JSON backup cannot transfer browser-stored image files.
3. Open the CURRENT production website in Safari. Go to Settings → Import a saved backup. Select the JSON file.
4. Enter the Apps Script connection details on the current address, test connection, and retry unsent lessons and saved checklist ticks.
5. For photos that did not upload, use the current Studio's **Take photo** selector to reselect an image from the iPhone Photos library or take a new photo, then verify the private Drive link appears.
6. Keep both websites' browser data until the parent Google Sheet confirms receipt. Do not reset site data or remove the old Home Screen icon before recovery.

## Meaning of each status

- **Submitted ✓** means Google Apps Script acknowledged a lesson, checklist or photo.
- **NOT submitted / pending** means it might have been temporarily retained for recovery, but the parent cannot see it.
- **Parent verified** means an adult separately examined a real-world result.
- **Photo submitted — review** means evidence was uploaded, **not** that the practical skill is independently verified.
- The parent receives only scores, short task labels, checkmarks and private Drive photo links; avoid putting medical reports, passport images, banking details, addresses or other sensitive information in the Studio.

### Privacy

Photos are saved through the deployed Apps Script to a private folder owned by the Google account running the script. The Google Sheet contains a private Drive link. The shared token is a minimal prototype safeguard, not strong per-user authentication; keep it out of GitHub, screenshots, emails and public sites. Do not publish personal emergency or clinical details here.

The parent dashboard can be checked from an Android phone. The existing hourly ChatGPT watch checks the Sheet for new lessons and photo evidence and sends a notification for meaningful updates; that watch does not itself upload Mekhi's work.
