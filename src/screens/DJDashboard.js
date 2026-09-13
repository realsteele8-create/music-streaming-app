import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { colors } from '../theme/colors';
import { setStreamStatus, updateListenerCount } from '../services/streamingService';
import { getAnalytics, getListenerHistory } from '../services/analyticsService';
import { sendMessage } from '../services/chatService';
import ChatBox from '../components/ChatBox';
import ListenerCount from '../components/ListenerCount';

const DJDashboard = ({ currentUser, navigation }) => {
  const [isLive, setIsLive] = useState(false);
  const [listeners, setListeners] = useState(0);
  const [analytics, setAnalytics] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [moderators, setModerators] = useState([]);
  const [newModeratorEmail, setNewModeratorEmail] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const result = await getAnalytics();
    if (result.success) {
      setAnalytics(result.data);
      setListeners(result.data.activeSessions);
    }
  };

  const toggleLiveStream = async () => {
    const newStatus = !isLive;
    const result = await setStreamStatus(newStatus);
    if (result.success) {
      setIsLive(newStatus);
      Alert.alert('Success', `Stream is now ${newStatus ? 'LIVE' : 'OFFLINE'}`);
    }
  };

  const assignModerator = async () => {
    if (!newModeratorEmail) {
      Alert.alert('Error', 'Please enter email');
      return;
    }
    setModerators([...moderators, newModeratorEmail]);
    setNewModeratorEmail('');
    Alert.alert('Success', `${newModeratorEmail} is now a moderator`);
  };

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>🎵 Memory Lane Radio</Text>
          <Text style={styles.djLabel}>DJ DASHBOARD</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Listener Count */}
      <ListenerCount listeners={listeners} isLive={isLive} />

      {/* Live Stream Control */}
      <View style={styles.controlCard}>
        <Text style={styles.cardTitle}>🔴 Stream Control</Text>
        <TouchableOpacity
          style={[
            styles.liveButton,
            isLive && styles.liveButtonActive,
          ]}
          onPress={toggleLiveStream}
        >
          <Text style={styles.liveButtonText}>
            {isLive ? '🟢 STREAMING LIVE' : '⚫ START STREAM'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Analytics */}
      {analytics && (
        <View style={styles.controlCard}>
          <Text style={styles.cardTitle}>📊 Analytics</Text>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>{analytics.totalSessions}</Text>
              <Text style={styles.analyticsLabel}>Total Sessions</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>{analytics.activeSessions}</Text>
              <Text style={styles.analyticsLabel}>Active Now</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>
                {Math.round(analytics.averageListeningTime)}
              </Text>
              <Text style={styles.analyticsLabel}>Avg. Listen (min)</Text>
            </View>
          </View>
        </View>
      )}

      {/* Moderation */}
      <View style={styles.controlCard}>
        <Text style={styles.cardTitle}>🛡️ Moderation</Text>
        <TouchableOpacity
          style={styles.moderationButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.moderationButtonText}>Assign Moderator</Text>
        </TouchableOpacity>
        <View style={styles.moderatorList}>
          {moderators.length > 0 ? (
            moderators.map((mod, idx) => (
              <Text key={idx} style={styles.moderatorItem}>✓ {mod}</Text>
            ))
          ) : (
            <Text style={styles.noModerators}>No moderators assigned</Text>
          )}
        </View>
      </View>

      {/* Chat Box */}
      <ChatBox currentUser={currentUser} isDJ={true} />

      {/* Moderator Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Moderator</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              value={newModeratorEmail}
              onChangeText={setNewModeratorEmail}
              keyboardType="email-address"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={assignModerator}
              >
                <Text style={styles.modalButtonText}>Assign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  djLabel: {
    color: colors.lightGold,
    fontSize: 12,
    fontWeight: 'bold',
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
  controlCard: {
    backgroundColor: colors.lightGray,
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.gold,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 12,
  },
  liveButton: {
    backgroundColor: colors.darkGray,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.gold,
  },
  liveButtonActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  liveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.cream,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analyticsItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.cream,
    paddingVertical: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  analyticsLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    marginTop: 4,
  },
  moderationButton: {
    backgroundColor: colors.gold,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  moderationButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 14,
  },
  moderatorList: {
    backgroundColor: colors.cream,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  moderatorItem: {
    color: colors.darkText,
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '600',
  },
  noModerators: {
    color: colors.mediumGray,
    fontSize: 13,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cream,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: colors.gold,
  },
  modalButtonSecondary: {
    backgroundColor: colors.mediumGray,
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
});

export default DJDashboard;
