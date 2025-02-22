import { FC, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Portal } from "@gorhom/portal";
import { BottomSheetAction, BottomSheetActions } from "@/src/widgets";
import {
  Divider,
  Layout,
  TitleText,
  Carousel,
  BottomSheet,
  type BottomSheetRef,
  Chip,
} from "@/src/shared/ui";
import { PreviewCard, ListItemPreview } from "@/src/features";
import { FiltersPanel, Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import {
  useChatStore,
  useDeviceStore,
  useThemeStore,
} from "@/src/shared/store";
import { Animated, View } from "react-native";
import {
  BookIcon,
  ClipboardCheckIcon,
  DirectIcon,
  EditPencilIcon,
  MailIcon,
  TrashIcon,
} from "@/src/shared/ui/icons";
import { styles } from "./LibraryScreen.styles";
import { PATHS } from "@/src/shared/const";
import {
  BookIcon as BookIconAnimated,
  MailIcon as MailIconAnimated,
  ClipboardCheckIcon as ClipboardCheckIconAnimated,
  DirectIcon as DirectIconAnimated,
} from "@/src/shared/ui/iconsAnimated";
import { AnimatedIconProps } from "@/src/shared/ui/iconsAnimated/types";
import * as Haptics from "expo-haptics";

type NavigationProps = BottomTabNavigationProp<any, typeof PATHS.LIBRARY_ITEM>;

interface LibraryScreenProps {}

const LibraryScreen: FC<LibraryScreenProps> = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<NavigationProps>();

  // --------------------- //

  const itemTitles = ["Journal", "Chats", "Goals", "Summary"];

  const itemColors = [colors.blue, colors.purple, colors.green, colors.orange];

  const icons = [
    (props: AnimatedIconProps) => <BookIconAnimated {...props} />,
    (props: AnimatedIconProps) => <MailIconAnimated {...props} />,
    (props: AnimatedIconProps) => <ClipboardCheckIconAnimated {...props} />,
    (props: AnimatedIconProps) => <DirectIconAnimated {...props} />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // --------------------- //

  const snapPoints = useMemo(() => {
    return [window.height - 203, window.height - 85, window.height];
  }, [window.height]);

  navigation.addListener("focus", () => {
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 260);
  });

  const onOpenListItem = () => {
    if (currentIndex === 1) {
      return navigation.navigate(PATHS.CHAT);
    }

    bottomSheetRef.current?.snapToIndex(1);

    setTimeout(() => {
      navigation.navigate(PATHS.LIBRARY_ITEM);
    }, 260);
  };

  // --------------------- //

  const ListItem = () => (
    <ListItemPreview
      title="My journal"
      subTitle="01/02/2025"
      IconComponent={icons[currentIndex]}
      backgroundColor={colors.light}
      backgroundColorForAnimate={itemColors[currentIndex]}
      onPress={onOpenListItem}
      onDotsPress={handleDotsPress}
    />
  );

  // --------------------- //

  const defaultActionsRef = useRef<BottomSheetRef>(null);
  const { setBottomSheetVisible } = useChatStore();

  const defaultActions = useMemo<BottomSheetAction[]>(
    () => [
      {
        text: "Edit",
        IconComponent: EditPencilIcon,
        onPress: () => {},
      },
      {
        text: "Delete",
        IconComponent: TrashIcon,
        onPress: () => {},
        iconColor: colors.error,
      },
    ],
    [colors.error]
  );

  const handleDotsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    defaultActionsRef.current?.snapToIndex(0);
    setBottomSheetVisible(true);
  };

  // --------------------- //

  return (
    <Layout>
      <Header title="Library" />
      <Carousel
        height={100}
        style={styles.carousel}
        mode="parallax"
        handler={(index) => {
          setCurrentIndex(index);
        }}
        modeConfig={{
          parallaxScrollingScale: 0.75,
          parallaxScrollingOffset: 145,
        }}
        renderItem={({ item }) => (
          <PreviewCard
            backgroundColor={item.backgroundColor}
            title={item.title}
            subTitle={item.subTitle}
            icon={item.icon}
          />
        )}
        data={[
          {
            title: "Journal",
            subTitle: "List of your journal entries",
            backgroundColor: colors.blue,
            icon: <BookIcon color={colors.black} size={40} />,
          },
          {
            title: "Chats",
            subTitle: "List of your chats",
            backgroundColor: colors.purple,
            icon: <MailIcon color={colors.black} size={40} />,
          },
          {
            title: "Goals",
            subTitle: "List of your goals and tasks",
            backgroundColor: colors.green,
            icon: <ClipboardCheckIcon color={colors.black} size={40} />,
          },
          {
            title: "Summary",
            subTitle: "List of your summaries",
            backgroundColor: colors.orange,
            icon: <DirectIcon color={colors.black} size={40} />,
          },
        ]}
      />

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        topElement={
          <View style={styles.chipBox}>
            <Chip
              size="small"
              color={itemColors[currentIndex]}
              title={itemTitles[currentIndex]}
            />
          </View>
        }
        pinnedElement={
          <View>
            <FiltersPanel style={styles.filtersPanel} />
            <Divider style={{ marginVertical: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <View style={[styles.globalViewHorizontal]}>
          <TitleText
            text="Last journal entries"
            textColor={colors.contrast}
            // element={<DotsIcon color={colors.contrast} size={22} />}
            variant="subTitle"
            style={styles.titleText}
          />
          <View style={styles.listItemPreviewBox}>
            <ListItem />
            <ListItem />
            <ListItem />
          </View>

          <Divider color={colors.alternate} />

          <TitleText
            text="This month"
            textColor={colors.contrast}
            // element={<DotsIcon color={colors.contrast} size={22} />}
            variant="subTitle"
            style={[styles.titleText, { marginTop: -8 }]}
          />
          <View style={styles.listItemPreviewBox}>
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
          </View>
          <Divider color={colors.alternate} />

          <TitleText
            text="Last month"
            textColor={colors.contrast}
            // element={<DotsIcon color={colors.contrast} size={22} />}
            variant="subTitle"
            style={[styles.titleText, { marginTop: -8 }]}
          />
          <View style={styles.listItemPreviewBox}>
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
            <ListItem />
          </View>
        </View>
      </BottomSheet>
      <Portal>
        <BottomSheetActions ref={defaultActionsRef} items={defaultActions} />
      </Portal>
    </Layout>
  );
};

export default LibraryScreen;
