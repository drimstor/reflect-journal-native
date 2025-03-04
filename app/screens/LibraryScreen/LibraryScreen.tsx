import React, { FC, useMemo, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Divider,
  Layout,
  Carousel,
  BottomSheet,
  type BottomSheetRef,
  Chip,
  useCarouselConfig,
  Loader,
} from "@/src/shared/ui";
import { PreviewCard } from "@/src/features";
import { FiltersPanel, Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import {
  useDeviceStore,
  useFiltersStore,
  useThemeStore,
} from "@/src/shared/store";
import { View } from "react-native";
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
import * as Haptics from "expo-haptics";
import { useBottomSheetStore } from "@/src/shared/store/zustand/bottomSheet.store";
import { NavigationProps } from "@/src/shared/model/types";
import { LibraryList, LibraryListVariant } from "@/src/widgets";
import { Chat, Journal } from "@/src/entities";

interface LibraryScreenProps {}

const LibraryScreen: FC<LibraryScreenProps> = () => {
  const t = useT();
  const { colors } = useThemeStore();
  const { window } = useDeviceStore();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const navigation = useNavigation<NavigationProps>();

  // --------------------- //

  const itemTitles = ["Journals", "Chats", "Goals", "Summaries"];
  const itemColors = [colors.blue, colors.purple, colors.green, colors.orange];

  const [currentIndex, setCurrentIndex] = useState(0);

  const { resetFilters } = useFiltersStore();

  // --------------------- //

  const snapPoints = useMemo(() => {
    return [window.height - 203, window.height - 85, window.height];
  }, [window.height]);

  navigation.addListener("focus", () => {
    setTimeout(() => {
      bottomSheetRef.current?.snapToIndex(0);
    }, 260);
  });

  // --------------------- //

  const onOpenListItem = (item: Journal | Chat) => {
    const params = { type: itemTitles[currentIndex], item };

    if (currentIndex === 1) {
      return navigation.navigate(PATHS.CHAT, params);
    }

    bottomSheetRef.current?.snapToIndex(1);

    setTimeout(() => {
      if (currentIndex === 0) {
        return navigation.navigate(PATHS.LIBRARY_LIST, params);
      }

      navigation.navigate(PATHS.LIBRARY_ITEM, params);
    }, 200);
  };

  // --------------------- //

  // const icons = [
  //   (props: AnimatedIconProps) => <BookIconAnimated {...props} />,
  //   (props: AnimatedIconProps) => <MailIconAnimated {...props} />,
  //   (props: AnimatedIconProps) => <ClipboardCheckIconAnimated {...props} />,
  //   (props: AnimatedIconProps) => <DirectIconAnimated {...props} />,
  // ];

  // const ListItem = () => (
  //   <ListItemPreview
  //     title="My journal"
  //     subTitle="01/02/2025"
  //     IconComponent={icons[currentIndex]}
  //     backgroundColor={colors.light}
  //     backgroundColorForAnimate={itemColors[currentIndex]}
  //     onPress={onOpenListItem}
  //     onDotsPress={handleDotsPress}
  //   />
  // );

  // --------------------- //

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
  // --------------------- //

  return (
    <Layout>
      <Header title={t("library.title")} />
      <Carousel
        height={100}
        style={styles.carousel}
        mode="parallax"
        handler={(index) => {
          setCurrentIndex(index);
          resetFilters();
        }}
        modeConfig={useCarouselConfig(50, 140)}
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
            title: t("entities.journals.plural"),
            subTitle: t("library.journals.description"),
            backgroundColor: colors.blue,
            icon: <BookIcon color={colors.black} size={40} />,
          },
          {
            title: t("entities.chats.plural"),
            subTitle: t("library.chats.description"),
            backgroundColor: colors.purple,
            icon: <MailIcon color={colors.black} size={40} />,
          },
          {
            title: t("entities.goals.plural"),
            subTitle: t("library.goals.description"),
            backgroundColor: colors.green,
            icon: <ClipboardCheckIcon color={colors.black} size={40} />,
          },
          {
            title: t("entities.summaries.plural"),
            subTitle: t("library.summaries.description"),
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
        scrollEnabled={false}
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
        <LibraryList
          onPress={onOpenListItem}
          variant={itemTitles[currentIndex] as LibraryListVariant}
        />
      </BottomSheet>
    </Layout>
  );
};

export default LibraryScreen;
