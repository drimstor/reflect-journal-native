import { Animated, View } from "react-native";
// import { styles } from "./DynamicIsland.styles";
import { SiriLoader } from "../Loader/SiriLoader";
import { useSpringAnimation, useToggle } from "../../lib/hooks";
import { useEffect } from "react";
import {
  clearAllSnackbars,
  removeSnackbar,
  selectSnackbars,
  useAppDispatch,
  useAppSelector,
  useDeviceStore,
  useStatusBarStore,
} from "../../store";
import {
  LongPressGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Text from "../Text/Text";
import { capitalizeText } from "../../lib/helpers";

const DynamicIsland = () => {
  const { window } = useDeviceStore();
  const { isVisible, setIsVisible } = useStatusBarStore();
  const dispatch = useAppDispatch();
  const snackbars = useAppSelector(selectSnackbars);

  // Анимация появления (начальная анимация)
  const { animation: animationVisible } = useSpringAnimation(!isVisible);

  // Анимация нажатия
  const { animation: animationPressed, animate: animatePressed } =
    useSpringAnimation();

  const {
    value: isExpanded,
    toggle: toggleIsExpanded,
    setValue: setIsExpanded,
  } = useToggle(false);

  // Анимация раскрытия (для увеличения после нажатия)
  const { animation: animationExpanded } = useSpringAnimation(isExpanded);

  // Появление и скрытие снекбара
  useEffect(() => {
    if (snackbars.length > 0) {
      setIsExpanded(true);
      setIsVisible(false);
    }

    const timeout = setTimeout(() => {
      dispatch(clearAllSnackbars());
    }, 5000);

    return () => clearTimeout(timeout);
  }, [snackbars.length]);

  // Сворачивание и закрытие айленда
  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  // Обработчик долгого нажатия
  const handleStateChange = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.state === State.BEGAN) {
      animatePressed(1);
    } else if (nativeEvent.state === State.ACTIVE) {
      toggleIsExpanded();
      animatePressed(0);
    } else {
      animatePressed(0);
    }
  };

  // Обработчик обычного нажатия
  const handleTap = ({ nativeEvent }: { nativeEvent: any }) => {
    if (nativeEvent.state === State.ACTIVE) {
      toggleIsExpanded();
    }
  };

  const visibleNotifyWidth = 210;
  const expandedNotifyWidth = window.width - 24 - visibleNotifyWidth;
  const visibleNotifyHeight = 37;
  const expandedNotifyHeight = 83;

  return (
    <View
      style={{
        position: "absolute",
        top: 11,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: "100%",
        alignItems: "center",
      }}
    >
      <TapGestureHandler onHandlerStateChange={handleTap}>
        <LongPressGestureHandler
          onHandlerStateChange={handleStateChange}
          minDurationMs={300}
        >
          <Animated.View
            style={{
              flex: 1,
              justifyContent: "center",
              borderRadius: Animated.add(
                animationVisible.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    visibleNotifyHeight / 2,
                    expandedNotifyHeight / 2,
                  ],
                }),
                animationExpanded.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 20], // Увеличиваем радиус при открытии
                })
              ),
              width: Animated.add(
                animationVisible.interpolate({
                  inputRange: [0, 1],
                  outputRange: [125, visibleNotifyWidth],
                }),
                animationExpanded.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, expandedNotifyWidth], // Дополнительные 90 пикселей, чтобы в сумме получилось 300
                })
              ),
              height: animationExpanded.interpolate({
                inputRange: [0, 1],
                outputRange: [visibleNotifyHeight, expandedNotifyHeight], // Увеличиваем высоту при открытии
              }),
              backgroundColor: "black",
              paddingHorizontal: 6,
              // Добавляем эффект нажатия
              transform: [
                {
                  scale: animationPressed.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.15],
                  }),
                },
              ],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 32,
              }}
            >
              <SiriLoader
                style={{
                  width: animationExpanded.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, 45],
                  }),
                  height: animationExpanded.interpolate({
                    inputRange: [0, 1],
                    outputRange: [28, 45],
                  }),
                  opacity: animationVisible.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-3, 1],
                  }),
                  transform: [
                    {
                      translateX: animationExpanded.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 15],
                      }),
                    },
                  ],
                }}
              />
              {isExpanded && (
                <Animated.View
                  style={{
                    opacity: animationExpanded.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-8, 1],
                    }),
                    overflow: "hidden",
                    maxWidth: "78%",
                  }}
                >
                  <Text font="bold" color="white" numberOfLines={1}>
                    {capitalizeText(snackbars[snackbars.length - 1]?.text)}
                  </Text>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </LongPressGestureHandler>
      </TapGestureHandler>
    </View>
  );
};

export default DynamicIsland;
