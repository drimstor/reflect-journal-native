import { useGetPadding, useT, useToggle } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { Button, CheckBox, Layout, Text, TextField } from "@/src/shared/ui";
import { ConvertShapeIcon, MessageIcon } from "@/src/shared/ui/icons";
import { Header } from "@/src/widgets";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { createStyles } from "./AuthScreen.styles";
import { initialValues } from "./const/static";
import { useGoogleAuth } from "./lib/hooks/useGoogleAuth";
import { useSubmit } from "./lib/hooks/useSubmit";
import { TextFields, ValidationErrors, Variant } from "./model/types";

const AuthScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors);
  const { value: isRememberMe, toggle: toggleRememberMe } = useToggle(true);
  const [variant, setVariant] = useState<Variant>("signIn");
  const { promptAsync } = useGoogleAuth();

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
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

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
