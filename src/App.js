import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { getCurrentUser } from './services/authService';
import { colors } from './theme/colors';

// Screens
import LoginScreen from './screens/LoginScreen';
import PlayerScreen from './screens/PlayerScreen';
import DJDashboard from './screens/DJDashboard';

const Stack = createNativeStackNavigator();

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDJ, setIsDJ] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.cream }}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        {!currentUser ? (
          // Login Stack
          <Stack.Screen
            name="Login"
            children={({ navigation }) => (
              <LoginScreen
                navigation={navigation}
                setCurrentUser={setCurrentUser}
                setIsDJ={setIsDJ}
              />
            )}
          />
        ) : isDJ ? (
          // DJ Stack
          <Stack.Screen
            name="DJDashboard"
            children={({ navigation }) => (
              <DJDashboard currentUser={currentUser} navigation={navigation} />
            )}
          />
        ) : (
          // Listener Stack
          <Stack.Screen
            name="Player"
            children={({ navigation }) => (
              <PlayerScreen currentUser={currentUser} navigation={navigation} />
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
