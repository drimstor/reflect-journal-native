import React, { FC, useEffect, useState } from "react";
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
import { Header, useHeaderStore } from "@/src/widgets";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { formatDate, getWeekDay } from "@/src/shared/lib/helpers";
import { stringToColor } from "@/src/shared/lib/helpers";
import { ChecklistItem } from "@/src/entities/goals/model/types";

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

  const handleCheckboxToggle = (id: string) => {
    setCheckboxes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_completed: !item.is_completed } : item
      )
    );
  };

  const route = useRoute();
  const { type, item } = route.params as any;

  const [checkboxes, setCheckboxes] = useState<ChecklistItem[]>(
    item?.checklist
  );

  console.log(item);

  const { subtitle } = useHeaderStore();

  const title = item?.name;

  const weekDay = getWeekDay(item?.created_at);

  return (
    <Layout>
      <Header
        title={title || type}
        subtitle={subtitle || weekDay}
        backButton
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} size={22} />,
          onPress: () => {},
        }}
      />
      <BottomSheet
        snapPoints={[window.height - 85]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        style={{ paddingTop: 25 }}
        initialIndex={0}
        staticMode
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
            style={{ maxHeight: window.height - 160 }}
          >
            {type !== "Journals" && (
              <View
                style={[
                  styles.titleBox,
                  // { maxWidth: window.width - 60 }
                ]}
              >
                <Text size="extraLarge" font="bold" color={colors.contrast}>
                  {item?.name}
                </Text>
                <Chip
                  color={stringToColor(item?.related_topics[0])}
                  title={item?.related_topics[0]}
                />
              </View>
            )}
            <View style={styles.infoTableBox}>
              <View style={styles.infoTableItem}>
                <InfoBox
                  label="Created"
                  icon={
                    <CalendarIcon variant="outlined" color={colors.contrast} />
                  }
                  value={`${formatDate(item?.created_at)}, ${getWeekDay(
                    item?.created_at
                  )}`}
                  color={colors.contrast}
                />
              </View>
              <View style={styles.infoTableItem}>
                <InfoBox
                  label="Last updated"
                  icon={
                    <CalendarIcon variant="outlined" color={colors.contrast} />
                  }
                  value={`${formatDate(item?.updated_at)}, ${getWeekDay(
                    item?.updated_at
                  )}`}
                  color={colors.contrast}
                />
              </View>
              <View style={styles.infoTableItem}>
                <InfoBox
                  label="Assigned to"
                  icon={<UserBorderIcon color={colors.contrast} />}
                  value="Tony Ware"
                  color={colors.contrast}
                />
              </View>
            </View>
            <Divider style={styles.divider} color={colors.alternate} />
            {item?.content && (
              <>
                <TitleText
                  text="Content"
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <Text color={colors.contrast}>{item?.content}</Text>
                <Divider style={styles.divider} color={colors.alternate} />
              </>
            )}
            {item?.ai_response && (
              <>
                <TitleText
                  text="AI response"
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <Text color={colors.contrast}>{item?.ai_response}</Text>
                <Divider style={styles.divider} color={colors.alternate} />
              </>
            )}
            {item?.checklist && (
              <>
                <TitleText
                  text="Check list"
                  textColor={colors.contrast}
                  element={<DotsIcon color={colors.contrast} size={22} />}
                  variant="subTitle"
                  style={styles.titleText}
                />
                <CheckboxList>
                  {checkboxes?.map((item: ChecklistItem) => (
                    <CheckBox
                      textDecoration
                      key={item.id}
                      checked={item.is_completed}
                      onPress={() => handleCheckboxToggle(item.id)}
                      text={item.title}
                    />
                  ))}
                </CheckboxList>
              </>
            )}
          </ScrollView>
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default LibraryItemScreen;
