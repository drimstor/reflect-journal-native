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
} from "@/src/shared/ui";
import {
  AppleIcon,
  ConvertShapeIcon,
  GoogleIcon,
  MessageIcon,
} from "@/src/shared/ui/icons";
import { FormField, Header } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { createStyles } from "./AuthScreen.styles";
import { useAppleAuth } from "./lib/hooks/useAppleAuth";
import { useAuthForm } from "./lib/hooks/useAuthForm";
import { useAuthFormConfig } from "./lib/hooks/useAuthFormConfig";
import { useGoogleAuth } from "./lib/hooks/useGoogleAuth";
import { Variant } from "./model/types";

const AuthScreen = () => {
  const t = useT();
  const {
    colors,
    theme,
    toggleTheme,
    setIsBackgroundImage,
    isBackgroundImage,
  } = useThemeStore();
  const styles = createStyles(colors);
  const { value: isRememberMe, toggle: toggleRememberMe } = useToggle(true);
  const [variant, setVariant] = useState<Variant>("splash");
  const { promptAsync } = useGoogleAuth();
  const { signInWithApple, isAvailable: isAppleAvailable } = useAppleAuth();

  const isAuthVariant = ["signIn", "signUp"].includes(variant);

  // ---------------------- //

  const { bottomSheetRef, snapToIndex } = useBottomSheetIndexState();

  // Получаем конфигурацию формы
  const formConfig = useAuthFormConfig(variant);

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit, isLoading } = useAuthForm(
    formConfig,
    variant,
    snapToIndex
  );

  // Мемоизируем обработчик переключения вариантов
  const handleVariantToggle = useCallback(() => {
    setVariant(variant === "signIn" ? "signUp" : "signIn");
  }, [variant]);

  // Обработчик возврата к splash (не сбрасываем форму)
  const handleBackToSplash = useCallback(() => {
    setVariant("splash");
  }, []);
  const { keyboardHeight, isKeyboardVisible } = useKeyboard();
  const { bottomSheetHeight } = useBottomSheetStore();

  const getSnapPoints = useCallback(() => {
    const baseHeight = bottomSheetHeight ? bottomSheetHeight : 0.01;
    return [
      baseHeight + (isKeyboardVisible ? keyboardHeight - 45 : 0),
      WINDOW_HEIGHT - 85,
    ];
  }, [keyboardHeight, isKeyboardVisible, bottomSheetHeight]);

  // const { isVisible, setIsVisible } = useStatusBarStore();

  useEffect(() => {
    // setIsVisible(false);
    setTimeout(() => {
      snapToIndex(0);
    }, 500);
  }, [snapToIndex]);

  // ---------------------- //

  // ---------------------- //

  return (
    <Layout>
      <Header
        leftIcon={{
          icon: <MessageIcon color={colors.contrast} />,
          onPress: () => {
            setIsBackgroundImage(!isBackgroundImage);
          },
        }}
        rightIcon={{
          icon: <ConvertShapeIcon color={colors.contrast} />,
          onPress: toggleTheme,
        }}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={getSnapPoints()}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        paddingHorizontal={1}
        initialIndex={-1}
        staticMode
        style={styles.bottomSheet}
      >
        <BottomSheetBox>
          <BottomSheetHeader
            onBack={!!isAuthVariant && handleBackToSplash}
            title={formConfig.title}
          />
          <PaddingLayout style={styles.formBox}>
            {isAuthVariant && (
              <>
                {formConfig.fields.map((field) => (
                  <FormField
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    error={errors[field.key]}
                    onChange={handleChange}
                  />
                ))}
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
              isLoading={isLoading}
              onPress={
                isAuthVariant ? handleSubmit : () => setVariant("signIn")
              }
            >
              {formConfig.submitText}
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
                <Pressable onPress={handleVariantToggle}>
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
