import { usePrefetch, useT, useToggle } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import {
  AnimatedAppearance,
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
import { AppleIcon, GoogleIcon } from "@/src/shared/ui/icons";
import { FormField } from "@/src/widgets";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { lazy, Suspense, useState } from "react";
import { Pressable, View } from "react-native";
import { APP_NAME } from "../../../src/shared/const";
import { createStyles } from "./AuthScreen.styles";
import { useAppleAuth } from "./lib/hooks/useAppleAuth";
import { useAuthBottomSheet } from "./lib/hooks/useAuthBottomSheet";
import { useAuthForm } from "./lib/hooks/useAuthForm";
import { useAuthFormConfig } from "./lib/hooks/useAuthFormConfig";
import { useGoogleAuth } from "./lib/hooks/useGoogleAuth";
import { useOnboarding } from "./lib/hooks/useOnboarding";
import { Variant } from "./model/types";

// Динамический импорт компонентов онбординга
const OnboardingHeader = lazy(() =>
  import("./ui/OnboardingHeader/OnboardingHeader").then((module) => ({
    default: module.OnboardingHeader,
  }))
);

const OnboardingSection = lazy(() =>
  import("./ui/OnboardingSection/OnboardingSection").then((module) => ({
    default: module.OnboardingSection,
  }))
);

const SuccessOverlay = lazy(() =>
  import("./ui/SuccessOverlay/SuccessOverlay").then((module) => ({
    default: module.SuccessOverlay,
  }))
);

const AuthScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const styles = createStyles(colors);
  const { prefetchJournals } = usePrefetch();
  const { value: isRememberMe, toggle: toggleRememberMe } = useToggle(true);

  const [variant, setVariant] = useState<Variant>("splash");
  const isAuthVariant = ["signIn", "signUp"].includes(variant);

  const { bottomSheetRef, snapToIndex, getSnapPoints } = useAuthBottomSheet({
    setVariant,
  });

  // -----------  Onboarding  ----------- //

  const {
    isWelcomeVisible,
    isOnboardingStepsLoading,
    isOnboardingVariant,
    currentSubmitRef,
    handleOnboardingStep,
    handleContinue,
    isSuccessVisible,
  } = useOnboarding({ variant, setVariant, snapToIndex });

  // -----------  Auth Form  ----------- //

  // Получаем конфигурацию формы
  const formConfig = useAuthFormConfig(variant);

  // Инициализируем форму
  const { values, errors, handleChange, handleSubmit, isLoading } = useAuthForm(
    formConfig,
    variant,
    snapToIndex,
    setVariant,
    prefetchJournals
  );

  // ----------- Social Auth  ----------- //

  const { promptAsync } = useGoogleAuth({ setVariant, snapToIndex });
  const { signInWithApple, isAvailable: isAppleAvailable } = useAppleAuth({
    setVariant,
    snapToIndex,
  });

  // ---------------------- //

  const handleBack = () => {
    if (isAuthVariant) {
      return () => setVariant("splash");
    }
    if (isOnboardingVariant && variant !== "profile") {
      return () => handleOnboardingStep("previous");
    }

    return undefined;
  };

  return (
    <Layout>
      {(isOnboardingVariant || isWelcomeVisible || isSuccessVisible) && (
        <Suspense fallback={null}>
          <OnboardingHeader
            variant={variant}
            isWelcomeVisible={isWelcomeVisible}
          />
          <SuccessOverlay
            isWelcomeVisible={isWelcomeVisible}
            isSuccessVisible={isSuccessVisible}
          />
        </Suspense>
      )}
      <AnimatedAppearance isVisible={!isOnboardingVariant && !!variant}>
        <View
          style={{
            position: "absolute",
            top: 45,
            left: (WINDOW_WIDTH - (WINDOW_WIDTH - 300)) / 2,
            gap: 10,
          }}
        >
          <Image
            source={require("@/assets/images/logo.png")}
            style={{
              height: WINDOW_WIDTH - 300,
              width: WINDOW_WIDTH - 300,
            }}
          />
          <Text
            font="thin"
            style={{ fontSize: 28, textAlign: "center", lineHeight: 32 }}
            color={colors.contrast}
          >
            {APP_NAME}
          </Text>
        </View>
      </AnimatedAppearance>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={getSnapPoints()}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        paddingHorizontal={1}
        initialIndex={0}
        staticMode
        style={styles.bottomSheet}
      >
        <BottomSheetBox>
          <AnimatedAppearance
            isVisible={!isWelcomeVisible && !!variant}
            duration={0}
          >
            <BottomSheetHeader onBack={handleBack()} title={formConfig.title} />
          </AnimatedAppearance>
          {(variant === "splash" || isAuthVariant) && (
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
                          onPress={() => toggleRememberMe(!isRememberMe)}
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
          )}

          {isOnboardingVariant && (
            <Suspense
              fallback={<View style={{ height: WINDOW_HEIGHT - 292 }} />}
            >
              <OnboardingSection
                variant={variant}
                isWelcomeVisible={isWelcomeVisible}
                isOnboardingStepsLoading={isOnboardingStepsLoading}
                currentSubmitRef={currentSubmitRef}
                handleContinue={handleContinue}
              />
            </Suspense>
          )}
        </BottomSheetBox>
      </BottomSheet>
    </Layout>
  );
};

export default AuthScreen;
