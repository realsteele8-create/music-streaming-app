# Memory Lane Radio - Backend Setup Guide

## Overview

The backend consists of:
1. **Firebase Realtime Database** - For user data, chat, analytics
2. **Icecast Server** - For music streaming
3. **OBS Studio** - For broadcasting music to Icecast

---

## Part 1: Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "memory-lane-radio"
4. Enable Google Analytics (optional)
5. Click "Create Project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Click **Email/Password**
4. Toggle on "Enable"
5. Click **Save**

### Step 3: Create Realtime Database

1. Go to **Realtime Database**
2. Click **Create Database**
3. Choose region (closest to you)
4. Start in **Test Mode** (for development)
5. Click **Enable**

### Step 4: Set Database Security Rules

Replace the default rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child($uid).child('role').val() === 'dj'",
        ".write": "$uid === auth.uid"
      }
    },
    "stream": {
      ".read": true,
      "status": {
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'dj'"
      }
    },
    "chat": {
      ".read": true,
      "$messageId": {
        ".write": "root.child('users').child(auth.uid).child('role').val() === 'dj' || newData.child('userId').val() === auth.uid"
      }
    },
    "analytics": {
      ".read": "root.child('users').child(auth.uid).child('role').val() === 'dj'",
      ".write": true
    },
    "dj_codes": {
      ".read": false,
      ".write": false
    }
  }
}
```

### Step 5: Get Firebase Config

1. In Firebase Console, go to **Project Settings**
2. Scroll to "Your apps"
3. Click the web icon </>
4. Copy the config object
5. Create `.env` file in root directory:

```
FIREBASE_API_KEY=YOUR_API_KEY
FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
FIREBASE_DATABASE_URL=YOUR_DATABASE_URL
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Part 2: Icecast Streaming Server Setup

### Installation

**Windows:**
- Download: https://icecast.org/download/
- Run installer
- Start Icecast from Start Menu
- Default URL: `http://localhost:8000`

**Mac:**
```bash
brew install icecast
```

**Linux:**
```bash
sudo apt-get install icecast2
sudo systemctl start icecast2
```

### Configuration

1. Find Icecast config file:
   - **Windows**: `C:\Program Files\Icecast2\etc\icecast.xml`
   - **Mac**: `/usr/local/etc/icecast.xml`
   - **Linux**: `/etc/icecast2/icecast.xml`

2. Open config and update:

```xml
<hostname>localhost</hostname>
<port>8000</port>
<source-password>CHANGE_ME</source-password>
<relay-password>CHANGE_ME</relay-password>
<admin-password>CHANGE_ME</admin-password>
```

3. Restart Icecast

---

## Part 3: Broadcasting with OBS Studio

### Step 1: Download OBS Studio

- Download: https://obsproject.com/
- Install on your computer

### Step 2: Add Audio Source

1. Open OBS Studio
2. In **Sources**, click **+** to add
3. Choose **Audio Input Capture** or **Application Audio Capture**
4. Select your music player or microphone

### Step 3: Configure Stream Settings

1. Go to **Settings** → **Stream**
2. Set **Service** to "Custom"
3. Set **Server**: `rtmp://localhost:1935/live`
4. Set **Stream Key**: `memory_lane`
5. Click **OK**

### Step 4: Start Streaming

1. Click **Start Streaming**
2. Music will broadcast to `http://localhost:8000/stream`
3. Users can listen via the app

---

## Part 4: Create DJ Account

### Generate DJ Code

1. In Firebase Console, go to **Realtime Database**
2. Click **+** to add data
3. Create structure:
   ```
   dj_codes/
     UNIQUE_DJ_CODE_HERE: true
   ```
4. Example DJ code: `MEMORY_LANE_DJ_2024`

### First Login

1. Open app
2. Click **DJ** tab
3. Enter email, password (create new)
4. Paste DJ code
5. Click **DJ Login**

---

## Part 5: Create Test User Account

1. Open app
2. Click **Listener** tab
3. Click **"Don't have an account? Sign up"**
4. Enter email, password, display name
5. Create account
6. Login as listener

---

## Troubleshooting

### Stream not connecting?

- [ ] Icecast is running (check http://localhost:8000)
- [ ] OBS is streaming
- [ ] Firewall allows localhost connections
- [ ] Check stream URL in app: `http://localhost:8000/stream`

### No listeners showing?

- [ ] Firebase Realtime Database is enabled
- [ ] `stream/status/listeners` path exists in database
- [ ] DJ is logged in and stream is set to LIVE

### Chat not working?

- [ ] Firebase Authentication is enabled
- [ ] Database rules allow chat writes
- [ ] User is logged in

---

## Next Steps

1. Set up Firebase project
2. Configure Icecast on your computer
3. Install OBS Studio
4. Create DJ account
5. Start broadcasting!
6. Download app and test as listener

Have fun! 🎵🇯🇲
