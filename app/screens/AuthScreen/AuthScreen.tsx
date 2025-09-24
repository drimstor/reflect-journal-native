import {
  useBottomSheetIndexState,
  useKeyboard,
  useT,
  useToggle,
} from "@/src/shared/lib/hooks";
import { useBottomSheetStore, useThemeStore } from "@/src/shared/store";
import {
  BottomSheet,
  BottomSheetBox,
  BottomSheetHeader,
  Button,
  CheckBox,
  Layout,
  PaddingLayout,
  Separator,
  Text,
  TextField,
} from "@/src/shared/ui";
import {
  AppleIcon,
  ConvertShapeIcon,
  GoogleIcon,
  MessageIcon,
} from "@/src/shared/ui/icons";
import { Header } from "@/src/widgets";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { createStyles } from "./AuthScreen.styles";
import { initialValues } from "./const/static";
import { useAppleAuth } from "./lib/hooks/useAppleAuth";
import { useGoogleAuth } from "./lib/hooks/useGoogleAuth";
import { useSubmit } from "./lib/hooks/useSubmit";
import { TextFields, ValidationErrors, Variant } from "./model/types";

const AuthScreen = () => {
  const t = useT();
  const { colors, theme, toggleTheme } = useThemeStore();
  const styles = createStyles(colors);
  const { value: isRememberMe, toggle: toggleRememberMe } = useToggle(true);
  const [variant, setVariant] = useState<Variant>("splash");
  const { promptAsync } = useGoogleAuth();
  const { signInWithApple, isAvailable: isAppleAvailable } = useAppleAuth();

  const isAuthVariant = ["signIn", "signUp"].includes(variant);

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

  const { bottomSheetRef, snapToIndex, closeBottomSheet } =
    useBottomSheetIndexState();
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const { bottomSheetHeight } = useBottomSheetStore();

  const getSnapPoints = useCallback(() => {
    const baseHeight = bottomSheetHeight ? bottomSheetHeight : 0.01;
    return [baseHeight + (isKeyboardVisible ? keyboardHeight - 45 : 0)];
  }, [keyboardHeight, isKeyboardVisible, bottomSheetHeight]);

  useEffect(() => {
    setTimeout(() => {
      snapToIndex(0);
    }, 1000);
  }, [snapToIndex]);

  return (
    <Layout>
      <Header
        leftIcon={{
          icon: <MessageIcon color={colors.contrast} />,
          onPress: toggleTheme,
        }}
        rightIcon={{
          icon: <ConvertShapeIcon color={colors.contrast} />,
          onPress: () => {
            setVariant(variant === "signIn" ? "signUp" : "signIn");
            setErrors({});
          },
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={getSnapPoints()}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        paddingHorizontal={1}
        initialIndex={-1}
        onClose={closeBottomSheet}
        staticMode
        style={styles.bottomSheet}
      >
        <BottomSheetBox>
          <BottomSheetHeader
            onBack={
              !!isAuthVariant &&
              (() => {
                setVariant("splash");
                setErrors({});
              })
            }
            title={t(`auth.${variant}.title`)}
          />
          <PaddingLayout style={styles.formBox}>
            {isAuthVariant && (
              <>
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
                    helperTextColor={
                      errors.confirmPassword ? colors.error : undefined
                    }
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
              </>
            )}
            <Button
              backgroundColor={colors.contrast}
              style={styles.submitButton}
              isLoading={isAuthLoading}
              onPress={
                isAuthVariant ? handleSubmit : () => setVariant("signIn")
              }
            >
              {t(`auth.${variant}.submit`)}
            </Button>
            <View style={styles.separator}>
              <Separator marginVertical={2} />
            </View>
            <View style={styles.socialsContainer}>
              <Button backgroundColor={colors.contrast} onPress={promptAsync}>
                <GoogleIcon />
              </Button>
              {isAppleAvailable && (
                <Button
                  backgroundColor={colors.contrast}
                  onPress={signInWithApple}
                >
                  <AppleIcon color={colors.contrastReverse} />
                </Button>
              )}
            </View>
            {isAuthVariant && (
              <View style={styles.haveAccountContainer}>
                <Text color={colors.contrast}>
                  {t(`auth.${variant}.haveAccount`)}
                </Text>
                <Pressable
                  onPress={() =>
                    setVariant(variant === "signIn" ? "signUp" : "signIn")
                  }
                >
                  <Text
                    color={theme === "dark" ? colors.accent : "#3e667a"}
                    font="bold"
                  >
                    {t(`auth.${variant}.lets`)}
                  </Text>
                </Pressable>
              </View>
            )}
          </PaddingLayout>
        </BottomSheetBox>
      </BottomSheet>
    </Layout>
  );
};

export default AuthScreen;
