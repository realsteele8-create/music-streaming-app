import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.database();

// User Login
export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// DJ Login with special code
export const loginDJ = async (email, password, djCode) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    
    // Verify DJ code
    const djVerification = await db.ref('dj_codes/' + djCode).once('value');
    if (!djVerification.exists()) {
      throw new Error('Invalid DJ code');
    }
    
    // Set DJ role in database
    await db.ref('users/' + userCredential.user.uid).update({
      role: 'dj',
      email: email,
    });
    
    return { success: true, user: userCredential.user, isDJ: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User Signup
export const signupUser = async (email, password, displayName) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    
    // Store user data in database
    await db.ref('users/' + userCredential.user.uid).set({
      email: email,
      displayName: displayName,
      role: 'user',
      createdAt: new Date().toISOString(),
      joinedTime: new Date().getTime(),
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await auth.signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user role
export const getUserRole = async (uid) => {
  try {
    const snapshot = await db.ref('users/' + uid + '/role').once('value');
    return snapshot.val() || 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

export { auth, db };
