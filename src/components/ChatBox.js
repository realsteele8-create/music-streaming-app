import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { sendMessage, listenToChat, deleteMessage } from '../services/chatService';

const ChatBox = ({ currentUser, isDJ }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen to chat messages
    const unsubscribe = listenToChat((chatMessages) => {
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    const result = await sendMessage(
      currentUser.uid,
      currentUser.displayName || 'Anonymous',
      inputText,
      isDJ
    );
    setLoading(false);

    if (result.success) {
      setInputText('');
    } else {
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!isDJ) return;

    const result = await deleteMessage(messageId);
    if (result.success) {
      Alert.alert('Success', 'Message deleted');
    } else {
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>💬 Live Chat</Text>
        <Text style={styles.messageCount}>{messages.length} messages</Text>
      </View>

      {/* Messages List */}
      <ScrollView
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
          </View>
        ) : (
          messages.map((msg) => (
            <View key={msg.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageBubble,
                  msg.isDJ && styles.messageBubbleDJ,
                  msg.flagged && styles.messageBubbleFlagged,
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.displayName}>
                    {msg.displayName}
                    {msg.isDJ && ' 🎧'}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
              {isDJ && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(msg.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.mediumGray}
          value={inputText}
          onChangeText={setInputText}
          editable={!loading}
          multiline
          maxLength={150}
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={loading || !inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 400,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },
  header: {
    backgroundColor: colors.cream,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  messageCount: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.mediumGray,
    fontSize: 13,
    fontStyle: 'italic',
  },
  messageWrapper: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageBubble: {
    flex: 1,
    backgroundColor: colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  messageBubbleDJ: {
    backgroundColor: colors.gold,
    borderLeftColor: colors.green,
  },
  messageBubbleFlagged: {
    backgroundColor: '#FFE6E6',
    borderLeftColor: colors.error,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.darkText,
  },
  timestamp: {
    fontSize: 10,
    color: colors.mediumGray,
  },
  messageText: {
    fontSize: 13,
    color: colors.darkText,
    lineHeight: 18,
  },
  deleteButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
    backgroundColor: colors.cream,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.darkText,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ChatBox;
