import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "../stores/authStore";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const hasInitialized = useRef(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "SpaceGrotesk-Light": require("../assets/fonts/SpaceGrotesk-Light.ttf"),
    "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
    "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
    "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk-SemiBold.ttf"),
    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
  });

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isLoading && !hasInitialized.current) {
      hasInitialized.current = true;
      setIsInitialLoading(false);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  useEffect(() => {
    if (isInitialLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/index" as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, segments, isInitialLoading, fontsLoaded]);

  if (!fontsLoaded || isInitialLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F0F1A" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
