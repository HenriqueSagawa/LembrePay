import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/authStore";
import { useSubscriptionStore } from "../../stores/subscriptionStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { subscriptions, reset } = useSubscriptionStore();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          reset();
          await logout();
        },
      },
    ]);
  };

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => s.isActive);
    const totalMonthly = active.reduce((sum, s) => {
      const price = Number(s.price);
      if (s.billingCycle === "YEARLY") return sum + price / 12;
      if (s.billingCycle === "CUSTOM" && s.customIntervalDays) {
        return sum + (price / s.customIntervalDays) * 30;
      }
      return sum + price;
    }, 0);
    const totalYearly = totalMonthly * 12;
    return { totalMonthly, totalYearly, count: active.length };
  }, [subscriptions]);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <Text className="text-white font-space-bold text-2xl mb-6">Perfil</Text>

        {/* User Card */}
        <View className="bg-background-card rounded-3xl p-6 border border-background-elevated mb-4 items-center">
          <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-4">
            <Text className="text-primary font-space-bold text-2xl">
              {initials}
            </Text>
          </View>
          <Text className="text-white font-space-bold text-xl">
            {user?.name || "Usuário"}
          </Text>
          <Text className="text-text-secondary font-space-regular text-sm mt-1">
            {user?.email || ""}
          </Text>
        </View>

        {/* Stats */}
        <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-4">
          <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
            RESUMO FINANCEIRO
          </Text>

          <View className="flex-row items-center justify-between py-3 border-b border-background-elevated">
            <View className="flex-row items-center">
              <Ionicons name="receipt-outline" size={18} color="#00D2D3" />
              <Text className="text-text-secondary font-space-regular text-sm ml-3">
                Assinaturas ativas
              </Text>
            </View>
            <Text className="text-white font-space-semibold text-base">
              {stats.count}
            </Text>
          </View>

          <View className="flex-row items-center justify-between py-3 border-b border-background-elevated">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={18} color="#6C5CE7" />
              <Text className="text-text-secondary font-space-regular text-sm ml-3">
                Gasto mensal
              </Text>
            </View>
            <Text className="text-white font-space-semibold text-base">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.totalMonthly)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center">
              <Ionicons name="trending-up-outline" size={18} color="#FECA57" />
              <Text className="text-text-secondary font-space-regular text-sm ml-3">
                Gasto anual estimado
              </Text>
            </View>
            <Text className="text-white font-space-semibold text-base">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(stats.totalYearly)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="bg-background-card rounded-3xl border border-background-elevated overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.6}
          >
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-xl bg-primary/15 items-center justify-center">
                <Ionicons name="settings-outline" size={18} color="#6C5CE7" />
              </View>
              <Text className="text-white font-space-medium text-sm ml-3">
                Configurações
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6C6C80" />
          </TouchableOpacity>

          <View className="h-px bg-background-elevated" />

          <TouchableOpacity
            className="flex-row items-center justify-between p-4"
            onPress={handleLogout}
            activeOpacity={0.6}
          >
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-xl bg-danger/15 items-center justify-center">
                <Ionicons name="log-out-outline" size={18} color="#FF6B6B" />
              </View>
              <Text className="text-danger font-space-medium text-sm ml-3">
                Sair da conta
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text className="text-text-muted font-space-regular text-xs text-center mt-6">
          LembrePay v1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}
