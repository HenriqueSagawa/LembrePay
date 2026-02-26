import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/authStore";
import {
  useSubscriptionStore,
  type Subscription,
} from "../../stores/subscriptionStore";
import { SubscriptionCard } from "../../components/SubscriptionCard";
import { EmptyState } from "../../components/EmptyState";
import { differenceInDays, parseISO } from "date-fns";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const {
    subscriptions,
    isLoading,
    pagination,
    fetchSubscriptions,
    deactivateSubscription,
  } = useSubscriptionStore();

  useFocusEffect(
    useCallback(() => {
      fetchSubscriptions(1);
    }, []),
  );

  const handleDeactivate = (id: string) => {
    Alert.alert(
      "Desativar Assinatura",
      "Tem certeza que deseja desativar esta assinatura?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Desativar",
          style: "destructive",
          onPress: () => deactivateSubscription(id),
        },
      ],
    );
  };

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages && !isLoading) {
      fetchSubscriptions(pagination.page + 1);
    }
  };

  const stats = useMemo(() => {
    const activeSubscriptions = subscriptions.filter((s) => s.isActive);
    const totalMonthly = activeSubscriptions.reduce((sum, s) => {
      const price = Number(s.price);
      if (s.billingCycle === "YEARLY") return sum + price / 12;
      if (s.billingCycle === "CUSTOM" && s.customIntervalDays) {
        return sum + (price / s.customIntervalDays) * 30;
      }
      return sum + price;
    }, 0);

    const upcoming = activeSubscriptions.filter((s) => {
      const days = differenceInDays(parseISO(s.nextBillingDate), new Date());
      return days >= 0 && days <= 7;
    }).length;

    return { totalMonthly, count: activeSubscriptions.length, upcoming };
  }, [subscriptions]);

  const firstName = user?.name?.split(" ")[0] || "Usuário";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && subscriptions.length > 0}
            onRefresh={() => fetchSubscriptions(1)}
            tintColor="#6C5CE7"
            colors={["#6C5CE7"]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Greeting */}
            <View className="mb-6">
              <Text className="text-text-secondary font-space-regular text-base">
                Olá, {firstName} 👋
              </Text>
              <Text className="text-white font-space-bold text-2xl mt-1">
                Suas Assinaturas
              </Text>
            </View>

            {/* Stats Cards */}
            <View className="flex-row gap-3 mb-6">
              {/* Total mensal */}
              <View className="flex-1 bg-background-card rounded-2xl p-4 border border-primary/20">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-primary/15 items-center justify-center">
                    <Ionicons
                      name="trending-up-outline"
                      size={16}
                      color="#6C5CE7"
                    />
                  </View>
                </View>
                <Text className="text-white font-space-bold text-lg">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(stats.totalMonthly)}
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  Gasto mensal
                </Text>
              </View>

              {/* Qtd assinaturas */}
              <View className="flex-1 bg-background-card rounded-2xl p-4 border border-secondary/20">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-secondary/15 items-center justify-center">
                    <Ionicons
                      name="receipt-outline"
                      size={16}
                      color="#00D2D3"
                    />
                  </View>
                </View>
                <Text className="text-white font-space-bold text-lg">
                  {stats.count}
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  Ativas
                </Text>
              </View>

              {/* Próximas */}
              <View className="flex-1 bg-background-card rounded-2xl p-4 border border-warning/20">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-warning/15 items-center justify-center">
                    <Ionicons
                      name="alert-circle-outline"
                      size={16}
                      color="#FECA57"
                    />
                  </View>
                </View>
                <Text className="text-white font-space-bold text-lg">
                  {stats.upcoming}
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  Em 7 dias
                </Text>
              </View>
            </View>

            {/* Section title */}
            {subscriptions.length > 0 && (
              <Text className="text-text-secondary font-space-semibold text-sm mb-3">
                PRÓXIMOS VENCIMENTOS
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            subscription={item}
            onDeactivate={handleDeactivate}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="Nenhuma assinatura"
              description="Adicione sua primeira assinatura tocando no botão + abaixo."
              icon="receipt-outline"
            />
          ) : null
        }
        ListFooterComponent={
          isLoading && subscriptions.length === 0 ? (
            <View className="py-10">
              <ActivityIndicator size="large" color="#6C5CE7" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
