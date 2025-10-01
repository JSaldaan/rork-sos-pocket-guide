import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const headerStyle = {
  backgroundColor: '#2C5F8D',
};

const headerTintColor = '#fff';

const headerTitleStyle = {
  fontWeight: '700' as const,
  fontSize: 18,
};

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle,
      headerTintColor,
      headerTitleStyle,
      headerShadowVisible: true,
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="pediatric" options={{ title: "Pediatric" }} />
      <Stack.Screen name="scores" options={{ title: "Clinical Scores" }} />
      <Stack.Screen name="waafels" options={{ title: "WAAFELS" }} />
      <Stack.Screen name="files" options={{ title: "Clinical Files" }} />
      <Stack.Screen name="care" options={{ title: "Patient Care" }} />
      <Stack.Screen name="flowchart" options={{ title: "Clinical Flowcharts" }} />
      <Stack.Screen name="rsi" options={{ title: "RSI Protocol" }} />
      <Stack.Screen name="hos" options={{ title: "HOS" }} />
      <Stack.Screen name="overtime" options={{ title: "Overtime" }} />
      <Stack.Screen name="as-call" options={{ title: "AS-Call" }} />
      <Stack.Screen name="cpr" options={{ title: "CPR Timer" }} />
      <Stack.Screen name="websites" options={{ title: "Resources" }} />
      <Stack.Screen name="ai-assistant" options={{ title: "AI Assistant" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}