import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export interface IconSelection {
  icon: string;
  library: "material" | "ionicons";
  brandColor: string;
}

interface IconOption {
  label: string;
  icon: string;
  library: "material" | "ionicons";
  brandColor: string;
}

interface IconCategory {
  title: string;
  data: IconOption[];
}

const ICON_CATEGORIES: IconCategory[] = [
  {
    title: "🎬 Streaming",
    data: [
      {
        label: "Netflix",
        icon: "netflix",
        library: "material",
        brandColor: "#E50914",
      },
      {
        label: "Spotify",
        icon: "spotify",
        library: "material",
        brandColor: "#1DB954",
      },
      {
        label: "YouTube",
        icon: "youtube",
        library: "material",
        brandColor: "#FF0000",
      },
      {
        label: "Amazon",
        icon: "amazon",
        library: "material",
        brandColor: "#FF9900",
      },
      {
        label: "Apple",
        icon: "apple",
        library: "material",
        brandColor: "#A2AAAD",
      },
      {
        label: "Hulu",
        icon: "hulu",
        library: "material",
        brandColor: "#1CE783",
      },
      {
        label: "Twitch",
        icon: "twitch",
        library: "material",
        brandColor: "#9146FF",
      },
      {
        label: "Disney+",
        icon: "film-outline",
        library: "ionicons",
        brandColor: "#113CCF",
      },
      {
        label: "HBO Max",
        icon: "videocam-outline",
        library: "ionicons",
        brandColor: "#B066FE",
      },
    ],
  },
  {
    title: "💼 Produtividade",
    data: [
      {
        label: "Google",
        icon: "google",
        library: "material",
        brandColor: "#4285F4",
      },
      {
        label: "Microsoft",
        icon: "microsoft",
        library: "material",
        brandColor: "#00A4EF",
      },
      {
        label: "Adobe",
        icon: "adobe",
        library: "material",
        brandColor: "#FF0000",
      },
      {
        label: "GitHub",
        icon: "github",
        library: "material",
        brandColor: "#FFFFFF",
      },
      {
        label: "Slack",
        icon: "slack",
        library: "material",
        brandColor: "#4A154B",
      },
      {
        label: "Dropbox",
        icon: "dropbox",
        library: "material",
        brandColor: "#0061FF",
      },
      {
        label: "Notion",
        icon: "document-text-outline",
        library: "ionicons",
        brandColor: "#FFFFFF",
      },
    ],
  },
  {
    title: "🎮 Gaming",
    data: [
      {
        label: "PlayStation",
        icon: "sony-playstation",
        library: "material",
        brandColor: "#003087",
      },
      {
        label: "Xbox",
        icon: "microsoft-xbox",
        library: "material",
        brandColor: "#107C10",
      },
      {
        label: "Steam",
        icon: "steam",
        library: "material",
        brandColor: "#1B2838",
      },
      {
        label: "Discord",
        icon: "discord",
        library: "material",
        brandColor: "#5865F2",
      },
    ],
  },
  {
    title: "📱 Redes Sociais",
    data: [
      {
        label: "Instagram",
        icon: "instagram",
        library: "material",
        brandColor: "#E4405F",
      },
      {
        label: "LinkedIn",
        icon: "linkedin",
        library: "material",
        brandColor: "#0A66C2",
      },
      {
        label: "WhatsApp",
        icon: "whatsapp",
        library: "material",
        brandColor: "#25D366",
      },
      {
        label: "Telegram",
        icon: "telegram",
        library: "material",
        brandColor: "#26A5E4",
      },
    ],
  },
  {
    title: "📦 Genéricos",
    data: [
      {
        label: "Música",
        icon: "musical-notes-outline",
        library: "ionicons",
        brandColor: "#A29BFE",
      },
      {
        label: "Vídeo",
        icon: "videocam-outline",
        library: "ionicons",
        brandColor: "#FF6B6B",
      },
      {
        label: "Nuvem",
        icon: "cloud-outline",
        library: "ionicons",
        brandColor: "#00D2D3",
      },
      {
        label: "Jogos",
        icon: "game-controller-outline",
        library: "ionicons",
        brandColor: "#FECA57",
      },
      {
        label: "Fitness",
        icon: "barbell-outline",
        library: "ionicons",
        brandColor: "#55EFC4",
      },
      {
        label: "Educação",
        icon: "school-outline",
        library: "ionicons",
        brandColor: "#4285F4",
      },
      {
        label: "Alimentação",
        icon: "fast-food-outline",
        library: "ionicons",
        brandColor: "#FF9900",
      },
      {
        label: "Saúde",
        icon: "heart-outline",
        library: "ionicons",
        brandColor: "#FF6B6B",
      },
      {
        label: "Transporte",
        icon: "car-outline",
        library: "ionicons",
        brandColor: "#00D2D3",
      },
      {
        label: "Leitura",
        icon: "book-outline",
        library: "ionicons",
        brandColor: "#FECA57",
      },
      {
        label: "IA",
        icon: "chatbubble-ellipses-outline",
        library: "ionicons",
        brandColor: "#10A37F",
      },
      {
        label: "Outro",
        icon: "card-outline",
        library: "ionicons",
        brandColor: "#6C6C80",
      },
    ],
  },
];

