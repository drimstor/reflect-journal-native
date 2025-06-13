import { FC, useCallback, useEffect, useState } from "react";
import {
  BottomSheet,
  Divider,
  Layout,
  PaddingLayout,
  DotsIcon,
  FullScreenChartLegend,
  Loader,
  AnimatedAppearance,
  NoData,
  DirectIcon,
} from "@/src/shared/ui";
import { ChartsFiltersPanel, Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import {
  useDeviceStore,
  useFiltersStore,
  useScreenInfoStore,
} from "@/src/shared/store";
import { ScrollView, View } from "react-native";
import { styles } from "./ChartsScreen.styles";
import { ChartTitle } from "./ui/ChartTitle/ChartTitle";
import { ChartsContainer } from "./ui/ChartsContainer/ChartsContainer";
import { useChartData } from "./lib/hooks/useChartData";
import { useChartBottomSheet } from "./lib/hooks/useChartBottomSheet";
import { useChartManagement } from "./lib/hooks/useChartManagement";
import { PATHS } from "@/src/shared/const/PATHS";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "@/src/shared/model/types";

const ChartsScreen = () => {
  const t = useT();
  const { setScreenInfo } = useScreenInfoStore();
  const { window } = useDeviceStore();
  const navigation = useNavigation<NavigationProps>();
  const { snapPoints, openBottomSheetList, colors } = useChartBottomSheet();
  const { multi_select_ids, multi_select } = useFiltersStore();

  // Инициализация информации о экране
  useEffect(() => {
    setScreenInfo({ name: "Charts" });
  }, []);

  // Хуки для управления данными и состоянием
  const { chartsData, isLoading } = useChartData();
  const {
    mainChart,
    subChart,
    currentChart,
    scrollViewRef,
    mainChartRef,
    subChartRef,
    handleScroll,
    handleItemPress,
    handlePressBack,
    animationValue,
  } = useChartManagement();

  // Данные текущей диаграммы
  const currentChartData =
    chartsData[currentChart as keyof typeof chartsData]?.data;
  const currentChartTitle =
    chartsData[currentChart as keyof typeof chartsData]?.title;

  const mainChartData = chartsData[mainChart as keyof typeof chartsData]?.data;
  const subChartData = chartsData[subChart as keyof typeof chartsData]?.data;

  return (
    <Layout>
      <Header
        title={t("overview.analytics.dataOverview.title")}
        backButton
        rightIcon={{
          icon: <DotsIcon color={colors.contrast} />,
          onPress: () =>
            openBottomSheetList(
              currentChartTitle === t("overview.chart.popularCategories")
                ? "categories"
                : "topics"
            )(multi_select ? multi_select_ids : []),
        }}
      />
      <BottomSheet
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        paddingHorizontal={1}
        staticMode
        pinnedElement={
          <View style={styles.filtersPanel}>
            <ChartsFiltersPanel />
            <Divider
              style={{ marginTop: 18, marginBottom: 0 }}
              color={colors.alternate}
            />
          </View>
        }
      >
        {isLoading ? (
          <Loader style={{ marginTop: 50 }} size={window.width - 100} />
        ) : !currentChartData?.length ? (
          <NoData
            style={{ marginTop: 70 }}
            type="noData"
            onPress={() => navigation.navigate(PATHS.ADD_ENTRY)}
          />
        ) : (
          <AnimatedAppearance isVisible>
            <ScrollView
              ref={scrollViewRef}
              style={{
                maxHeight: window.height - 230,
                paddingTop: 25,
                position: "relative",
              }}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={handleScroll}
            >
              {/* Заголовок диаграммы */}
              <ChartTitle
                title={currentChartTitle}
                isMainChart={currentChart === mainChart}
                onChangeChartType={() => openBottomSheetList("title")()}
                onPressBack={handlePressBack}
              />
              {/* Контейнер с диаграммами */}
              <ChartsContainer
                mainChartData={mainChartData}
                subChartData={subChartData}
                onMainChartPress={handlePressBack}
                mainChartRef={mainChartRef}
                subChartRef={subChartRef}
                animation={animationValue}
              />
              {/* Легенда диаграммы */}
              <PaddingLayout style={{ paddingBottom: 100, paddingTop: 30 }}>
                {currentChartData && (
                  <FullScreenChartLegend
                    data={currentChartData}
                    onPress={(item) => handleItemPress(item, currentChartData)}
                    onDotsPress={(item) =>
                      openBottomSheetList(
                        currentChartTitle ===
                          t("overview.chart.popularCategories")
                          ? "categories"
                          : "topics"
                      )([item.name])
                    }
                  />
                )}
              </PaddingLayout>
            </ScrollView>
          </AnimatedAppearance>
        )}
      </BottomSheet>
    </Layout>
  );
};

export default ChartsScreen;
