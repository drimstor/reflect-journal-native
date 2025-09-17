import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

// Кастомный хук для управления распознаванием речи
export const useSpeechRecognition = (
  onSpeechRecognized?: (text: string) => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");

  console.log({ recognizedText });

  // Слушатель событий распознавания речи
  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results[0]?.transcript || "";
    setRecognizedText(text);
    if (onSpeechRecognized && text) {
      onSpeechRecognized(text);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setIsListening(false);
    Alert.alert("Ошибка распознавания", event.error || "Неизвестная ошибка");
  });

  // Запуск распознавания речи
  const startListening = useCallback(async () => {
    try {
      // Проверяем разрешения
      const { status } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Нужно разрешение",
          "Для использования функции распознавания речи необходимо разрешение на использование микрофона"
        );
        return;
      }

      // Запускаем распознавание без проверки доступности
      // так как getAvailableAsync может отсутствовать в текущей версии
      await ExpoSpeechRecognitionModule.start({
        lang: "ru-RU",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось запустить распознавание речи");
      console.error("Speech recognition error:", error);
    }
  }, []);

  // Остановка распознавания речи
  const stopListening = useCallback(async () => {
    try {
      await ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  }, []);

  return {
    isListening,
    recognizedText,
    startListening,
    stopListening,
  };
};
