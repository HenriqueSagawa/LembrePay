import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function EmptyState({
  icon = "receipt-outline",
  title,
  description,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-5">
        <Ionicons name={icon} size={36} color="#6C5CE7" />
      </View>
      <Text className="text-white font-space-bold text-xl text-center mb-2">
        {title}
      </Text>
      <Text className="text-text-secondary font-space-regular text-sm text-center leading-5">
        {description}
      </Text>
    </View>
  );
}
