import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ── Preset color palette ──────────────────────────────────────────────
const PRESET_SECTIONS: { title: string; colors: string[] }[] = [
  {
    title: "Cores de Marca",
    colors: [
      "#E50914", // Netflix
      "#1DB954", // Spotify
      "#FF0000", // YouTube
      "#FF9900", // Amazon
      "#113CCF", // Disney+
      "#B066FE", // HBO
      "#9146FF", // Twitch
      "#4285F4", // Google
      "#00A4EF", // Microsoft
      "#0061FF", // Dropbox
      "#5865F2", // Discord
      "#10A37F", // ChatGPT
    ],
  },
  {
    title: "Populares",
    colors: [
      "#FF6B6B",
      "#FF8A65",
      "#FFB74D",
      "#FECA57",
      "#AED581",
      "#55EFC4",
      "#4DD0E1",
      "#64B5F6",
      "#7986CB",
      "#A29BFE",
      "#CE93D8",
      "#F48FB1",
    ],
  },
  {
    title: "Escuras",
    colors: [
      "#D32F2F",
      "#E64A19",
      "#F57F17",
      "#388E3C",
      "#00796B",
      "#0277BD",
      "#283593",
      "#4A148C",
      "#AD1457",
      "#37474F",
      "#1B2838",
      "#000000",
    ],
  },
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16) / 255;
    g = parseInt(clean.substring(2, 4), 16) / 255;
    b = parseInt(clean.substring(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

interface ColorPickerModalProps {
  visible: boolean;
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({
  visible,
  selectedColor,
  onSelect,
  onClose,
}: ColorPickerModalProps) {
  const [tempColor, setTempColor] = useState(selectedColor);
  const [hexInput, setHexInput] = useState(selectedColor);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hueBarWidth, setHueBarWidth] = useState(0);
  const [slBarWidth, setSlBarWidth] = useState(0);

  React.useEffect(() => {
    if (visible) {
      setTempColor(selectedColor);
      setHexInput(selectedColor);
      const hsl = hexToHsl(selectedColor);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  }, [visible, selectedColor]);

  const updateFromHSL = useCallback((h: number, s: number, l: number) => {
    const hex = hslToHex(h, s, l);
    setTempColor(hex);
    setHexInput(hex);
  }, []);

  function handleHueTouch(e: GestureResponderEvent) {
    if (hueBarWidth <= 0) return;
    const x = Math.max(0, Math.min(e.nativeEvent.locationX, hueBarWidth));
    const h = Math.round((x / hueBarWidth) * 360);
    setHue(h);
    updateFromHSL(h, saturation, lightness);
  }

  function handleSaturationTouch(e: GestureResponderEvent) {
    if (slBarWidth <= 0) return;
    const x = Math.max(0, Math.min(e.nativeEvent.locationX, slBarWidth));
    const s = Math.round((x / slBarWidth) * 100);
    setSaturation(s);
    updateFromHSL(hue, s, lightness);
  }

  function handleLightnessTouch(e: GestureResponderEvent) {
    if (slBarWidth <= 0) return;
    const x = Math.max(0, Math.min(e.nativeEvent.locationX, slBarWidth));
    const l = Math.round((x / slBarWidth) * 100);
    setLightness(l);
    updateFromHSL(hue, saturation, l);
  }

  function handlePresetSelect(color: string) {
    setTempColor(color);
    setHexInput(color);
    const hsl = hexToHsl(color);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }

  function handleHexChange(text: string) {
    let value = text;
    if (!value.startsWith("#")) value = "#" + value;
    setHexInput(value);
    if (isValidHex(value)) {
      setTempColor(value.toUpperCase());
      const hsl = hexToHsl(value);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
    }
  }

  function handleConfirm() {
    onSelect(tempColor);
    onClose();
  }

  const pureHueColor = hslToHex(hue, 100, 50);

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
          <View className="w-10 h-1 bg-background-elevated rounded-full self-center mb-4" />

          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <View
                className="w-11 h-11 rounded-xl mr-3 border border-background-elevated"
                style={{ backgroundColor: tempColor }}
              />
              <View>
                <Text className="text-white font-space-bold text-lg">
                  Selecionar Cor
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  {tempColor}
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

          <ScrollView
            style={{ maxHeight: 420 }}
            showsVerticalScrollIndicator={false}
          >
            {PRESET_SECTIONS.map((section) => (
              <View key={section.title} className="mb-4">
                <Text className="text-text-secondary font-space-semibold text-xs mb-2.5 tracking-wider">
                  {section.title.toUpperCase()}
                </Text>
                <View
                  className="flex-row flex-wrap"
                  style={{ marginHorizontal: -3 }}
                >
                  {section.colors.map((color) => {
                    const isSelected =
                      tempColor.toUpperCase() === color.toUpperCase();
                    return (
                      <TouchableOpacity
                        key={color}
                        onPress={() => handlePresetSelect(color)}
                        style={{
                          width: "16.66%",
                          paddingHorizontal: 3,
                          marginBottom: 6,
                        }}
                        activeOpacity={0.7}
                      >
                        <View
                          className={`aspect-square rounded-xl border-2 items-center justify-center ${
                            isSelected ? "border-white" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark-sharp"
                              size={18}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <View className="mb-4">
              <Text className="text-text-secondary font-space-semibold text-xs mb-3 tracking-wider">
                COR PERSONALIZADA
              </Text>

              <Text className="text-text-muted font-space-regular text-xs mb-1.5 ml-0.5">
                Matiz
              </Text>
              <View
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleHueTouch}
                onResponderMove={handleHueTouch}
                onLayout={(e: LayoutChangeEvent) =>
                  setHueBarWidth(e.nativeEvent.layout.width)
                }
                className="mb-4"
              >
                <LinearGradient
                  colors={[
                    "#FF0000",
                    "#FF8800",
                    "#FFFF00",
                    "#00FF00",
                    "#00FFFF",
                    "#0000FF",
                    "#FF00FF",
                    "#FF0000",
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 36, borderRadius: 18 }}
                />
                {hueBarWidth > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      left: (hue / 360) * hueBarWidth - 10,
                      top: -2,
                      width: 20,
                      height: 40,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor: "#FFFFFF",
                      backgroundColor: pureHueColor,
                    }}
                  />
                )}
              </View>

              <Text className="text-text-muted font-space-regular text-xs mb-1.5 ml-0.5">
                Saturação
              </Text>
              <View
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleSaturationTouch}
                onResponderMove={handleSaturationTouch}
                onLayout={(e: LayoutChangeEvent) =>
                  setSlBarWidth(e.nativeEvent.layout.width)
                }
                className="mb-4"
              >
                <LinearGradient
                  colors={["#808080", pureHueColor]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 36, borderRadius: 18 }}
                />
                {slBarWidth > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      left: (saturation / 100) * slBarWidth - 10,
                      top: -2,
                      width: 20,
                      height: 40,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor: "#FFFFFF",
                      backgroundColor: hslToHex(hue, saturation, 50),
                    }}
                  />
                )}
              </View>

              <Text className="text-text-muted font-space-regular text-xs mb-1.5 ml-0.5">
                Brilho
              </Text>
              <View
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={handleLightnessTouch}
                onResponderMove={handleLightnessTouch}
                className="mb-4"
              >
                <LinearGradient
                  colors={["#000000", pureHueColor, "#FFFFFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 36, borderRadius: 18 }}
                />
                {slBarWidth > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      left: (lightness / 100) * slBarWidth - 10,
                      top: -2,
                      width: 20,
                      height: 40,
                      borderRadius: 10,
                      borderWidth: 3,
                      borderColor: "#FFFFFF",
                      backgroundColor: tempColor,
                    }}
                  />
                )}
              </View>

              <Text className="text-text-muted font-space-regular text-xs mb-1.5 ml-0.5">
                Código Hex
              </Text>
              <View className="flex-row items-center bg-background-elevated rounded-2xl border border-background-elevated px-4">
                <View
                  className="w-6 h-6 rounded-lg mr-3"
                  style={{ backgroundColor: tempColor }}
                />
                <TextInput
                  className="flex-1 text-white font-space-regular text-base py-3"
                  value={hexInput}
                  onChangeText={handleHexChange}
                  placeholder="#6C5CE7"
                  placeholderTextColor="#6C6C80"
                  maxLength={7}
                  autoCapitalize="characters"
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleConfirm}
            className="py-4 rounded-2xl items-center mt-3"
            style={{ backgroundColor: tempColor }}
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
