import React, { useEffect, useMemo, useRef, useState } from "react";
import { BottomSheet, Chip, Divider, Layout, Loader } from "@/src/shared/ui";
import { FiltersPanel, Header } from "@/src/widgets";
import { useT } from "@/src/shared/lib/hooks";
import { useThemeStore, useDeviceStore } from "@/src/shared/store";
import { Pressable, ScrollView, View } from "react-native";
import VisNetwork, { VisNetworkRef } from "react-native-vis-network";
import { styles } from "./RelationshipMapScreen.styles";
import { useGetPortraitGraphQuery } from "@/src/entities/portrait/api/portraitApi";
import { stringToColor } from "@/src/shared/lib/helpers";
import { getContrastColor } from "@/src/shared/lib/helpers/getContrastColor";

const RelationshipMapScreen = () => {
  const t = useT();
  const { colors, theme } = useThemeStore();
  const { window } = useDeviceStore();
  const visNetworkRef = useRef<VisNetworkRef>(null);
  const [graphLoading, setGraphLoading] = useState<boolean>(true);

  // Запрос данных графа портрета
  const { data: graphData, isLoading } = useGetPortraitGraphQuery({
    limit: 23,
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

  const snapPoints = useMemo(() => [window.height - 85], [window.height]);

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
      console.log("Выбран узел:", nodeItem);
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

  return (
    <Layout>
      <Header
        title={t("overview.analytics.relationshipMap.title")}
        subtitle="01/02/2025"
        backButton
      />

      <BottomSheet
        snapPoints={snapPoints}
        backgroundColor={colors.secondary}
        borderColor={colors.alternate}
        animateOnMount={false}
        scrollEnabled={false}
        paddingHorizontal={1}
        staticMode
        pinnedElement={
          <View style={styles.filtersPanel}>
            <FiltersPanel />
            <Divider style={{ marginBottom: 0 }} color={colors.alternate} />
          </View>
        }
      >
        <View
          style={{
            width: "100%",
            height: window.height - 260,
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <Loader style={{ marginTop: 50 }} size={window.width - 100} />
          ) : (
            <>
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
            </>
          )}
        </View>
      </BottomSheet>
    </Layout>
  );
};

export default RelationshipMapScreen;
