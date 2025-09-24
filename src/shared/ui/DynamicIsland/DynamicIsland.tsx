import { useEffect } from "react";
import { Animated, TouchableWithoutFeedback, View } from "react-native";
import { capitalizeText } from "../../lib/helpers";
import { useSpringAnimation, useToggle } from "../../lib/hooks";
import {
  clearAllSnackbars,
  selectSnackbars,
  useAppDispatch,
  useAppSelector,
  useDeviceStore,
  useStatusBarStore,
} from "../../store";
import { SiriLoader } from "../Loader/SiriLoader";
import Text from "../Text/Text";
import { styles } from "./DynamicIsland.styles";

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
  }, [snackbars.length, setIsExpanded, setIsVisible, dispatch]);

  // Сворачивание и закрытие айленда
  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsExpanded(false);
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, setIsExpanded, setIsVisible]);

  // Обработчик нажатия
  const handlePress = () => {
    toggleIsExpanded();
  };

  // Обработчик начала нажатия
  const handlePressIn = () => {
    animatePressed(1);
  };

  // Обработчик окончания нажатия
  const handlePressOut = () => {
    animatePressed(0);
  };

  const visibleNotifyWidth = 210;
  const expandedNotifyWidth = window.width - 24 - visibleNotifyWidth;
  const visibleNotifyHeight = 37;
  const expandedNotifyHeight = 83;

  return (
    <View style={styles.globalBox}>
      <TouchableWithoutFeedback
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
          <View style={styles.innerBox}>
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
                  ...styles.textBox,
                }}
              >
                <Text font="bold" color="white" numberOfLines={2}>
                  {capitalizeText(snackbars[snackbars.length - 1]?.text)}
                </Text>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default DynamicIsland;
