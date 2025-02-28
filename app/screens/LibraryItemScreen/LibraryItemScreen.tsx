import { FC, useEffect, useState } from "react";
import {
  CheckBox,
  CheckboxList,
  Divider,
  Layout,
  Text,
  Chip,
  TitleText,
  InfoBox,
  BottomSheet,
} from "@/src/shared/ui";
import { Header } from "@/src/widgets";
import { usePullToAction, useT } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { ScrollView, View, Animated } from "react-native";
import {
  CalendarIcon,
  UserBorderIcon,
  DotsIcon,
  BackSquareIcon,
} from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryItemScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { MOCK_CHECKBOXES } from "./const/static";
import { NavigationProps } from "@/src/shared/model/types";

interface LibraryItemScreenProps {}

interface CheckboxItem {
  id: string;
  text: string;
  checked: boolean;
}

const LibraryItemScreen: FC<LibraryItemScreenProps> = () => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const { handleScroll, handleScrollEnd, visibleAnimation } = usePullToAction({
    onAction: navigation.goBack,
  });
  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>(MOCK_CHECKBOXES);

  const handleCheckboxToggle = (id: string) => {
    setCheckboxes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <Layout>
      <Header title="August 25" backButton subtitle="Wednesday" />
      <BottomSheet
        snapPoints={[window.height - 85]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        style={{ paddingTop: 25 }}
        initialIndex={1}
        staticMode
        scrollEnabled={false}
      >
        <View style={styles.animatedView}>
          <Animated.View style={[styles.pullIcon, visibleAnimation]}>
            <BackSquareIcon color={colors.contrast} size={24} />
          </Animated.View>
          <ScrollView
            contentContainerStyle={styles.globalViewHorizontal}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEnd}
            scrollEventThrottle={16}
          >
            <View style={[styles.titleBox, { maxWidth: window.width - 60 }]}>
              <Text size="extraLarge" font="bold" color={colors.contrast}>
                Build a marketing research plan
              </Text>
              <Chip
                textColor={colors.white}
                color={colors.error}
                title="High Priority"
              />
            </View>
            <View style={styles.infoTableBox}>
              <InfoBox
                label="Due date"
                icon={
                  <CalendarIcon variant="outlined" color={colors.contrast} />
                }
                value="Aug 25"
                color={colors.contrast}
              />
              <InfoBox
                label="Assigned to"
                icon={<UserBorderIcon color={colors.contrast} />}
                value="Tony Ware"
                color={colors.contrast}
              />
            </View>
            <Divider style={styles.divider} color={colors.alternate} />
            <Text color={colors.contrast}>
              Create a detailed research plan for a new project that provides
              clear guidance and strategy for successful research execution,
              data collection, and result analysis.
            </Text>
            <Divider style={styles.divider} color={colors.alternate} />
            <TitleText
              text="Check list"
              textColor={colors.contrast}
              element={<DotsIcon color={colors.contrast} size={22} />}
              variant="subTitle"
              style={styles.titleText}
            />
            <CheckboxList>
              {checkboxes.map((item) => (
                <CheckBox
                  textDecoration
                  key={item.id}
                  checked={item.checked}
                  onPress={() => handleCheckboxToggle(item.id)}
                  text={item.text}
                />
              ))}
            </CheckboxList>
          </ScrollView>
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default LibraryItemScreen;
