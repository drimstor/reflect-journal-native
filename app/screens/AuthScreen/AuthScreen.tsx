import { Layout, Text, Button, CheckBox, TextField } from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { View, ScrollView } from "react-native";
import { createStyles } from "./AuthScreen.styles";
import { useThemeStore } from "@/src/shared/store";
import { useGetPadding } from "@/src/shared/lib/hooks";
import { useT } from "@/src/shared/lib/hooks";

const AuthScreen = ({
  variant = "signIn",
}: {
  variant?: "signIn" | "signUp";
}) => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { paddingHorizontal } = useGetPadding();
  const styles = createStyles(colors);

  return (
    <Layout>
      <Header title={t(`auth.${variant}.title`)} />
      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal }]}
      >
        <TextField
          placeholder={t("auth.email.placeholder")}
          label={t("auth.email.label")}
          value=""
          onChangeText={() => {}}
          backgroundColor={colors.secondary}
        />
        <TextField
          placeholder={t("auth.password.placeholder")}
          secureTextEntry
          label={t("auth.password.label")}
          value=""
          onChangeText={() => {}}
          backgroundColor={colors.secondary}
          // helperText={t("auth.password.helper")}
        />
        {variant === "signUp" && (
          <TextField
            placeholder={t("auth.confirmPassword.placeholder")}
            label={t("auth.confirmPassword.label")}
            secureTextEntry
            value=""
            onChangeText={() => {}}
            backgroundColor={colors.secondary}
            // helperText={t("auth.confirmPassword.helper")}
          />
        )}

        {variant === "signIn" && (
          <View style={styles.rememberMeContainer}>
            <View style={styles.checkboxBox}>
              <CheckBox
                checked={false}
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
          onPress={() => {}}
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

        <Button backgroundColor={colors.contrast} onPress={() => {}}>
          {t(`auth.signIn.withGoogle`)}
        </Button>
      </ScrollView>
    </Layout>
  );
};

export default AuthScreen;
