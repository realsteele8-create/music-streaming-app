import { db } from './authService';

// Log user session
export const logUserSession = async (userId, displayName) => {
  try {
    const sessionRef = db.ref('analytics/sessions').push();
    await sessionRef.set({
      userId,
      displayName,
      joinedAt: new Date().getTime(),
      leftAt: null,
    });
    return { success: true, sessionId: sessionRef.key };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// End user session
export const endUserSession = async (sessionId) => {
  try {
    await db.ref('analytics/sessions/' + sessionId + '/leftAt').set(new Date().getTime());
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get analytics (DJ only)
export const getAnalytics = async () => {
  try {
    const sessionsSnapshot = await db.ref('analytics/sessions').once('value');
    const sessions = sessionsSnapshot.val() || {};
    
    let totalSessions = 0;
    let activeSessions = 0;
    let totalListeningTime = 0;
    
    Object.values(sessions).forEach((session) => {
      totalSessions++;
      if (!session.leftAt) {
        activeSessions++;
      } else {
        totalListeningTime += (session.leftAt - session.joinedAt) / 1000 / 60; // minutes
      }
    });
    
    return {
      success: true,
      data: {
        totalSessions,
        activeSessions,
        averageListeningTime: totalListeningTime / totalSessions || 0,
        peakListeners: 0, // To be calculated from stream status history
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get listener history (for charts)
export const getListenerHistory = async (hours = 24) => {
  try {
    const now = new Date().getTime();
    const timeFrame = hours * 60 * 60 * 1000;
    
    const snapshot = await db.ref('analytics/listenerHistory')
      .orderByChild('timestamp')
      .startAt(now - timeFrame)
      .once('value');
    
    const history = [];
    snapshot.forEach((childSnapshot) => {
      history.push({
        timestamp: childSnapshot.val().timestamp,
        listeners: childSnapshot.val().listeners,
      });
    });
    
    return { success: true, data: history };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Log song play
export const logSongPlay = async (title, artist) => {
  try {
    await db.ref('analytics/songHistory').push().set({
      title,
      artist,
      playedAt: new Date().getTime(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
