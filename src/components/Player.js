import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { STREAM_URL, listenToStreamStatus } from '../services/streamingService';

const Player = ({ isPlaying, setIsPlaying, isLive }) => {
  const [loading, setLoading] = useState(false);

  const handlePlayPause = () => {
    // In a real app, this would connect to actual audio streaming
    // For now, it's a UI-only implementation
    if (isLive) {
      setIsPlaying(!isPlaying);
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <View style={styles.container}>
      {/* Album Art / Visual */}
      <View style={[styles.visualizer, !isLive && styles.visualizerOffline]}>
        <View style={styles.equalizerBars}>
          {[...Array(5)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.bar,
                isPlaying && isLive && styles.barAnimated,
                { animationDelay: `${i * 0.1}s` },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Song Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.songTitle}>🎶 Memory Lane Radio</Text>
        <Text style={styles.artistName}>
          {isLive ? 'Broadcasting Live' : 'Station Offline'}
        </Text>
      </View>

      {/* Play/Pause Button */}
      <TouchableOpacity
        style={[
          styles.playButton,
          isPlaying && styles.playButtonActive,
          !isLive && styles.playButtonDisabled,
        ]}
        onPress={handlePlayPause}
        disabled={!isLive}
      >
        {loading ? (
          <ActivityIndicator color={colors.black} size="large" />
        ) : (
          <Text style={styles.playButtonIcon}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Status */}
      <View style={styles.statusContainer}>
        {isLive ? (
          <>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
            <Text style={styles.statusText}>
              {isPlaying ? '🔊 Now Playing' : '🔇 Paused'}
            </Text>
          </>
        ) : (
          <Text style={styles.offlineText}>Station Offline - Come Back Later!</Text>
        )}
      </View>

      {/* Volume Control (Visual) */}
      <View style={styles.volumeContainer}>
        <Text style={styles.volumeLabel}>Volume</Text>
        <View style={styles.volumeBar}>
          <View style={[styles.volumeFill, isPlaying && styles.volumeFillActive]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  visualizer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  visualizerOffline: {
    borderColor: colors.mediumGray,
    shadowColor: colors.mediumGray,
  },
  equalizerBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    height: 100,
  },
  bar: {
    width: 6,
    height: 40,
    backgroundColor: colors.gold,
    borderRadius: 3,
  },
  barAnimated: {
    animation: 'pulse 0.6s ease-in-out infinite',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    color: colors.mediumGray,
    fontStyle: 'italic',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.green,
  },
  playButtonActive: {
    backgroundColor: colors.green,
    borderColor: colors.gold,
  },
  playButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.mediumGray,
  },
  playButtonIcon: {
    fontSize: 40,
    color: colors.black,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginRight: 6,
    animation: 'pulse 1s ease-in-out infinite',
  },
  liveText: {
    color: colors.error,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusText: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: '600',
  },
  offlineText: {
    fontSize: 14,
    color: colors.mediumGray,
    fontStyle: 'italic',
  },
  volumeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  volumeLabel: {
    fontSize: 12,
    color: colors.mediumGray,
    fontWeight: '600',
    marginBottom: 6,
  },
  volumeBar: {
    width: '80%',
    height: 6,
    backgroundColor: colors.mediumGray,
    borderRadius: 3,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    width: '0%',
    backgroundColor: colors.gold,
  },
  volumeFillActive: {
    width: '100%',
  },
});

export default Player;
