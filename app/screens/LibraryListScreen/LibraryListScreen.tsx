import { FC } from "react";
import { Divider, Layout, Chip, BottomSheet, TitleText } from "@/src/shared/ui";
import { FiltersPanel, Header, useHeaderStore } from "@/src/widgets";
import { usePullToAction, useT } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { ScrollView, View, Animated } from "react-native";
import { CalendarIcon, UserBorderIcon, DotsIcon } from "@/src/shared/ui/icons";
import { createStyles } from "./LibraryListScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";
import { JournalsList, PreviewBlock } from "@/src/features";
import { PATHS } from "@/src/shared/const";

interface LibraryListScreenProps {}

const LibraryListScreen: FC<LibraryListScreenProps> = () => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const styles = createStyles(colors);
  const { subtitle, title } = useHeaderStore();
  // const { handleScroll, handleScrollEnd, visibleAnimation } = usePullToAction({
  //   onAction: navigation.goBack,
  // });

  return (
    <Layout>
      <Header
        backButton
        title={title}
        subtitle={subtitle}
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
        style={{ paddingTop: 16 }}
        initialIndex={0}
        staticMode
        topElement={<View style={{ height: 41 }} />}
        pinnedElement={
          <View>
            <FiltersPanel style={styles.filtersPanel} />
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          </View>
        }
      >
        {/* <Animated.View style={[styles.pullIcon, visibleAnimation]}>
            <BackSquareIcon color={colors.contrast} size={24} />
          </Animated.View> */}
        <JournalsList onPress={() => {}} />
      </BottomSheet>
    </Layout>
  );
};

export default LibraryListScreen;
