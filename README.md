# Rent Ledger

Rent Ledger is a lightweight, single-page rent-management app for landlords. It tracks tenants, rent payments, due dates, agreements, and reminders, with optional account-based cloud sync.

## Features

- Keep tenant contact details, rent, due day, flat/room, agreement dates, deposit, notes, and an optional photo.
- See current-month due status, overdue balances, monthly received/pending totals, and payment history.
- Record full or partial payments, including payments for past months.
- Generate receipts that can be copied, printed/saved as PDF, or shared through WhatsApp.
- Compose rent and renewal reminders and open them in WhatsApp. The app does not send messages automatically; you review and send them in WhatsApp.
- Show creator attribution in the footer with direct call and WhatsApp contact buttons for development inquiries.
- Read a collapsible About section describing the app and its data flow.
- Export and import a JSON backup.
- Use browser-only storage, or sign in to sync a ledger through Supabase.
- Install the responsive app on a phone's home screen as a PWA.

## Run the app

The app is a static HTML page; there is no build step or package installation.

1. Open `index.html` in a modern browser, or serve the project directory with any static web server.
2. Without a configured/available Supabase client, the app loads its browser-local ledger.
3. When Supabase is available, sign in or create an account to use cloud sync.

The page loads Supabase JS from jsDelivr and fonts from Google Fonts. Those resources require internet access. WhatsApp features open `wa.me` links and require a browser/device capable of opening WhatsApp.

## Use it on a phone

The app includes a responsive mobile layout and installable PWA shell. Deploy it over HTTPS (or use `localhost` during development), then:

- **Android:** open the site in Chrome and choose **Install app** when the prompt appears, or use the browser menu's install option.
- **iPhone/iPad:** open the site in Safari, tap **Share**, then **Add to Home Screen**.

The service worker caches the app shell so it can reopen offline. Supabase sign-in and cloud sync still require an internet connection; offline operation is not a replacement for cloud backup.

## Data and privacy

- Browser-only data is stored in `localStorage` under `rentLedger.v2`. Signed-in data is cached under an account-specific key in the same browser.
- Cloud sync stores each user's complete ledger as JSON in one `ledgers` row. See [the database diagram](docs/database.md).
- The Supabase anonymous key included in a browser app is public by design; it is not a secret. The Supabase project must enforce per-user access with Row Level Security (RLS) policies on `ledgers`. Do not rely on client-side filtering as access control.
- Tenant details and optional photos are stored in the ledger. Protect the device/browser account and restrict cloud access appropriately.
- Export backups may contain personal information. Store and share them carefully.
- Importing a backup replaces the current ledger data for the active storage scope.
- Cloud updates are debounced and use the ledger's `updated_at` timestamp to choose between the local copy and cloud copy at sign-in. This is not a field-level merge or conflict-resolution system.

## Project layout

```text
index.html          UI, styles, application logic, local persistence, and Supabase integration
manifest.webmanifest Installable app metadata
service-worker.js   App-shell caching for PWA launch
icons/              App icons
docs/
  architecture.md   Runtime architecture diagram and flow
  database.md       Persisted-data model and database diagram
```

## Diagrams

- [Architecture diagram](docs/architecture.md)
- [Database diagram](docs/database.md)

## License

See [LICENSE](LICENSE).
