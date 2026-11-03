# Connect Mekhi Studio to the Parent Google Sheet

**The dashboard already exists:** [Mekhi | Learning Progress Dashboard](https://docs.google.com/spreadsheets/d/1bc3LV6I1S9mpJaWSsGD26ST6STUMnPImUpFk__g6OFA/edit)

**Current status:** The website and parent dashboard exist, but automatic syncing is not active until these one-time steps are completed.

## Set up the Google authorization

1. Sign in to the Google account with editing access to the parent Dashboard.
2. Open the dashboard above, select **Extensions → Apps Script**. This creates a spreadsheet-bound script.
3. Open [server/Code.gs](https://github.com/inclusivityinstitute/mekhistudio/blob/main/server/Code.gs) and copy its **entire source code**.
4. In Apps Script, replace the starter code in **Code.gs**, paste the source and click **Save**.
5. Choose the **setupMekhiSync** function from the function menu. Click **Run** and approve Google's permissions.
6. In the **Execution log**, find the line beginning **SYNC TOKEN**. Copy that token privately. **Do not paste it into ChatGPT, email or GitHub.**
7. Choose **Deploy → New deployment**. Select type **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Deploy, authorize if asked, and copy the web app's **/exec** URL.

## Activate it on Mekhi's iPhone

1. Open the hosted Mekhi Studio website in Safari.
2. Go to **Settings** (or open the studio URL with `#settings` appended).
3. Paste the **/exec** URL and private token into the Google Sheets synchronization section.
4. Turn on automatic result submission, select **Save sync settings**, then **Send a test result**.
5. Confirm that the app reports a successful test. A test does not add a row.
6. Have Mekhi complete a new lesson. Open the parent dashboard and confirm a new row appears in **Submission Log**.
7. Select **Retry unsent results** in Studio to send previous unsynced Studio v2 lesson attempts.

## What goes into Google Sheets

Only minimal metadata: completion date, lesson code, area, title, knowledge-check score, whether Mekhi started independently, support level and practical-review status. Photographs, written personal responses, the psychological report, identity documents, bank data and emergency contact details **must not be uploaded through this endpoint**.

**Privacy:** Anyone can access the web app URL, but submissions require the private long token. This is appropriate for a family educational prototype only, not for sensitive information or strong identity-based access control.

## If it doesn't work

- A Google Workspace administrator may prohibit publishing a web app with access **Anyone**. Do not disable organizational security protections. Use a personal Google account with editor access if permitted or use manually exported CSV files.
- An iPhone browser may block some embedded cross-site responses. Test an actual new submission in the sheet rather than relying on a success message.
- If any score fails to appear, keep the local results. Use **Retry unsent results** once the connection has been fixed.
- Never share the token or paste it in the repository, Netlify site, or calendar events.
