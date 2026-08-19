# Pulse Mobile — Testing Guide

This document explains how to share Pulse Mobile with real users for testing.

---

## Option 1: Expo Go (fastest — no build required)

Testers install the free **Expo Go** app and load Pulse directly from your development server or a published channel. No APK needed.

### What testers need
1. Install **Expo Go** from the App Store (iOS) or Play Store (Android) — it is free.
2. Open Expo Go and scan a QR code or paste a link.

### How to generate the link (you do this once)

1. Make sure your API server is deployed (see the API Server deployment steps).
2. In the Replit shell, start the mobile dev server:
   ```
   pnpm --filter @workspace/pulse-mobile run dev
   ```
3. Replit shows a QR code and a link like:
   ```
   exp://your-repl-domain/pulse-mobile
   ```
4. Share this link (or screenshot the QR code) with testers.
   - iOS testers: scan the QR from the Camera app or Expo Go
   - Android testers: scan from within the Expo Go app

> **Note:** The dev server must be running while testers use the app. For persistent testing without keeping Replit open, use Option 2 (APK) below.

---

## Option 2: Standalone Android APK (shareable download link)

Build a self-contained APK that testers download and install directly — no Expo account required on the tester's side, no Play Store.

### One-time setup

#### Step 1 — Create a free Expo account
1. Go to [expo.dev](https://expo.dev) and sign up (free).
2. Run `pnpm exec eas login` in the Replit shell — EAS will use your logged-in account automatically. No need to set `owner` in `app.json`.

#### Step 2 — Set your API server URL
Deploy the API Server artifact in Replit first (Deployments → API Server → Deploy). Then open `artifacts/pulse-mobile/app.json` and update `extra.apiBaseUrl` to the deployed API origin — **this is the root URL of the API deployment, not the preview path**:
```json
"extra": {
  "apiBaseUrl": "https://your-bloodchain-api.replit.app"
}
```
The mobile API client appends `/api/...` routes automatically, so do **not** include `/api-server` or any sub-path — just the bare origin shown in Replit Deployments for the API Server artifact.

#### Step 4 — Add your Expo token to Replit secrets
1. In [expo.dev](https://expo.dev), go to **Account Settings → Access Tokens** and create a new token.
2. In Replit, open **Secrets** (the 🔒 icon in the sidebar) and add:
   - Key: `EXPO_TOKEN`
   - Value: *(paste your token)*

### Current APK build

> **Build v1.0.0 (preview) is available:**
> https://expo.dev/artifacts/eas/FtHBvqOh8tQf_Qjta5pBk9DpQ8FsTgEJ174zZ3nMWqQ.apk
>
> This link is also shown on the Demo site's Pulse Mobile Beta panel with a **Download APK** button.
> Build expires 2026-09-17 (EAS free tier artifacts expire after 30 days — rebuild to refresh).
> This build includes the live API wiring for registration and the donor dashboard (post-Task 22).

### Building a new APK

`eas-cli` is already installed as a dev dependency in this workspace. In the Replit shell:
```bash
cd artifacts/pulse-mobile
pnpm exec eas build --platform android --profile preview --no-wait
```

EAS will queue the build on Expo's cloud servers (takes ~5–15 minutes). When done, retrieve the URL with:
```bash
pnpm exec eas build:list --platform android --limit 1 --json
```

Then update `PULSE_MOBILE_APK_URL` in `artifacts/demo/src/pages/home.tsx` with the new URL.

Share the URL with testers — they open it on Android and tap **Install** (they may need to allow "Install from unknown sources" in Android settings).

---

## Option 3: iOS Testing (future — requires Apple Developer account)

iOS requires a paid Apple Developer account ($99/yr) for TestFlight distribution. This is out of scope for the current phase. Document for future reference:

1. Enrol in the Apple Developer Program at [developer.apple.com](https://developer.apple.com).
2. Run: `eas build --platform ios --profile preview`
3. Submit to TestFlight: `eas submit --platform ios`

---

## Demo credentials for testers

Tell testers to use these IDs when the app asks:

| Field | Example value |
|---|---|
| Donor ID (existing) | `D-2026-0891`, `D-2026-0892`, `D-2026-0893` |
| Bag number | `BW-2026-008821`, `BW-2026-008822` |
| Facility | `FAC-001` (Princess Marina Hospital, Gaborone) |

Testers can also register a brand-new donor profile — the app will assign a real ID from the national ledger.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| App says "Network Error" on device | The `apiBaseUrl` in `app.json` is wrong or the API server is not deployed. Check deployments. |
| Expo Go says "Something went wrong" | Re-scan the QR code; the dev server may have restarted. |
| EAS build fails with "Not logged in" | Make sure `EXPO_TOKEN` secret is set in Replit and the token is valid. |
| Android says "App not installed" | The device may be blocking unknown sources. Go to Settings → Security → Install unknown apps. |
| EAS says "owner not found" | Run `pnpm exec eas login` and verify you are logged in to the correct account. |
