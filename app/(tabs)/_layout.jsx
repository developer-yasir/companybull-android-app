import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function TabIcon({ icon, label, focused }) {
  return (
    <View style={[styles.iconContainer, focused && styles.activeIcon]}>
      <Text style={styles.icon}>{icon}</Text>
      {focused && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fdfdfc',
          borderTopWidth: 2.5,
          borderTopColor: '#0d0d0d',
          height: 80,
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👥" label="Staff" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="✈️" label="Leave" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="⌚" label="Time" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Me" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 5, // Extra push up
  },
  activeIcon: {
    backgroundColor: '#f6d140',
    borderWidth: 2,
    borderColor: '#0d0d0d',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0d0d0d',
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
