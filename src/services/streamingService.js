import { db } from './authService';

// Stream Configuration
export const STREAM_URL = 'http://localhost:8000/stream'; // Default Icecast URL

// Get stream status
export const getStreamStatus = async () => {
  try {
    const snapshot = await db.ref('stream/status').once('value');
    return snapshot.val() || { isLive: false, listeners: 0 };
  } catch (error) {
    console.error('Error fetching stream status:', error);
    return { isLive: false, listeners: 0 };
  }
};

// Listen to stream status changes (real-time)
export const listenToStreamStatus = (callback) => {
  const statusRef = db.ref('stream/status');
  statusRef.on('value', (snapshot) => {
    callback(snapshot.val() || { isLive: false, listeners: 0 });
  });
  
  return () => statusRef.off();
};

// Update listener count
export const updateListenerCount = async (count) => {
  try {
    await db.ref('stream/status/listeners').set(count);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Set stream live status
export const setStreamStatus = async (isLive) => {
  try {
    await db.ref('stream/status/isLive').set(isLive);
    await db.ref('stream/status/lastUpdated').set(new Date().getTime());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current song info
export const getCurrentSong = async () => {
  try {
    const snapshot = await db.ref('stream/currentSong').once('value');
    return snapshot.val() || { title: 'No song playing', artist: 'Memory Lane Radio' };
  } catch (error) {
    console.error('Error fetching current song:', error);
    return { title: 'No song playing', artist: 'Memory Lane Radio' };
  }
};

// Update current song (DJ only)
export const updateCurrentSong = async (title, artist) => {
  try {
    await db.ref('stream/currentSong').set({
      title,
      artist,
      updatedAt: new Date().getTime(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
