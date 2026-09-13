import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import { loginUser, signupUser, loginDJ } from '../services/authService';

const LoginScreen = ({ navigation, setCurrentUser, setIsDJ }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [djCode, setDjCode] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isDJLogin, setIsDJLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUserLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);

    if (result.success) {
      setCurrentUser(result.user);
      setIsDJ(false);
      navigation.replace('Player');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  const handleUserSignup = async () => {
    if (!email || !password || !displayName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signupUser(email, password, displayName);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created! You can now login.');
      setIsSignup(false);
      setEmail('');
      setPassword('');
      setDisplayName('');
    } else {
      Alert.alert('Signup Failed', result.error);
    }
  };

  const handleDJLogin = async () => {
    if (!email || !password || !djCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await loginDJ(email, password, djCode);
    setLoading(false);

    if (result.success) {
      setCurrentUser(result.user);
      setIsDJ(true);
      navigation.replace('DJDashboard');
    } else {
      Alert.alert('DJ Login Failed', result.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>🎵 Memory Lane Radio</Text>
        <Text style={styles.tagline}>Reggae Vibes, Timeless Hits</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              !isDJLogin && styles.toggleButtonActive,
            ]}
            onPress={() => {
              setIsDJLogin(false);
              setIsSignup(false);
            }}
          >
            <Text
              style={[
                styles.toggleText,
                !isDJLogin && styles.toggleTextActive,
              ]}
            >
              Listener
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              isDJLogin && styles.toggleButtonActive,
            ]}
            onPress={() => {
              setIsDJLogin(true);
              setIsSignup(false);
            }}
          >
            <Text
              style={[
                styles.toggleText,
                isDJLogin && styles.toggleTextActive,
              ]}
            >
              DJ
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.mediumGray}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.mediumGray}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          secureTextEntry
        />

        {/* DJ Code Input (DJ Login Only) */}
        {isDJLogin && (
          <TextInput
            style={styles.input}
            placeholder="DJ Code"
            placeholderTextColor={colors.mediumGray}
            value={djCode}
            onChangeText={setDjCode}
            editable={!loading}
            secureTextEntry
          />
        )}

        {/* Display Name Input (Signup Only) */}
        {!isDJLogin && isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Display Name (Cannot be changed)"
            placeholderTextColor={colors.mediumGray}
            value={displayName}
            onChangeText={setDisplayName}
            editable={!loading}
            maxLength={20}
          />
        )}

        {/* Login/Signup Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isDJLogin ? handleDJLogin : isSignup ? handleUserSignup : handleUserLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.buttonText}>
              {isDJLogin ? 'DJ Login' : isSignup ? 'Create Account' : 'Login'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle Signup/Login */}
        {!isDJLogin && (
          <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
            <Text style={styles.toggleLink}>
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.gold,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.lightGold,
    fontStyle: 'italic',
  },
  formContainer: {
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.mediumGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: colors.mediumGray,
  },
  toggleButtonActive: {
    backgroundColor: colors.gold,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
  },
  toggleTextActive: {
    color: colors.black,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: colors.darkText,
    backgroundColor: colors.lightGray,
  },
  button: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.green,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  toggleLink: {
    fontSize: 14,
    color: colors.green,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
  },
});

export default LoginScreen;
