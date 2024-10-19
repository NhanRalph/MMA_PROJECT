import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import FavouriteScreen from './src/screens/FavouriteScreen';
import DetailScreen from './src/screens/DetailScreen';
import { MenuProvider } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoriteProvider } from './src/screens/context/FavoriteContext'; // Đảm bảo đường dẫn đúng

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type IoniconName = keyof typeof Ionicons.glyphMap;

// Bottom Tab Navigator
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: IoniconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Favorites" component={FavouriteScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <FavoriteProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: true }} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </FavoriteProvider>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}