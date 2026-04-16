# Power Automate Notification Flow

This app can now send workflow notifications directly to a Power Automate cloud flow by HTTP.

## Trigger Events

The app sends one of these `eventType` values:

- `stage_start`
- `ready_for_approval`
- `document_approved`
- `document_rejected`

## Flow Shape

Recommended flow:

1. Create an automated cloud flow with the trigger `When an HTTP request is received`.
2. Paste the schema from [power-automate-notification-schema.json](./power-automate-notification-schema.json).
3. Add a `Switch` on `eventType`.
4. For each case, add notification actions such as:
   - `Send an email (V2)` with Outlook
   - `Post message in a chat or channel` in Teams
   - `Create item` in SharePoint for audit/escalation tracking
5. End the flow with a `Response` action returning HTTP `202`.

## Suggested Email Mapping

Use these fields in the flow:

- To: `recipients.to`
- Cc: `recipients.cc`
- Reply-To: `recipients.replyTo`
- Subject: `message.subject`
- Body: `message.body`

Useful dynamic content:

- Document ID: `document.id`
- Document Title: `document.title`
- Current Stage: `document.currentStage`
- Next Stage: `document.nextStage`
- Document Link: `document.link`
- Action User: `actionUser.fullName`

## App Configuration

In `Notifications and Escalations`:

1. Set `Delivery Mode` to `Power Automate HTTP Flow`.
2. Paste the flow's HTTP POST URL into `Delivery Endpoint URL`.
3. Save notification rules.

The app will POST a JSON payload directly to that flow URL. If the flow endpoint fails, the message is still queued into the app's local outbox as fallback.

## Example Response

The flow should return a simple success response, for example:

```json
{
  "status": "accepted"
}
```

## Notes

- The app does not require the Node Outlook relay when using Power Automate mode.
- Recipient resolution still happens in the app before the flow is called.
- If you want the flow to decide recipients instead, change the flow to ignore `recipients.*` and use the document/action metadata only.
