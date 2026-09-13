import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ListenerCount = ({ listeners, isLive }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Live Indicator */}
        <View style={styles.liveIndicatorContainer}>
          <View style={[styles.liveBullet, isLive && styles.liveBulletActive]} />
          <Text style={[styles.liveText, isLive && styles.liveTextActive]}>
            {isLive ? '🔴 LIVE' : '⚫ OFFLINE'}
          </Text>
        </View>

        {/* Listener Count */}
        <View style={styles.listenerContainer}>
          <Text style={styles.listenerCount}>{listeners}</Text>
          <Text style={styles.listenerLabel}>
            {listeners === 1 ? 'listener' : 'listeners'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    marginHorizontal: 15,
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderBottomColor: colors.gold,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.mediumGray,
    marginRight: 8,
  },
  liveBulletActive: {
    backgroundColor: colors.error,
    animation: 'pulse 1s ease-in-out infinite',
  },
  liveText: {
    color: colors.mediumGray,
    fontWeight: 'bold',
    fontSize: 12,
  },
  liveTextActive: {
    color: colors.gold,
  },
  listenerContainer: {
    alignItems: 'flex-end',
  },
  listenerCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
  },
  listenerLabel: {
    fontSize: 12,
    color: colors.lightGold,
    marginTop: 2,
  },
});

export default ListenerCount;
