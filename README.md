# 🎵 Memory Lane Radio

A retro reggae-inspired live music streaming and radio app with live chat, DJ controls, and listener analytics.

## Features

✨ **Live Music Streaming** - Broadcast live or pre-recorded music  
💬 **Live Chat** - Real-time chat with profanity filter  
👥 **Listener Count** - See how many people are tuned in  
🎧 **DJ Dashboard** - Analytics, chat moderation, and stream controls  
🔐 **Secure Authentication** - DJ and user login systems  

## Tech Stack

- **Frontend**: React Native (iOS & Android)
- **Backend**: Node.js + Express
- **Database**: Firebase Realtime Database
- **Streaming**: Icecast (free, open-source)
- **UI**: Jamaican-inspired retro reggae colors

## Jamaican Color Scheme

- **Primary Gold**: `#FFD700`
- **Secondary Green**: `#008000`
- **Accent Black**: `#000000`
- **Background Cream**: `#FFF8DC`
- **Text Dark**: `#1A1A1A`

## Setup Instructions

### 1. Install Icecast (Music Streaming Server)

**Windows:**
- Download from: https://icecast.org/download/
- Install and run Icecast server
- Default URL: `http://localhost:8000`

**Mac:**
```bash
brew install icecast
icecast -c /usr/local/etc/icecast.xml
```

**Linux:**
```bash
sudo apt-get install icecast2
sudo systemctl start icecast2
```

### 2. Broadcast Music to Icecast

Use **OBS Studio** (free):
- Download: https://obsproject.com/
- Add audio source (your music files or microphone)
- Set streaming to: `rtmp://localhost:1935/live`
- Stream to Icecast mount point: `/stream`

Or use **Liquidsoap** (simpler, command-line):
```bash
brew install liquidsoap
```

### 3. Install App Dependencies

```bash
npm install
npx react-native doctor
```

### 4. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Project Structure

```
memory-lane-radio/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DJDashboard.js
│   │   ├── PlayerScreen.js
│   │   └── ChatScreen.js
│   ├── components/
│   │   ├── Player.js
│   │   ├── ChatBox.js
│   │   ├── ListenerCount.js
│   │   └── Profanity Filter.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── streamingService.js
│   │   ├── chatService.js
│   │   └── analyticsService.js
│   └── App.js
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── .env.example
└── README.md
```

## Next Steps

1. Install Icecast on your computer
2. Test the streaming setup
3. Create a Firebase project for the backend
4. Run the app on your phone/emulator

---

**Made with 🎶 for Memory Lane Radio**