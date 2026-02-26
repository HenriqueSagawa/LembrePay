import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  type TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  icon,
  isPassword = false,
  className = "",
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full mb-4">
      {label && (
        <Text className="text-text-secondary font-space-medium text-sm mb-2 ml-1">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-background-elevated rounded-2xl border ${
          error
            ? "border-danger"
            : isFocused
              ? "border-primary"
              : "border-background-elevated"
        } px-4 py-1`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? "#FF6B6B" : isFocused ? "#6C5CE7" : "#6C6C80"}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className={`flex-1 text-white font-space-regular text-base py-3 ${className}`}
          placeholderTextColor="#6C6C80"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6C6C80"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-danger text-xs font-space-regular mt-1.5 ml-1">
          {error}
        </Text>
      )}
    </View>
  );
}
