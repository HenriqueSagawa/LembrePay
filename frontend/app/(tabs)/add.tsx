import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import {
  IconPickerModal,
  type IconSelection,
} from "../../components/IconPickerModal";
import { ColorPickerModal } from "../../components/ColorPickerModal";
import { useSubscriptionStore } from "../../stores/subscriptionStore";

type BillingCycle = "MONTHLY" | "YEARLY" | "CUSTOM";

const BILLING_OPTIONS: { label: string; value: BillingCycle; icon: string }[] =
  [
    { label: "Mensal", value: "MONTHLY", icon: "calendar-outline" },
    { label: "Anual", value: "YEARLY", icon: "calendar-number-outline" },
    { label: "Personalizado", value: "CUSTOM", icon: "options-outline" },
  ];

export default function AddSubscriptionScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [customDays, setCustomDays] = useState("");
  const [reminderDays, setReminderDays] = useState("3");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedIcon, setSelectedIcon] = useState("card-outline");
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<
    "material" | "ionicons"
  >("ionicons");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [selectedColor, setSelectedColor] = useState("#6C5CE7");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const { createSubscription, isCreating } = useSubscriptionStore();
  const router = useRouter();

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    else if (name.trim().length < 2) newErrors.name = "Mínimo de 2 caracteres";
    if (!price.trim()) newErrors.price = "Preço é obrigatório";
    else if (!/^\d+(\.\d{1,2})?$/.test(price))
      newErrors.price = "Use o formato: 29.90";
    if (billingCycle === "CUSTOM" && !customDays.trim())
      newErrors.customDays = "Dias são obrigatórios para ciclo personalizado";
    if (reminderDays && isNaN(Number(reminderDays)))
      newErrors.reminderDays = "Valor inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleDateChange(event: DateTimePickerEvent, date?: Date) {
    setShowDatePicker(false);
    if (date) {
      setStartDate(date);
    }
  }

  function handleIconSelect(selection: IconSelection) {
    setSelectedIcon(selection.icon);
    setSelectedIconLibrary(selection.library);
    setSelectedColor(selection.brandColor);
  }

  async function handleCreate() {
    if (!validate()) return;
    try {
      await createSubscription({
        name: name.trim(),
        description: description.trim() || undefined,
        price,
        billingCycle,
        customIntervalDays:
          billingCycle === "CUSTOM" ? Number(customDays) : undefined,
        startDate: format(startDate, "yyyy-MM-dd"),
        reminderDaysBefore: Number(reminderDays) || 3,
      });
      Alert.alert("Sucesso! ✅", "Assinatura criada com sucesso!", [
        { text: "OK", onPress: () => router.navigate("/(tabs)") },
      ]);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  function renderIcon(size: number, color: string) {
    if (selectedIconLibrary === "material") {
      return (
        <MaterialCommunityIcons
          name={selectedIcon as any}
          size={size}
          color={color}
        />
      );
    }
    return <Ionicons name={selectedIcon as any} size={size} color={color} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-6 mt-2">
            <Text className="text-white font-space-bold text-2xl">
              Nova Assinatura
            </Text>
            <Text className="text-text-secondary font-space-regular text-sm mt-1">
              Adicione os detalhes da sua assinatura
            </Text>
          </View>

          <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-4">
            <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
              ÍCONE E COR
            </Text>

            <TouchableOpacity
              onPress={() => setShowIconPicker(true)}
              className="flex-row items-center bg-background-elevated rounded-2xl p-4 border border-background-elevated mb-3"
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: `${selectedColor}20` }}
              >
                {renderIcon(26, selectedColor)}
              </View>
              <View className="flex-1">
                <Text className="text-white font-space-medium text-base">
                  Selecionar ícone
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  Toque para escolher o logo do serviço
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6C6C80" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowColorPicker(true)}
              className="flex-row items-center bg-background-elevated rounded-2xl p-4 border border-background-elevated"
              activeOpacity={0.7}
            >
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4 border border-white/10"
                style={{ backgroundColor: selectedColor }}
              />
              <View className="flex-1">
                <Text className="text-white font-space-medium text-base">
                  Selecionar cor
                </Text>
                <Text className="text-text-muted font-space-regular text-xs mt-0.5">
                  {selectedColor}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6C6C80" />
            </TouchableOpacity>
          </View>

          <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-4">
            <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
              INFORMAÇÕES BÁSICAS
            </Text>

            <Input
              label="Nome do serviço"
              icon="ticket-outline"
              placeholder="Ex: Netflix, Spotify..."
              value={name}
              onChangeText={setName}
              error={errors.name}
            />

            <Input
              label="Descrição (opcional)"
              icon="document-text-outline"
              placeholder="Plano família, premium..."
              value={description}
              onChangeText={setDescription}
            />

            <Input
              label="Preço"
              icon="cash-outline"
              placeholder="29.90"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
              error={errors.price}
            />
          </View>

          <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-4">
            <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
              DATA DA ASSINATURA
            </Text>

            <View className="w-full mb-4">
              <Text className="text-text-secondary font-space-medium text-sm mb-2 ml-1">
                Quando você assinou?
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="flex-row items-center bg-background-elevated rounded-2xl border border-background-elevated px-4 py-4"
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#6C5CE7"
                  style={{ marginRight: 12 }}
                />
                <Text className="flex-1 text-white font-space-regular text-base">
                  {format(startDate, "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6C6C80" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                locale="pt-BR"
              />
            )}

            <View className="flex-row items-center bg-primary/10 rounded-xl p-3 mt-1">
              <Ionicons name="information-circle" size={18} color="#A29BFE" />
              <Text className="text-primary-light font-space-regular text-xs ml-2 flex-1">
                Selecione a data em que você fez a assinatura do serviço.
              </Text>
            </View>
          </View>

          <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-4">
            <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
              CICLO DE COBRANÇA
            </Text>

            <View className="flex-row gap-2 mb-4">
              {BILLING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setBillingCycle(opt.value)}
                  className={`flex-1 py-3.5 rounded-xl items-center border ${
                    billingCycle === opt.value
                      ? "bg-primary/15 border-primary/40"
                      : "bg-background-elevated border-background-elevated"
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={20}
                    color={billingCycle === opt.value ? "#6C5CE7" : "#6C6C80"}
                  />
                  <Text
                    className={`text-xs font-space-medium mt-1.5 ${
                      billingCycle === opt.value
                        ? "text-primary-light"
                        : "text-text-muted"
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {billingCycle === "CUSTOM" && (
              <Input
                label="Intervalo em dias"
                icon="timer-outline"
                placeholder="Ex: 15"
                value={customDays}
                onChangeText={setCustomDays}
                keyboardType="number-pad"
                error={errors.customDays}
              />
            )}
          </View>

          {/* Reminder */}
          <View className="bg-background-card rounded-3xl p-5 border border-background-elevated mb-6">
            <Text className="text-text-secondary font-space-semibold text-xs mb-4 tracking-wider">
              LEMBRETE
            </Text>

            <Input
              label="Lembrar quantos dias antes?"
              icon="notifications-outline"
              placeholder="3"
              value={reminderDays}
              onChangeText={setReminderDays}
              keyboardType="number-pad"
              error={errors.reminderDays}
            />

            <View className="flex-row items-center bg-primary/10 rounded-xl p-3 mt-1">
              <Ionicons name="information-circle" size={18} color="#A29BFE" />
              <Text className="text-primary-light font-space-regular text-xs ml-2 flex-1">
                Você receberá uma notificação {reminderDays || "3"} dias antes
                do vencimento.
              </Text>
            </View>
          </View>

          {/* Submit */}
          <Button
            title="Criar Assinatura"
            onPress={handleCreate}
            isLoading={isCreating}
            size="lg"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <IconPickerModal
        visible={showIconPicker}
        selectedIcon={selectedIcon}
        selectedLibrary={selectedIconLibrary}
        onSelect={handleIconSelect}
        onClose={() => setShowIconPicker(false)}
      />

      <ColorPickerModal
        visible={showColorPicker}
        selectedColor={selectedColor}
        onSelect={setSelectedColor}
        onClose={() => setShowColorPicker(false)}
      />
    </SafeAreaView>
  );
}
