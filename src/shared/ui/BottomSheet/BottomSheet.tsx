import {
  ReactNode,
  useCallback,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { StyleProp, ViewStyle, Animated, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  default as BottomSheetLibrary,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useGetPadding, useTimingAnimation } from "@/src/shared/lib/hooks";
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
  scrollEnabled?: boolean;
  paddingHorizontal?: number;
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
      scrollEnabled = true,
      paddingHorizontal = 24,
    } = props;

    const outsideRef = useRef<BottomSheetLibrary>(null);
    // const [isFullyExpanded, setIsFullyExpanded] = useState(scrollEnabled);

    const { animate: animateExpand, animation: expandAnimation } =
      useTimingAnimation();

    const handleSheetChanges = useCallback(
      (index: number) => {
        const isExpanded = index === snapPoints.length - 1;
        // setIsFullyExpanded(isExpanded);

        if (topElement) animateExpand(isExpanded ? 1 : 0);

        if (index === -1) onClose?.();

        onChange?.(index);
      },
      [snapPoints.length, topElement, animateExpand, onChange]
    );

    // const handleScroll = useCallback(
    //   (event: any) => {
    //     const offsetY = event.nativeEvent.contentOffset.y;

    //     if (offsetY > 0 && !isFullyExpanded) {
    //       event?.preventDefault?.();
    //       outsideRef.current?.snapToIndex(snapPoints.length - 1);
    //     }
    //   },
    //   [isFullyExpanded, snapPoints.length, staticMode]
    // );

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number) => {
        outsideRef.current?.snapToIndex(index);
      },
      snapToPosition: (position: number) => {
        outsideRef.current?.snapToPosition(position);
      },
      close: () => {
        outsideRef.current?.snapToPosition(-1);
      },
    }));

    const expandAnimatedStyle = useMemo(
      () => getExpandAnimatedStyle(expandAnimation),
      [expandAnimation]
    );

    const backdropComponent = (props: BottomSheetBackdropProps) => {
      if (withBackdrop) {
        return (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            onPress={onClose}
          />
        );
      }
      return null;
    };

    return (
      <BottomSheetLibrary
        ref={outsideRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        animateOnMount={animateOnMount}
        enablePanDownToClose={!staticMode && snapPoints.length === 1} // Включает возможность закрыть нижний лист свайпом вниз
        enableOverDrag={false} // Отключает эффект "перетягивания" при достижении крайних точек
        enableContentPanningGesture={!staticMode} // Включает возможность перетаскивания контента жестами
        enableHandlePanningGesture={!staticMode} // Включает возможность перетаскивания за ручку нижнего листа
        backdropComponent={backdropComponent}
        enableDynamicSizing={false}
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
          style={[
            topElement ? [expandAnimatedStyle, { paddingBottom: 80 }] : {},
          ]}
        >
          <BottomSheetScrollView
            // onScroll={handleScroll}
            // scrollEnabled={isFullyExpanded}
            scrollEnabled={false}
            style={[style, { paddingHorizontal }]}
          >
            {children}
          </BottomSheetScrollView>
        </Animated.View>
      </BottomSheetLibrary>
    );
  }
);

export default BottomSheet;
