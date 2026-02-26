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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  function validate() {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório";
    else if (name.trim().length < 3) newErrors.name = "Mínimo de 3 caracteres";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email inválido";
    if (!password.trim()) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Senhas não conferem";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    try {
      await register(name.trim(), email.trim(), password);
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
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-3xl bg-secondary/20 items-center justify-center mb-5">
              <Ionicons name="person-add-outline" size={36} color="#00D2D3" />
            </View>
            <Text className="text-white font-space-bold text-3xl">
              Criar Conta
            </Text>
            <Text className="text-text-secondary font-space-regular text-base mt-2">
              Comece a gerenciar suas assinaturas
            </Text>
          </View>

          {/* Register Form */}
          <View className="bg-background-card rounded-3xl p-6 border border-background-elevated">
            <Input
              label="Nome"
              icon="person-outline"
              placeholder="Seu nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
            />

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              isPassword
              error={errors.password}
            />

            <Input
              label="Confirmar Senha"
              icon="shield-checkmark-outline"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword
              error={errors.confirmPassword}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              isLoading={isLoading}
              className="mt-2"
            />
          </View>

          {/* Login Link */}
          <View className="flex-row items-center justify-center mt-6 mb-8">
            <Text className="text-text-secondary font-space-regular text-sm">
              Já tem uma conta?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary font-space-semibold text-sm">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
