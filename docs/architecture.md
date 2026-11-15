# Architecture

Rent Ledger is implemented as a single static page. The UI, business rules, local persistence, authentication, and cloud-sync client are all in `index.html`; there is no separate application server in this repository.

```mermaid
flowchart TD
    User[Landlord / user]
    Browser[Web browser]
    App[Rent Ledger<br/>index.html: UI + application logic]
    PWA[Web app manifest + service worker<br/>cached app shell]
    Local[(Browser localStorage<br/>ledger JSON + timestamp)]
    SupabaseJS[Supabase JS client<br/>loaded from CDN]
    Auth[Supabase Auth]
    Ledger[(Supabase ledgers table<br/>one JSON record per user)]
    WhatsApp[WhatsApp wa.me]
    Phone[Phone dialer]
    CDN[Google Fonts + jsDelivr]
    Backup[JSON backup file]

    User -->|uses| Browser
    Browser --> App
    Browser --> PWA
    PWA -->|cache static app shell| Browser
    App -->|read/write cache| Local
    App -->|sign in / sign up| SupabaseJS
    SupabaseJS --> Auth
    App -->|debounced upsert / load ledger| SupabaseJS
    SupabaseJS --> Ledger
    App -->|open prefilled reminder, receipt, or developer inquiry| WhatsApp
    App -->|developer contact call link| Phone
    App -->|export / import| Backup
    Browser -->|downloaded dependencies| CDN
```

## Runtime flow

1. On startup, the app checks whether the Supabase client is available. If it is unavailable, the browser-local ledger is loaded.
2. When Supabase is available, the sign-in overlay is shown. A valid session selects an account-specific local-storage key and loads the cached ledger.
3. The app fetches the signed-in user's `ledgers` row. If the cloud timestamp is newer than the local timestamp, cloud JSON replaces the local cache; otherwise the local ledger is uploaded. A first sign-in can optionally move the legacy browser-only ledger into the account.
4. Changes are saved to local storage immediately. Authenticated changes are uploaded to Supabase after a short debounce.
5. Reminder and receipt actions construct a WhatsApp URL with a prefilled message. The user must send the message in WhatsApp.

## Deployment notes

- Serve the app from an HTTPS static web host for mobile installation; `localhost` is supported for development.
- The service worker caches the same-origin app shell only. Authentication, cloud sync, fonts, and messaging integrations still need network access.
- Cloud features depend on the Supabase project configured in the page and the expected `ledgers` table. The project's Row Level Security policies should ensure users can only access their own row.
- No backend/API server or server-side job is part of this repository.
