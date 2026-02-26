import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { differenceInDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Subscription } from "../stores/subscriptionStore";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDeactivate?: (id: string) => void;
}

const CYCLE_LABELS: Record<string, string> = {
  MONTHLY: "Mensal",
  YEARLY: "Anual",
  CUSTOM: "Personalizado",
};

interface ServiceMatch {
  icon: string;
  library: "material" | "ionicons";
  brandColor: string;
}

const SERVICE_BRANDS: { keyword: string; match: ServiceMatch }[] = [
  {
    keyword: "netflix",
    match: { icon: "netflix", library: "material", brandColor: "#E50914" },
  },
  {
    keyword: "spotify",
    match: { icon: "spotify", library: "material", brandColor: "#1DB954" },
  },
  {
    keyword: "youtube",
    match: { icon: "youtube", library: "material", brandColor: "#FF0000" },
  },
  {
    keyword: "amazon",
    match: { icon: "amazon", library: "material", brandColor: "#FF9900" },
  },
  {
    keyword: "disney",
    match: { icon: "film-outline", library: "ionicons", brandColor: "#113CCF" },
  },
  {
    keyword: "hbo",
    match: {
      icon: "videocam-outline",
      library: "ionicons",
      brandColor: "#B066FE",
    },
  },
  {
    keyword: "apple",
    match: { icon: "apple", library: "material", brandColor: "#A2AAAD" },
  },
  {
    keyword: "hulu",
    match: { icon: "hulu", library: "material", brandColor: "#1CE783" },
  },
  {
    keyword: "twitch",
    match: { icon: "twitch", library: "material", brandColor: "#9146FF" },
  },
  {
    keyword: "google",
    match: { icon: "google", library: "material", brandColor: "#4285F4" },
  },
  {
    keyword: "microsoft",
    match: { icon: "microsoft", library: "material", brandColor: "#00A4EF" },
  },
  {
    keyword: "adobe",
    match: { icon: "adobe", library: "material", brandColor: "#FF0000" },
  },
  {
    keyword: "github",
    match: { icon: "github", library: "material", brandColor: "#FFFFFF" },
  },
  {
    keyword: "slack",
    match: { icon: "slack", library: "material", brandColor: "#4A154B" },
  },
  {
    keyword: "dropbox",
    match: { icon: "dropbox", library: "material", brandColor: "#0061FF" },
  },
  {
    keyword: "notion",
    match: {
      icon: "document-text-outline",
      library: "ionicons",
      brandColor: "#FFFFFF",
    },
  },
  {
    keyword: "playstation",
    match: {
      icon: "sony-playstation",
      library: "material",
      brandColor: "#003087",
    },
  },
  {
    keyword: "xbox",
    match: {
      icon: "microsoft-xbox",
      library: "material",
      brandColor: "#107C10",
    },
  },
  {
    keyword: "steam",
    match: { icon: "steam", library: "material", brandColor: "#1B2838" },
  },
  {
    keyword: "discord",
    match: { icon: "discord", library: "material", brandColor: "#5865F2" },
  },
  {
    keyword: "instagram",
    match: { icon: "instagram", library: "material", brandColor: "#E4405F" },
  },
  {
    keyword: "linkedin",
    match: { icon: "linkedin", library: "material", brandColor: "#0A66C2" },
  },
  {
    keyword: "whatsapp",
    match: { icon: "whatsapp", library: "material", brandColor: "#25D366" },
  },
  {
    keyword: "telegram",
    match: { icon: "telegram", library: "material", brandColor: "#26A5E4" },
  },
  {
    keyword: "chatgpt",
    match: {
      icon: "chatbubble-ellipses-outline",
      library: "ionicons",
      brandColor: "#10A37F",
    },
  },
  {
    keyword: "openai",
    match: {
      icon: "chatbubble-ellipses-outline",
      library: "ionicons",
      brandColor: "#10A37F",
    },
  },
  {
    keyword: "gym",
    match: {
      icon: "barbell-outline",
      library: "ionicons",
      brandColor: "#55EFC4",
    },
  },
  {
    keyword: "academia",
    match: {
      icon: "barbell-outline",
      library: "ionicons",
      brandColor: "#55EFC4",
    },
  },
];

const DEFAULT_MATCH: ServiceMatch = {
  icon: "card-outline",
  library: "ionicons",
  brandColor: "#A0A0B8",
};

function getServiceBrand(name: string): ServiceMatch {
  const lower = name.toLowerCase();
  for (const entry of SERVICE_BRANDS) {
    if (lower.includes(entry.keyword)) return entry.match;
  }
  return DEFAULT_MATCH;
}

function getUrgencyColor(daysUntil: number): string {
  if (daysUntil <= 1) return "#FF6B6B";
  if (daysUntil <= 3) return "#FECA57";
  if (daysUntil <= 7) return "#00D2D3";
  return "#A0A0B8";
}

export function SubscriptionCard({
  subscription,
  onDeactivate,
}: SubscriptionCardProps) {
  const nextBilling = parseISO(subscription.nextBillingDate);
  const daysUntil = differenceInDays(nextBilling, new Date());
  const urgencyColor = getUrgencyColor(daysUntil);
  const brand = getServiceBrand(subscription.name);

  const formattedDate = format(nextBilling, "dd 'de' MMM", { locale: ptBR });
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: subscription.currency || "BRL",
  }).format(Number(subscription.price));

  const urgencyText =
    daysUntil <= 0
      ? "Venceu!"
      : daysUntil === 1
        ? "Vence amanhã"
        : `em ${daysUntil} dias`;

  return (
    <View className="bg-background-card rounded-2xl p-4 mb-3 border border-background-elevated">
      <View className="flex-row items-center justify-between">
        {/* Left side - Icon + Info */}
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: `${brand.brandColor}20` }}
          >
            {brand.library === "material" ? (
              <MaterialCommunityIcons
                name={brand.icon as any}
                size={24}
                color={brand.brandColor}
              />
            ) : (
              <Ionicons
                name={brand.icon as any}
                size={22}
                color={brand.brandColor}
              />
            )}
          </View>

          <View className="flex-1">
            <Text
              className="text-white font-space-semibold text-base"
              numberOfLines={1}
            >
              {subscription.name}
            </Text>
            <View className="flex-row items-center mt-0.5">
              <Text className="text-text-muted font-space-regular text-xs">
                {CYCLE_LABELS[subscription.billingCycle] ||
                  subscription.billingCycle}
              </Text>
              <View className="w-1 h-1 rounded-full bg-text-muted mx-2" />
              <Text
                className="font-space-medium text-xs"
                style={{ color: urgencyColor }}
              >
                {urgencyText}
              </Text>
            </View>
          </View>
        </View>

        {/* Right side - Price */}
        <View className="items-end">
          <Text className="text-white font-space-bold text-base">
            {formattedPrice}
          </Text>
          <Text className="text-text-muted font-space-regular text-xs mt-0.5">
            {formattedDate}
          </Text>
        </View>
      </View>

      {/* Deactivate button */}
      {onDeactivate && (
        <TouchableOpacity
          onPress={() => onDeactivate(subscription.id)}
          className="mt-3 pt-3 border-t border-background-elevated flex-row items-center justify-center"
          activeOpacity={0.6}
        >
          <Ionicons name="close-circle-outline" size={16} color="#FF6B6B" />
          <Text className="text-danger text-xs font-space-medium ml-1.5">
            Desativar assinatura
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
