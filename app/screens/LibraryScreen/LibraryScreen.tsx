import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  Divider,
  Layout,
  TitleText,
  Carousel,
  BottomSheet,
  type BottomSheetRef,
  Chip,
} from "@/src/shared/ui";
import { PreviewCard, ListItemPreview, PreviewBlock } from "@/src/features";
import { FiltersPanel, Header, useHeaderStore } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import { useDeviceStore, useThemeStore } from "@/src/shared/store";
import { View } from "react-native";
import {
  BookIcon,
  CalendarIcon,
  ClipboardCheckIcon,
  DirectIcon,
  EditPencilIcon,
  MailIcon,
  TrashIcon,
  UserBorderIcon,
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
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { NavigationProps } from "@/src/shared/model/types";

interface LibraryScreenProps {}

const LibraryScreen: FC<LibraryScreenProps> = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<NavigationProps>();

  // --------------------- //

  const itemTitles = ["Journals", "Chats", "Goals", "Summary"];

  const itemColors = [colors.blue, colors.purple, colors.green, colors.orange];

  const icons = [
    (props: AnimatedIconProps) => <BookIconAnimated {...props} />,
    (props: AnimatedIconProps) => <MailIconAnimated {...props} />,
    (props: AnimatedIconProps) => <ClipboardCheckIconAnimated {...props} />,
    (props: AnimatedIconProps) => <DirectIconAnimated {...props} />,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setSubtitle(itemTitles[currentIndex]);
  }, [currentIndex]);

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
      return navigation.navigate(PATHS.LIBRARY_LIST);
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

  const JournalPreview = () => (
    <>
      <PreviewBlock
        colors={colors}
        title="Plan for the next month"
        value="Prepare a content plan for Dribbble for September"
        backgroundColor={colors.light}
        backgroundColorForAnimate={colors.alternate}
        onPress={onOpenListItem}
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
            icon: <CalendarIcon variant="outlined" color={colors.contrast} />,
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
        onPress={onOpenListItem}
        infoBoxes={[
          {
            label: "Due date",
            value: "Aug 25",
            icon: <CalendarIcon variant="outlined" color={colors.contrast} />,
          },
        ]}
      />
    </>
  );

  const { setActions, setBottomSheetVisible } = useBottomSheetStore();

  const handleDotsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    setActions([
      {
        text: "Edit",
        IconComponent: EditPencilIcon,
        onPress: () => {
          // ваш код
          console.log("Edit");
        },
      },
      {
        text: "Delete",
        IconComponent: TrashIcon,
        iconColor: colors.error,
        onPress: () => {
          // ваш код
          console.log("Delete");
        },
      },
    ]);

    setTimeout(() => {
      setBottomSheetVisible(true);
    }, 0);
  };

  const { setSubtitle } = useHeaderStore();

  // --------------------- //

  const JouranlsPreview = () => (
    <>
      <View style={[styles.globalViewHorizontal]}>
        <TitleText
          text="Last journal entries"
          textColor={colors.contrast}
          // element={<DotsIcon color={colors.contrast} size={22} />}
          variant="subTitle"
          style={styles.titleText}
        />
        <View style={[styles.listItemPreviewBox, styles.bigGap]}>
          <JournalPreview />
          <JournalPreview />
        </View>

        <Divider color={colors.alternate} />

        <TitleText
          text="This month"
          textColor={colors.contrast}
          // element={<DotsIcon color={colors.contrast} size={22} />}
          variant="subTitle"
          style={[styles.titleText, { marginTop: -8 }]}
        />
        <View style={[styles.listItemPreviewBox, styles.bigGap]}>
          <JournalPreview />
          <JournalPreview />
          <JournalPreview />
          <JournalPreview />
        </View>
        <Divider color={colors.alternate} />

        <TitleText
          text="Last month"
          textColor={colors.contrast}
          // element={<DotsIcon color={colors.contrast} size={22} />}
          variant="subTitle"
          style={[styles.titleText, { marginTop: -8 }]}
        />
        <View style={[styles.listItemPreviewBox, styles.bigGap]}>
          <JournalPreview />
          <JournalPreview />
          <JournalPreview />
          <JournalPreview />
        </View>
      </View>
    </>
  );

  // --------------------- //

  const ChatsPreview = () => (
    <>
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
    </>
  );
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
        {currentIndex === 0 ? <JouranlsPreview /> : <ChatsPreview />}
      </BottomSheet>
    </Layout>
  );
};

export default LibraryScreen;
