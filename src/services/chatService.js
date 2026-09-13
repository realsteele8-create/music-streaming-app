import { db } from './authService';
import Filter from 'better-profanity';

const filter = new Filter();

// Add profanity words (can be customized)
filter.addWords('badword1', 'badword2');

// Send chat message
export const sendMessage = async (userId, displayName, message, isDJ = false) => {
  try {
    // Filter profanity
    const cleanMessage = filter.clean(message);
    
    const messageData = {
      userId,
      displayName,
      message: cleanMessage,
      isDJ,
      timestamp: new Date().getTime(),
      isModerated: false,
      flagged: cleanMessage !== message, // Flag if profanity was found
    };
    
    const messageRef = db.ref('chat/' + new Date().getTime());
    await messageRef.set(messageData);
    
    return { success: true, messageId: messageRef.key };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get chat messages (real-time listener)
export const listenToChat = (callback) => {
  const chatRef = db.ref('chat');
  chatRef.limitToLast(50).on('value', (snapshot) => {
    const messages = [];
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    callback(messages.reverse());
  });
  
  // Return unsubscribe function
  return () => chatRef.off();
};

// Moderate chat message (DJ only)
export const deleteMessage = async (messageId) => {
  try {
    await db.ref('chat/' + messageId).remove();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Flag message for review
export const flagMessage = async (messageId) => {
  try {
    await db.ref('chat/' + messageId + '/flagged').set(true);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
