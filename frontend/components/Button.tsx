import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({
  title,
  variant = "primary",
  isLoading = false,
  size = "md",
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "items-center justify-center rounded-2xl";

  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-background-elevated border border-primary/30",
    danger: "bg-danger/20 border border-danger/30",
    ghost: "bg-transparent",
  };

  const sizeStyles = {
    sm: "py-2.5 px-4",
    md: "py-4 px-6",
    lg: "py-5 px-8",
  };

  const textVariantStyles = {
    primary: "text-white",
    secondary: "text-primary-light",
    danger: "text-danger",
    ghost: "text-text-secondary",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${isDisabled ? "opacity-50" : ""} ${className}`}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : "#6C5CE7"}
          size="small"
        />
      ) : (
        <Text
          className={`font-space-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
