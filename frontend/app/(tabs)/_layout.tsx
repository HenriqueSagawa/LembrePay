import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "#6C6C80",
        tabBarStyle: {
          backgroundColor: "#1A1A2E",
          borderTopColor: "#252540",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "SpaceGrotesk-Medium",
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-xl ${focused ? "bg-primary/15" : ""}`}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-xl ${focused ? "bg-primary/15" : ""}`}
            >
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View
              className={`p-1.5 rounded-xl ${focused ? "bg-primary/15" : ""}`}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
