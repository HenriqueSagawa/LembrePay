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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../stores/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  function validate() {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email inválido";
    if (!password.trim()) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          {/* Logo / Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-primary/20 items-center justify-center mb-5">
              <Ionicons name="wallet-outline" size={40} color="#6C5CE7" />
            </View>
            <Text className="text-white font-space-bold text-3xl">
              LembrePay
            </Text>
            <Text className="text-text-secondary font-space-regular text-base mt-2">
              Nunca esqueça suas assinaturas
            </Text>
          </View>

          {/* Login Form */}
          <View className="bg-background-card rounded-3xl p-6 border border-background-elevated">
            <Text className="text-white font-space-bold text-xl mb-6">
              Entrar
            </Text>

            <Input
              label="Email"
              icon="mail-outline"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Senha"
              icon="lock-closed-outline"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              isLoading={isLoading}
              className="mt-2"
            />
          </View>

          {/* Register Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className="text-text-secondary font-space-regular text-sm">
              Não tem uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="text-primary font-space-semibold text-sm">
                Criar conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