function IconComponent({
  icon,
  library,
  size,
  color,
}: {
  icon: string;
  library: "material" | "ionicons";
  size: number;
  color: string;
}) {
  if (library === "material") {
    return (
      <MaterialCommunityIcons name={icon as any} size={size} color={color} />
    );
  }
  return <Ionicons name={icon as any} size={size} color={color} />;
}

interface IconPickerModalProps {
  visible: boolean;
  selectedIcon: string;
  selectedLibrary: "material" | "ionicons";
  onSelect: (selection: IconSelection) => void;
  onClose: () => void;
}

export function IconPickerModal({
  visible,
  selectedIcon,
  selectedLibrary,
  onSelect,
  onClose,
}: IconPickerModalProps) {
  const [tempIcon, setTempIcon] = useState(selectedIcon);
  const [tempLibrary, setTempLibrary] = useState(selectedLibrary);
  const [tempColor, setTempColor] = useState("#6C5CE7");

  React.useEffect(() => {
    if (visible) {
      setTempIcon(selectedIcon);
      setTempLibrary(selectedLibrary);
      for (const cat of ICON_CATEGORIES) {
        const found = cat.data.find(
          (i) => i.icon === selectedIcon && i.library === selectedLibrary,
        );
        if (found) {
          setTempColor(found.brandColor);
          break;
        }
      }
    }
  }, [visible, selectedIcon, selectedLibrary]);

  function handleSelect(item: IconOption) {
    setTempIcon(item.icon);
    setTempLibrary(item.library);
    setTempColor(item.brandColor);
  }

  function handleConfirm() {
    onSelect({ icon: tempIcon, library: tempLibrary, brandColor: tempColor });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable
          className="bg-background-card rounded-t-3xl px-5 pt-5 pb-8 border-t border-background-elevated"
          onPress={() => {}}
        >
          {/* Handle bar */}
          <View className="w-10 h-1 bg-background-elevated rounded-full self-center mb-4" />

          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              {/* Preview */}
              <View
                className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: `${tempColor}20` }}
              >
                <IconComponent
                  icon={tempIcon}
                  library={tempLibrary}
                  size={22}
                  color={tempColor}
                />
              </View>
              <View>
                <Text className="text-white font-space-bold text-lg">
                  Selecionar Ícone
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  Escolha o logo do serviço
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-background-elevated items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#A0A0B8" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={false}
          >
            {ICON_CATEGORIES.map((category) => (
              <View key={category.title} className="mb-4">
                <Text className="text-text-secondary font-space-semibold text-xs mb-2.5 tracking-wider">
                  {category.title.toUpperCase()}
                </Text>
                <View
                  className="flex-row flex-wrap"
                  style={{ marginHorizontal: -4 }}
                >
                  {category.data.map((item) => {
                    const isSelected =
                      tempIcon === item.icon && tempLibrary === item.library;

                    return (
                      <TouchableOpacity
                        key={`${item.library}-${item.icon}-${item.label}`}
                        onPress={() => handleSelect(item)}
                        style={{
                          width: "25%",
                          paddingHorizontal: 4,
                          marginBottom: 8,
                        }}
                        activeOpacity={0.7}
                      >
                        <View
                          className={`items-center justify-center py-3 rounded-2xl border ${
                            isSelected
                              ? "border-primary/50"
                              : "border-background-elevated"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? `${item.brandColor}15`
                              : "#252540",
                          }}
                        >
                          <View
                            className="w-10 h-10 rounded-xl items-center justify-center mb-1.5"
                            style={{
                              backgroundColor: isSelected
                                ? `${item.brandColor}25`
                                : "#1A1A2E",
                            }}
                          >
                            <IconComponent
                              icon={item.icon}
                              library={item.library}
                              size={22}
                              color={isSelected ? item.brandColor : "#A0A0B8"}
                            />
                          </View>
                          <Text
                            className={`text-xs font-space-medium ${
                              isSelected ? "text-white" : "text-text-secondary"
                            }`}
                            numberOfLines={1}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirm}
            className="bg-primary py-4 rounded-2xl items-center mt-3"
            activeOpacity={0.8}
          >
            <Text className="text-white font-space-semibold text-base">
              Confirmar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
