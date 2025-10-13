import { useGetPortraitGraphQuery } from "@/src/entities/portrait/api/portraitApi";
import { BOTTOM_SHEET_SCREEN_POINTS } from "@/src/shared/const";
import { PATHS } from "@/src/shared/const/PATHS";
import { stringToColor } from "@/src/shared/lib/helpers";
import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";
import { useOnboardingChecklistUpdate, useT } from "@/src/shared/lib/hooks";
import { NavigationProps } from "@/src/shared/model/types";
import { useThemeStore } from "@/src/shared/store";
import {
  AnimatedAppearance,
  BottomSheet,
  BottomSheetStaticBackdrop,
  Chip,
  Divider,
  Layout,
  NoData,
} from "@/src/shared/ui";
import { ChartsFiltersPanel, Header } from "@/src/widgets";
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, ScrollView, View } from "react-native";
import VisNetwork, { VisNetworkRef } from "react-native-vis-network";
import { styles } from "./RelationshipMapScreen.styles";

const RelationshipMapScreen = () => {
  const t = useT();
  const route = useRoute();
  const { colors, theme } = useThemeStore();
  const visNetworkRef = useRef<VisNetworkRef>(null);
  const [graphLoading, setGraphLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();
  const { LARGE } = BOTTOM_SHEET_SCREEN_POINTS;
  const snapPoints = useMemo(() => [LARGE], [LARGE]);
  const { isBottomSheetMountAnimate } = (route.params as any) || {};

  // Хук для обновления чек-листов онбординга
  const { updateChecklist } = useOnboardingChecklistUpdate();

  // Запрос данных графа портрета
  const { data: graphData, isLoading } = useGetPortraitGraphQuery({
    limit: 100,
  });

  // Подсчёт уникальных типов узлов и их количества
  const nodeTypeStats = useMemo(() => {
    if (!graphData?.nodes) return [];

    // Подсчитываем количество для каждого типа узла
    const typeCounts = graphData.nodes.reduce((acc, node) => {
      const { type } = node;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Преобразуем объект в массив объектов {type, count}
    return Object.entries(typeCounts).map(([type, count]) => ({ type, count }));
  }, [graphData?.nodes]);

  // Трансформируем данные, добавляя цвета для узлов
  const transformedNodes = useMemo(
    () =>
      graphData?.nodes.map((node) => {
        const backgroundColor = stringToColor(node.type);
        const textColor = getContrastColor(backgroundColor);

        return {
          ...node,
          color: { background: backgroundColor },
          font: { color: textColor },
        };
      }) || [],
    [graphData?.nodes]
  );

  // Используем полученные данные или пустой граф при загрузке
  const graph = useMemo(
    () => ({
      nodes: transformedNodes,
      edges: graphData?.edges || [],
    }),
    [graphData?.edges, transformedNodes]
  );

  const options = {
    edges: {
      width: 2,
      smooth: {
        enabled: true,
        type: "curvedCW",
        roundness: 0,
      },
      arrows: {
        to: { enabled: true, scaleFactor: 0.8 },
      },
      selectionWidth: 3,
      font: {
        align: "middle",
        size: 14,
        color: colors.contrast,
        background: colors.secondary,
        strokeWidth: 0,
      },
    },
    nodes: {
      borderWidth: 1,
      color: {
        border: theme === "dark" ? colors.contrast : colors.primary,
        highlight: {
          border: colors.accent,
          background: colors.accent,
        },
      },
      shape: "circle",
      widthConstraint: {
        minimum: 100,
        maximum: 140,
      },
      heightConstraint: {
        minimum: 60,
      },
      size: 40,
      borderWidthSelected: 0,
      labelHighlightBold: true,
      font: {
        size: 18,
      },
      mass: 2,
      scaling: {
        label: {
          enabled: true,
          min: 14,
          max: 30,
        },
      },
    },
    autoResize: true,
    height: "100%",
    width: "100%",
    zoomFitOnStabilized: false,
    interaction: {
      hover: false,
      dragNodes: true,
      zoomView: true,
      multiselect: false,
      selectConnectedEdges: true,
      hideEdgesOnDrag: false,
      navigationButtons: false,
    },
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -2000,
        centralGravity: 0.3,
        springLength: 200,
        springConstant: 0.05,
        damping: 0.09,
        avoidOverlap: 0.5,
      },
      stabilization: {
        enabled: true,
        iterations: 1000,
        updateInterval: 50,
        fit: false,
      },
    },
  };

  // Функция для работы с выбранным узлом
  const handleNodeSelection = (nodeId: string | number) => {
    if (!visNetworkRef.current) return;

    visNetworkRef.current.focus(nodeId, {
      animation: {
        duration: 800,
        easingFunction: "easeInOutQuad",
      },
      scale: 1.5,
    });

    // Для отладки
    if (graphData?.nodes) {
      const nodeItem = graphData.nodes.find((item) => item.id === nodeId);
    }
  };

  useEffect(() => {
    if (graphLoading || !visNetworkRef.current) return;

    const subscription = visNetworkRef.current.addEventListener(
      "click",
      (event: any) => {
        const { nodes } = event;
        const node = nodes[0];
        if (!node) return;

        handleNodeSelection(node);
      }
    );

    return subscription.remove;
  }, [graphLoading, graphData?.nodes]);

  // Обновляем чек-лист онбординга при посещении карты связей
  useFocusEffect(
    useCallback(() => {
      updateChecklist(4, "relationship_map_visited");
    }, [updateChecklist])
  );

  return (
    <Layout>
      <Header
        title={t("overview.analytics.relationshipMap.title")}
        subtitle={"Beta"}
        backButton
        // rightIcon={{
        //   icon: <DotsIcon color={colors.contrast} />,
        //   onPress: () => {},
        // }}
      />
      {!isBottomSheetMountAnimate && <BottomSheetStaticBackdrop />}
      <BottomSheet
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={!!isBottomSheetMountAnimate}
        scrollEnabled={false}
        paddingHorizontal={1}
        staticMode
        pinnedElement={
          <View style={styles.filtersPanel}>
            <ChartsFiltersPanel />
            <Divider style={{ marginBottom: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <View
          style={{
            width: "100%",
            height: WINDOW_HEIGHT - 230,
            overflow: "hidden",
          }}
        >
          {!isLoading && !graphData?.nodes?.length ? (
            <NoData
              style={{ marginTop: 70 }}
              type="noData"
              onPress={() => navigation.navigate(PATHS.ADD_ENTRY)}
            />
          ) : (
            <AnimatedAppearance
              isVisible={!graphLoading}
              style={{
                width: "100%",
                height: WINDOW_HEIGHT - 230,
                overflow: "hidden",
              }}
            >
              <VisNetwork
                data={graph}
                options={options}
                style={{ backgroundColor: colors.secondary }}
                ref={visNetworkRef}
                onLoad={() => setGraphLoading(false)}
              />
              <View
                style={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  right: 0,
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[{ gap: 4, paddingHorizontal: 10 }]}
                >
                  {nodeTypeStats.map((item, index) => (
                    <Pressable
                      key={`legend-item-${index}`}
                      onPress={() => {
                        // Функционал фильтрации можно добавить здесь
                      }}
                    >
                      <Chip
                        borderColor={false ? colors.contrast : colors.secondary}
                        title={`${item.type} (${item.count})`}
                        color={stringToColor(item.type)}
                      />
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </AnimatedAppearance>
          )}
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default RelationshipMapScreen;
