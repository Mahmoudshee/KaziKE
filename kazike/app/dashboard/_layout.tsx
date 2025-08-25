import { Stack } from "expo-router";
import React from "react";
import Colors from './constants/colors';

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.black,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="employer"
        options={{
          title: "Employer Dashboard",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post-job"
        options={{
          title: "Post New Job",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="tabs"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="institution"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="government"
        options={{
          title: "Government Dashboard",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="youth"
        options={{
          title: "Youth Dashboard",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
