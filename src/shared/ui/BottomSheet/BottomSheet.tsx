import React, {
  ReactNode,
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  StyleProp,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  default as BottomSheetLibrary,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useGetPadding, useTimingAnimation } from "@/src/shared/lib/hooks";
import { useThemeStore } from "@/src/shared/store";
import { getExpandAnimatedStyle } from "./lib/helpers/getExpandAnimatedStyle";

export interface BottomSheetRef {
  snapToIndex: (index: number) => void;
  snapToPosition: (position: number) => void;
  close: () => void;
}

interface BottomSheetProps {
  children: ReactNode;
  snapPoints: (number | string)[];
  animateOnMount?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
  pinnedElement?: ReactNode;
  topElement?: ReactNode;
  indicatorColor?: string;
  initialIndex?: number;
  staticMode?: boolean;
  withBackdrop?: boolean;
  onChange?: (index: number) => void;
  onClose?: () => void;
}

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (props, ref) => {
    const {
      children,
      snapPoints,
      animateOnMount,
      backgroundColor,
      borderColor,
      style,
      pinnedElement,
      topElement,
      indicatorColor,
      initialIndex = 0,
      staticMode,
      withBackdrop = false,
      onChange,
      onClose,
    } = props;

    const outsideRef = useRef<BottomSheetLibrary>(null);
    const { paddingHorizontal } = useGetPadding();
    const [isFullyExpanded, setIsFullyExpanded] = useState(false);
    const { theme } = useThemeStore();

    const { animate: animateExpand, animation: expandAnimation } =
      useTimingAnimation();

    const { animate: animateBackdrop, animation: backdropAnimation } =
      useTimingAnimation(undefined, { duration: 450 });

    const handleSheetChanges = useCallback(
      (index: number) => {
        const isExpanded = index === snapPoints.length - 1;
        setIsFullyExpanded(isExpanded);

        if (withBackdrop) {
          animateBackdrop(index >= 0 ? 1 : 0);
        }

        if (topElement) {
          animateExpand(isExpanded ? 1 : 0);
        }

        if (index === -1) {
          if (withBackdrop) animateBackdrop(0);
          onClose?.();
        }

        onChange?.(index);
      },
      [
        snapPoints.length,
        topElement,
        animateExpand,
        withBackdrop,
        animateBackdrop,
        onChange,
      ]
    );

    const handleScroll = useCallback(
      (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        if (offsetY > 0 && !isFullyExpanded) {
          event?.preventDefault?.();
          outsideRef.current?.snapToIndex(snapPoints.length - 1);
        }
      },
      [isFullyExpanded, snapPoints.length, staticMode]
    );

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        if (withBackdrop) animateBackdrop(1);
        outsideRef.current?.snapToIndex(index);
      },
      snapToPosition: (position: number) => {
        if (withBackdrop) animateBackdrop(1);
        outsideRef.current?.snapToPosition(position);
      },
      close: () => {
        if (withBackdrop) animateBackdrop(0);
        outsideRef.current?.snapToPosition(-5);
        onClose?.();
      },
    }));

    const expandAnimatedStyle = useMemo(
      () => getExpandAnimatedStyle(expandAnimation),
      [expandAnimation]
    );

    return (
      <>
        {withBackdrop && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              opacity: backdropAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                animateBackdrop(0);
                outsideRef.current?.close();
                onClose?.();
              }}
            >
              <BlurView
                style={{ flex: 1 }}
                intensity={15}
                tint={theme === "dark" ? "dark" : "light"}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        )}
        <BottomSheetLibrary
          ref={outsideRef}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          animateOnMount={animateOnMount}
          enablePanDownToClose={!staticMode && snapPoints.length === 1}
          enableOverDrag={false}
          enableContentPanningGesture={!staticMode}
          enableHandlePanningGesture={!staticMode}
          index={initialIndex}
          handleStyle={{
            padding: 0,
            margin: 0,
            paddingTop: indicatorColor ? 8 : 0,
          }}
          handleIndicatorStyle={{
            backgroundColor: indicatorColor || "#E0E0E0",
            width: 40,
            height: 4,
            display: staticMode ? "none" : indicatorColor ? "flex" : "none",
          }}
          backgroundStyle={[
            {
              backgroundColor,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 0,
            },
            borderColor ? { borderColor, borderWidth: 1 } : {},
            style,
          ]}
        >
          {topElement && (
            <Animated.View
              style={[
                { opacity: expandAnimation, paddingHorizontal },
                expandAnimatedStyle,
              ]}
            >
              {topElement}
            </Animated.View>
          )}

          {pinnedElement && (
            <Animated.View
              style={[
                { paddingHorizontal },
                topElement ? expandAnimatedStyle : undefined,
              ]}
            >
              {pinnedElement}
            </Animated.View>
          )}

          <Animated.View
            style={
              topElement ? [expandAnimatedStyle, { paddingBottom: 80 }] : {}
            }
          >
            <BottomSheetScrollView
              onScroll={handleScroll}
              scrollEnabled={isFullyExpanded}
              style={[style, { paddingHorizontal }]}
            >
              {children}
            </BottomSheetScrollView>
          </Animated.View>
        </BottomSheetLibrary>
      </>
    );
  }
);

export default BottomSheet;
