# Group Chat Mock (React Native + Expo)

This is a small mock app built with React Native (Expo) to demonstrate a group-work chat with the ability to "like" messages. Liked messages are shown in a Calendar-like view and a Notes view.

Features
- Login screen (mock)
- Create group (invite-only by default)
- Join group by ID
- Chat inside group, like/unlike messages
- Calendar screen showing liked messages grouped by date
- Notes screen listing liked messages

Run locally
1. Install Expo CLI (if you don't have it):

```bash
npm install -g expo-cli
```

2. Install dependencies:

```bash
cd /Users/sasimas/Documents/lap test27
npm install
```

3. Start the project:

```bash
npm start
```

Persistence (optional)
 - This project can persist app state (user and groups) using AsyncStorage. The code uses `@react-native-async-storage/async-storage` via `src/utils/storage.js` and persists `app:user` and `app:groups` automatically.
 - To enable this locally you must install the dependency:

```bash
npm install @react-native-async-storage/async-storage
```

 - After installing, reload the app. The app will restore user and groups from storage on start and save changes automatically.

Open in Expo Go on your iOS device or simulator.

Notes & Assumptions
- This project uses mock data located at `src/mock/data.js` and a simple `AppContext` to manage state in memory.
- Groups are created as invite-only (flag set). For demo purposes, the Join screen allows joining by group ID.
- No backend or persistent storage is included. This is a front-end mock demonstrating UI flows and state logic.

Next steps (optional):
- Wire to a real backend (Firebase, Supabase, or a custom API)
- Add real invite flow (invite links, codes)
- Improve UI/UX and accessibility
