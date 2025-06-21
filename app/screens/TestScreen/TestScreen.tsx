import { useLang, useT } from "@/src/shared/lib/hooks";
import {
  useBottomSheetStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import {
  Button,
  Layout,
  PaddingLayout,
  PlusIcon,
  ProgressBar,
  Text,
} from "@/src/shared/ui";
import { FC } from "react";

import { ChatBackground } from "@/src/features";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { FormField, Header } from "../../../src/widgets";

interface TestScreenProps {}

const TestScreen: FC<TestScreenProps> = () => {
  const t = useT();
  const { window } = useDeviceStore();
  const { colors, toggleTheme, theme } = useThemeStore();
  const { toggleLanguage, locale } = useLang();
  const { navigateToFlow, setBottomSheetVisible } = useBottomSheetStore();

  const question =
    "Какие три ценности (например, свобода, семья, творчество, стабильность) для вас наиболее важны? \nПочему они значимы?";

  const handleEmptyAnswer = () => {
    navigateToFlow("test", "skip");

    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 150);
  };

  const title = "5" + " " + t("shared.info.of") + " " + "40";
  const subtitle = "Ценности и приоритеты";

  return (
    <Layout style={{ flex: 1 }}>
      <ChatBackground />
      <Header
        title={title}
        subtitle={subtitle}
        backButton
        rightIcon={{
          icon: (
            <View style={{ transform: [{ rotate: "45deg" }] }}>
              <PlusIcon color={colors.contrast} size={26} />
            </View>
          ),
          onPress: () => {
            navigateToFlow("test", "exit");

            setTimeout(() => {
              setBottomSheetVisible(true);
            }, 150);
          },
        }}
      />
      <PaddingLayout style={{ marginHorizontal: 65, marginTop: -2 }}>
        <ProgressBar progress={5} />
      </PaddingLayout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <PaddingLayout
            style={{
              marginTop: 30,
              minHeight: window.height - 200,
            }}
          >
            <Text
              size="medium"
              color={colors.contrast}
              style={{ marginBottom: 6 }}
            >
              {t("test.question")}
            </Text>

            <Text color={colors.contrast} size="extraLarge">
              {question}
            </Text>

            <View style={{ marginTop: 30 }}>
              <FormField
                value={""}
                onChange={() => {}}
                field={{
                  key: "value",
                  type: "textarea",
                  label: t("test.yourAnswer"),
                  placeholder: t("test.enterAnswer"),
                }}
              />
            </View>

            <View style={{ marginTop: "auto", gap: 10 }}>
              {/* <Button
                backgroundColor={colors.alternate}
                onPress={() => {
                  navigateToFlow("test", "skip");

                  setTimeout(() => {
                    setBottomSheetVisible(true);
                  }, 150);
                }}
                disabled={false}
                isLoading={false}
              >
                {t("shared.actions.skip")}
              </Button> */}
              <Button
                backgroundColor={
                  theme === "dark" ? colors.accent : colors.primary
                }
                textColor={theme === "dark" ? colors.primary : colors.white}
                onPress={handleEmptyAnswer}
                disabled={false}
                isLoading={false}
              >
                {t("shared.actions.next")}
              </Button>
            </View>
          </PaddingLayout>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default TestScreen;
