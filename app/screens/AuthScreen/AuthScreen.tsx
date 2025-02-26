import { Layout, Text, Button, CheckBox, TextField } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { View, ScrollView } from "react-native";
import { createStyles } from "./AuthScreen.styles";
import { useThemeStore } from "@/src/shared/store";
import { useGetPadding, useToggle } from "@/src/shared/lib/hooks";
import { useT } from "@/src/shared/lib/hooks";
import { ConvertShapeIcon, MessageIcon } from "@/src/shared/ui/icons";
import { useState, useEffect } from "react";
import { useSubmit } from "./lib/hooks/useSubmit";
import { TextFields, ValidationErrors, Variant } from "./model/types";
import { initialValues } from "./const/static";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useLoginMutation, useRegisterMutation } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";

WebBrowser.maybeCompleteAuthSession();

const AuthScreen = ({}: {}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors);
  const { value: isRememberMe, toggle: toggleRememberMe } = useToggle(true);
  const [variant, setVariant] = useState<Variant>("signIn");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [textFields, setTextFields] = useState<TextFields>(initialValues);
  const { handleSubmit, isAuthLoading } = useSubmit({
    textFields,
    variant,
    setErrors,
  });

  const handleFieldChange =
    (field: keyof typeof textFields) => (text: string) => {
      setTextFields((prev) => ({ ...prev, [field]: text }));
      // Очищаем ошибку при изменении поля
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const navigation = useNavigation<NavigationProps>();

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  console.log({ isRegisterLoading });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "308267307050-pghmdpm9d7crv6e0bvksomgbi5h1evni.apps.googleusercontent.com",
    iosClientId:
      "308267307050-mse62gb85rn0f2akgnoa99d7osdbmqss.apps.googleusercontent.com",
    androidClientId:
      "308267307050-5ge3nd796or4u5unjadds0ark58cvie5.apps.googleusercontent.com",
  });

  type User = {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
  };

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user: User = await response.json();

      registerMutation({
        email: user.email,
        name: user.name || user.given_name + " " + user.family_name,
        avatar_url: user.picture,
        password: user.id,
      })
        .unwrap()
        .then(() => {
          navigation.navigate(PATHS.MAIN_STACK);
        })
        .catch((error) => {
          if (error.status === 409) {
            loginMutation({
              email: user.email,
              password: user.id,
            })
              .unwrap()
              .then(() => {
                navigation.navigate(PATHS.MAIN_STACK);
              })
              .catch((error) => {
                console.log({ error });
              });
          }
        });
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleSingInWithGoogle = async () => {
    try {
      if (
        response?.type === "success" &&
        response.authentication?.accessToken
      ) {
        await getUserInfo(response.authentication.accessToken);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  useEffect(() => {
    handleSingInWithGoogle();
  }, [response]);

  return (
    <Layout>
      <Header
        title={t(`auth.${variant}.title`)}
        leftIcon={{
          icon: <MessageIcon color={colors.contrast} />,
          onPress: () => {},
        }}
        rightIcon={{
          icon: <ConvertShapeIcon color={colors.contrast} />,
          onPress: () => {
            setVariant(variant === "signIn" ? "signUp" : "signIn");
            setErrors({});
          },
        }}
      />
      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal }]}
      >
        {variant === "signUp" && (
          <TextField
            placeholder={t("auth.name.placeholder")}
            label={t("auth.name.label")}
            value={textFields.name}
            onChangeText={handleFieldChange("name")}
            backgroundColor={colors.secondary}
            helperText={errors.name}
            helperTextColor={errors.name ? colors.error : undefined}
          />
        )}
        <TextField
          placeholder={t("auth.email.placeholder")}
          label={t("auth.email.label")}
          value={textFields.email}
          onChangeText={handleFieldChange("email")}
          backgroundColor={colors.secondary}
          helperText={errors.email}
          helperTextColor={errors.email ? colors.error : undefined}
        />
        <TextField
          placeholder={t("auth.password.placeholder")}
          secureTextEntry
          label={t("auth.password.label")}
          value={textFields.password}
          onChangeText={handleFieldChange("password")}
          backgroundColor={colors.secondary}
          helperText={errors.password}
          helperTextColor={errors.password ? colors.error : undefined}
        />
        {variant === "signUp" && (
          <TextField
            placeholder={t("auth.confirmPassword.placeholder")}
            label={t("auth.confirmPassword.label")}
            secureTextEntry
            value={textFields.confirmPassword}
            onChangeText={handleFieldChange("confirmPassword")}
            backgroundColor={colors.secondary}
            helperText={errors.confirmPassword}
            helperTextColor={errors.confirmPassword ? colors.error : undefined}
          />
        )}

        {variant === "signIn" && (
          <View style={styles.rememberMeContainer}>
            <View style={styles.checkboxBox}>
              <CheckBox
                checked={isRememberMe}
                onPress={toggleRememberMe}
                text={t("auth.rememberMe")}
                textStyle={styles.rememberMeText}
              />
            </View>
            <Text
              withOpacity={theme === "dark" ? 90 : undefined}
              color={colors.error}
              style={styles.forgotPassword}
            >
              {t("auth.forgotPassword")}
            </Text>
          </View>
        )}

        <Button
          backgroundColor={colors.contrast}
          style={styles.submitButton}
          onPress={handleSubmit}
          isLoading={isAuthLoading}
        >
          {t(`auth.${variant}.submit`)}
        </Button>

        <View style={styles.separator}>
          <View style={styles.line} />
          <Text color={colors.contrast} style={styles.orText}>
            {t("auth.or")}
          </Text>
          <View style={styles.line} />
        </View>

        <Button backgroundColor={colors.contrast} onPress={promptAsync}>
          {t(`auth.signIn.withGoogle`)}
        </Button>
      </ScrollView>
    </Layout>
  );
};

export default AuthScreen;
