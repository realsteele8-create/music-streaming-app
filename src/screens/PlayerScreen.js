import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { listenToStreamStatus, getStreamStatus } from '../services/streamingService';
import { logUserSession, endUserSession } from '../services/analyticsService';
import Player from '../components/Player';
import ChatBox from '../components/ChatBox';
import ListenerCount from '../components/ListenerCount';

const PlayerScreen = ({ currentUser, navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [listeners, setListeners] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Log user session
    const initSession = async () => {
      const session = await logUserSession(currentUser.uid, currentUser.displayName || 'Anonymous');
      if (session.success) {
        setSessionId(session.sessionId);
      }
      setLoading(false);
    };

    initSession();

    // Listen to stream status
    const unsubscribe = listenToStreamStatus((status) => {
      setIsLive(status.isLive);
      setListeners(status.listeners || 0);
    });

    return () => {
      unsubscribe();
      if (sessionId) {
        endUserSession(sessionId);
      }
    };
  }, [currentUser]);

  const handleLogout = () => {
    if (sessionId) {
      endUserSession(sessionId);
    }
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.gold} />
        <Text style={{ color: colors.darkText, marginTop: 10 }}>Connecting to Memory Lane Radio...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>🎵 Memory Lane Radio</Text>
          {isLive && <Text style={styles.liveIndicator}>● LIVE NOW</Text>}
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Listener Count */}
      <ListenerCount listeners={listeners} isLive={isLive} />

      {/* Player */}
      <Player isPlaying={isPlaying} setIsPlaying={setIsPlaying} isLive={isLive} />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.userLabel}>Your Display Name:</Text>
        <Text style={styles.userName}>{currentUser.displayName || 'Anonymous'}</Text>
      </View>

      {/* Chat Box */}
      <ChatBox currentUser={currentUser} isDJ={false} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  header: {
    backgroundColor: colors.black,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: colors.gold,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  liveIndicator: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: colors.gold,
    color: colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  userInfo: {
    backgroundColor: colors.lightGray,
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },
  userLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  userName: {
    fontSize: 18,
    color: colors.darkText,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default PlayerScreen;
