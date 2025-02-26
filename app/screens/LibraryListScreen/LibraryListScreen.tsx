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
  Button,
  PaddingLayout,
} from "@/src/shared/ui";
import { FiltersPanel, Header, useHeaderStore } from "@/src/widgets";
import { usePullToAction, useT } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { ScrollView, View, Animated, Pressable } from "react-native";
import {
  CalendarIcon,
  UserBorderIcon,
  DotsIcon,
  BackSquareIcon,
} from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryListScreen.styles";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { PreviewBlock } from "@/src/features";
import { PATHS } from "@/src/shared/const";

interface LibraryListScreenProps {}

const LibraryListScreen: FC<LibraryListScreenProps> = () => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const { subtitle } = useHeaderStore();
  const { handleScroll, handleScrollEnd, visibleAnimation } = usePullToAction({
    onAction: navigation.goBack,
  });

  return (
    <Layout>
      <Header backButton title={subtitle} />
      <BottomSheet
        snapPoints={[window.height - 85]}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        style={{ paddingTop: 25 }}
        initialIndex={1}
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
          >
            <View>
              <FiltersPanel style={styles.filtersPanel} />
              <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
            </View>
            <View style={styles.previewBox}>
              <PreviewBlock
                colors={colors}
                title="Plan for the next month"
                value="Prepare a content plan for Dribbble for September"
                backgroundColor={colors.light}
                backgroundColorForAnimate={colors.alternate}
                onPress={() => navigation.navigate(PATHS.LIBRARY_ITEM)}
                element={
                  <Chip
                    textColor={colors.white}
                    color={colors.error}
                    title="High Priority"
                  />
                }
                infoBoxes={[
                  {
                    label: "Due date",
                    value: "Aug 25",
                    icon: (
                      <CalendarIcon
                        variant="outlined"
                        color={colors.contrast}
                      />
                    ),
                  },
                  {
                    label: "Assigned to",
                    value: "Tony Ware",
                    icon: <UserBorderIcon color={colors.contrast} />,
                  },
                ]}
              />

              <PreviewBlock
                colors={colors}
                title="Plan for the next month"
                value="Prepare a content plan for Dribbble for September"
                element={<Chip color={colors.alternate} title="Priority" />}
                backgroundColor={colors.light}
                backgroundColorForAnimate={colors.alternate}
                onPress={() => navigation.navigate(PATHS.LIBRARY_ITEM)}
                infoBoxes={[
                  {
                    label: "Due date",
                    value: "Aug 25",
                    icon: (
                      <CalendarIcon
                        variant="outlined"
                        color={colors.contrast}
                      />
                    ),
                  },
                ]}
              />
            </View>
          </ScrollView>
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default LibraryListScreen;
