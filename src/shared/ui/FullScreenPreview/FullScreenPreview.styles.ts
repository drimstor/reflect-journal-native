import { Dimensions, StyleSheet } from "react-native";

// Получаем размеры экрана
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Контейнер модального окна
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Бекдроп для закрытия модального окна
  backdrop: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // Контейнер основного контента
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Обертка для карусели
  carouselWrapper: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },

  // Стили для карусели
  carousel: {
    flex: 1,
  },

  // Контейнер элемента карусели
  carouselItemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Полноэкранное изображение
  fullScreenImage: {
    width: screenWidth - 8,
    height: screenHeight - 140,
    maxWidth: screenWidth - 8,
    maxHeight: screenHeight - 140,
  },

  // Кнопка закрытия
  closeButton: {
    position: "absolute",
    top: 10,
    right: 22,
    transform: [{ rotate: "45deg" }],
    width: 55,
    height: 55,
    opacity: 0.85,
  },

  // Контейнер для лоадера
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
