import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuthStore } from "../../stores/authStore";

const { width } = Dimensions.get("window");

type ScreenMode = "welcome" | "login" | "register";

export default function WelcomeScreen() {
  const [mode, setMode] = useState<ScreenMode>("welcome");
  const { login, register, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regErrors, setRegErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const contentFade = useRef(new Animated.Value(1)).current;
  const featureFade1 = useRef(new Animated.Value(0)).current;
  const featureFade2 = useRef(new Animated.Value(0)).current;
  const featureFade3 = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(200, [
        Animated.timing(featureFade1, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(featureFade2, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(featureFade3, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  function switchMode(newMode: ScreenMode) {
    Animated.timing(contentFade, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setMode(newMode);
      setLoginErrors({});
      setRegErrors({});
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }

  function validateLogin() {
    const errs: typeof loginErrors = {};
    if (!email.trim()) errs.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email inválido";
    if (!password.trim()) errs.password = "Senha é obrigatória";
    else if (password.length < 6) errs.password = "Mínimo de 6 caracteres";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleLogin() {
    if (!validateLogin()) return;
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  function validateRegister() {
    const errs: typeof regErrors = {};
    if (!regName.trim()) errs.name = "Nome é obrigatório";
    else if (regName.trim().length < 3) errs.name = "Mínimo de 3 caracteres";
    if (!regEmail.trim()) errs.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = "Email inválido";
    if (!regPassword.trim()) errs.password = "Senha é obrigatória";
    else if (regPassword.length < 6) errs.password = "Mínimo de 6 caracteres";
    if (regPassword !== regConfirmPassword)
      errs.confirmPassword = "Senhas não conferem";
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleRegister() {
    if (!validateRegister()) return;
    try {
      await register(regName.trim(), regEmail.trim(), regPassword);
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  const features = [
    {
      icon: "notifications-outline" as const,
      title: "Lembretes Inteligentes",
      subtitle: "Nunca perca uma data de vencimento",
      anim: featureFade1,
    },
    {
      icon: "pie-chart-outline" as const,
      title: "Controle Total",
      subtitle: "Veja todos os seus gastos recorrentes",
      anim: featureFade2,
    },
    {
      icon: "shield-checkmark-outline" as const,
      title: "Seguro & Privado",
      subtitle: "Seus dados sempre protegidos",
      anim: featureFade3,
    },
  ];

  function renderLoading() {
    const loadingText = mode === "login" ? "Entrando..." : "Cadastrando...";
    return (
      <View className="absolute inset-0 z-50 items-center justify-center bg-background/90">
        <View className="items-center bg-background-card rounded-3xl p-8 border border-primary/20">
          <ActivityIndicator size="large" color="#6C5CE7" />
          <Text className="text-white font-space-semibold text-lg mt-4">
            {loadingText}
          </Text>
          <Text className="text-text-muted font-space-regular text-sm mt-1">
            Aguarde um momento...
          </Text>
        </View>
      </View>
    );
  }

  function renderWelcome() {
    return (
      <>
        <View className="my-6">
          {features.map((feature, index) => (
            <Animated.View
              key={index}
              style={{ opacity: feature.anim }}
              className="flex-row items-center bg-background-card/80 rounded-2xl p-4 mb-3 border border-background-elevated"
            >
              <View className="w-12 h-12 rounded-xl bg-primary/15 items-center justify-center mr-4">
                <Ionicons name={feature.icon} size={24} color="#A29BFE" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-space-semibold text-base">
                  {feature.title}
                </Text>
                <Text className="text-text-muted font-space-regular text-sm mt-0.5">
                  {feature.subtitle}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <Animated.View
          style={{
            opacity: buttonFade,
            transform: [{ translateY: buttonSlide }],
          }}
          className="mb-4"
        >
          <Button
            title="Criar Conta"
            variant="primary"
            size="lg"
            onPress={() => switchMode("register")}
            className="mb-3"
          />
          <Button
            title="Já tenho uma conta"
            variant="secondary"
            size="lg"
            onPress={() => switchMode("login")}
          />
          <Text className="text-text-muted font-space-regular text-xs text-center mt-4">
            Ao continuar, você concorda com nossos{" "}
            <Text className="text-primary-light">Termos de Uso</Text> e{" "}
            <Text className="text-primary-light">Política de Privacidade</Text>
          </Text>
        </Animated.View>
      </>
    );
  }

  function renderLogin() {
    return (
      <View className="flex-1 justify-center">
        <View className="bg-background-card rounded-3xl p-6 border border-background-elevated mb-4">
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
            error={loginErrors.email}
          />

          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Sua senha"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={loginErrors.password}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            isLoading={isLoading}
            className="mt-2"
          />
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="text-text-secondary font-space-regular text-sm">
            Não tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => switchMode("register")}>
            <Text className="text-primary font-space-semibold text-sm">
              Criar conta
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => switchMode("welcome")}
          className="flex-row items-center justify-center mt-4"
        >
          <Ionicons name="arrow-back" size={16} color="#A0A0B8" />
          <Text className="text-text-secondary font-space-regular text-sm ml-1">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderRegister() {
    return (
      <View className="flex-1 justify-center">
        <View className="bg-background-card rounded-3xl p-6 border border-background-elevated mb-4">
          <Text className="text-white font-space-bold text-xl mb-6">
            Criar Conta
          </Text>

          <Input
            label="Nome"
            icon="person-outline"
            placeholder="Seu nome completo"
            value={regName}
            onChangeText={setRegName}
            autoCapitalize="words"
            error={regErrors.name}
          />

          <Input
            label="Email"
            icon="mail-outline"
            placeholder="seu@email.com"
            value={regEmail}
            onChangeText={setRegEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={regErrors.email}
          />

          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Mínimo 6 caracteres"
            value={regPassword}
            onChangeText={setRegPassword}
            isPassword
            error={regErrors.password}
          />

          <Input
            label="Confirmar Senha"
            icon="shield-checkmark-outline"
            placeholder="Repita sua senha"
            value={regConfirmPassword}
            onChangeText={setRegConfirmPassword}
            isPassword
            error={regErrors.confirmPassword}
          />

          <Button
            title="Criar Conta"
            onPress={handleRegister}
            isLoading={isLoading}
            className="mt-2"
          />
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="text-text-secondary font-space-regular text-sm">
            Já tem uma conta?{" "}
          </Text>
          <TouchableOpacity onPress={() => switchMode("login")}>
            <Text className="text-primary font-space-semibold text-sm">
              Entrar
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => switchMode("welcome")}
          className="flex-row items-center justify-center mt-4"
        >
          <Ionicons name="arrow-back" size={16} color="#A0A0B8" />
          <Text className="text-text-secondary font-space-regular text-sm ml-1">
            Voltar
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <Animated.View
        style={{
          position: "absolute",
          top: -100,
          left: width / 2 - 200,
          width: 400,
          height: 400,
          borderRadius: 200,
          opacity: glowAnim,
        }}
      >
        <LinearGradient
          colors={["#6C5CE7", "#A29BFE", "transparent"]}
          style={{ width: 400, height: 400, borderRadius: 200 }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          bottom: -50,
          right: -80,
          width: 250,
          height: 250,
          borderRadius: 125,
          opacity: Animated.multiply(glowAnim, 0.5),
        }}
      >
        <LinearGradient
          colors={["#00D2D3", "#55EFC4", "transparent"]}
          style={{ width: 250, height: 250, borderRadius: 125 }}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {isLoading && mode !== "welcome" && renderLoading()}

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="px-6"
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className={`items-center ${mode === "welcome" ? "mt-8" : "mt-4"}`}
            >
              <View className="relative items-center justify-center mb-4">
                <View
                  className={`absolute rounded-full bg-primary/10 ${mode === "welcome" ? "w-28 h-28" : "w-20 h-20"}`}
                />
                <View
                  className={`rounded-3xl bg-primary/20 items-center justify-center border border-primary/30 ${mode === "welcome" ? "w-24 h-24" : "w-16 h-16"}`}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={mode === "welcome" ? 48 : 32}
                    color="#6C5CE7"
                  />
                </View>
              </View>

              <Text
                className={`text-white font-space-bold tracking-wider ${mode === "welcome" ? "text-4xl" : "text-2xl"}`}
              >
                LembrePay
              </Text>

              {mode === "welcome" && (
                <Text className="text-text-secondary font-space-regular text-lg text-center mt-3 leading-7">
                  Gerencie suas assinaturas{"\n"}de forma inteligente
                </Text>
              )}
            </Animated.View>

            <Animated.View style={{ opacity: contentFade, flex: 1 }}>
              {mode === "welcome" && renderWelcome()}
              {mode === "login" && renderLogin()}
              {mode === "register" && renderRegister()}
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
