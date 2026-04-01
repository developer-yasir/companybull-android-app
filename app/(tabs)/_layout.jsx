import React from 'react';
import { Tabs, useRouter } from "expo-router";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MenuProvider, useMenu } from "../../src/context/MenuContext";
import MenuOverlay from "../../src/components/MenuOverlay";
import { Ionicons } from '@expo/vector-icons';

function HamburgerIcon() {
  const { toggleMenu } = useMenu();
  return (
    <TouchableOpacity onPress={toggleMenu} style={styles.headerBtn}>
      <Ionicons name="menu-outline" size={24} color="#0d0d0d" />
    </TouchableOpacity>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
      <Ionicons name="arrow-back-outline" size={24} color="#0d0d0d" />
    </TouchableOpacity>
  );
}

function TabIcon({ name, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <View style={[
        styles.iconWrapper, 
        focused && styles.iconWrapperActive
      ]}>
        <Ionicons 
          name={focused ? name : `${name}-outline`} 
          size={24} 
          color={focused ? "#0d0d0d" : "#4b5563"} 
        />
      </View>
      <Text style={[
        styles.label, 
        { color: focused ? '#863ceb' : '#333' }
      ]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <MenuProvider>
      <View style={styles.outerContainer}>
        <MenuOverlay />
        <Tabs
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#f7f7f3",
              borderBottomWidth: 3,
              borderBottomColor: "#0d0d0d",
              height: 110,
            },
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: "900",
              color: "#0d0d0d",
              textTransform: "uppercase",
              letterSpacing: -0.5,
            },
            headerTintColor: "#0d0d0d",
            headerLeft: () => <HamburgerIcon />,
            tabBarStyle: {
              backgroundColor: "#fdfdfc",
              borderTopWidth: 4,
              borderTopColor: "#0d0d0d",
              height: 100, // Increased to accommodate custom label
              paddingBottom: Platform.OS === 'ios' ? 30 : 15,
              paddingTop: 10,
              elevation: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 1,
              shadowRadius: 0,
            },
            tabBarActiveTintColor: "#863ceb",
            tabBarInactiveTintColor: "#4b5563",
            tabBarShowLabel: false, // Using custom label in TabIcon
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerTitle: "BULL DASHBOARD",
              tabBarIcon: ({ focused }) => <TabIcon name="home" label="Home" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="employees"
            options={{
              headerTitle: "STAFF DIRECTORY",
              tabBarIcon: ({ focused }) => <TabIcon name="people" label="Staff" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="org"
            options={{
              headerTitle: "ORG HIERARCHY",
              tabBarIcon: ({ focused }) => <TabIcon name="git-network" label="Org" focused={focused} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerTitle: "MY PROFILE",
              tabBarIcon: ({ focused }) => <TabIcon name="person" label="Me" focused={focused} />,
            }}
          />
          <Tabs.Screen 
            name="departments" 
            options={{ 
              href: null, 
              headerShown: false 
            }} 
          />
          <Tabs.Screen 
            name="leave" 
            options={{ 
              href: null, 
              headerTitle: "TIME OFF",
              headerLeft: () => <BackButton /> 
            }} 
          />
          <Tabs.Screen 
            name="attendance" 
            options={{ 
              href: null, 
              headerTitle: "ATTENDANCE",
              headerLeft: () => <BackButton /> 
            }} 
          />
        </Tabs>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerBtn: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: '#f6d140',
    borderWidth: 2,
    borderColor: '#0d0d0d',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  iconWrapper: {
    width: 48,
    height: 42,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#0d0d0d',
    backgroundColor: '#fdfdfc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperActive: {
    backgroundColor: '#f6d140', // Yellow
    borderWidth: 2.5,
    shadowColor: '#0d0d0d',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    transform: [{ translateY: -4 }],
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
