import Voice, {
  SpeechEndEvent,
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
} from "@react-native-voice/voice";
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

interface UseVoiceRecordingReturn {
  // Состояния
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  recognizedText: string;
  error: string | null;

  // Методы управления
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => Promise<void>;
  resetRecording: () => void;
}

export const useVoiceRecording = (): UseVoiceRecordingReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null | number>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    // Подписка на события Voice
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    return () => {
      // Очистка подписок
      Voice.destroy().then(Voice.removeAllListeners);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Обработчики событий Voice
  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log("Запись началась", e);
    setError(null);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    console.log("Запись завершена", e);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    if (e.value && e.value[0]) {
      setRecognizedText(e.value[0]);
      console.log("Распознанный текст:", e.value[0]);
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    // Промежуточные результаты распознавания
    if (e.value && e.value[0]) {
      setRecognizedText(e.value[0]);
    }
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.error("Ошибка распознавания:", e.error);
    setError(e.error?.message || "Произошла ошибка при распознавании");
    setIsRecording(false);
    stopTimer();
  };

  // Управление таймером
  const startTimer = () => {
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setRecordingTime(elapsed);
    }, 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const pauseTimer = () => {
    pausedTimeRef.current = Date.now() - startTimeRef.current;
    stopTimer();
  };

  // Методы управления записью
  // Проверка разрешений для Android
  const checkAndroidPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Разрешение на запись аудио",
          message:
            "Приложению требуется доступ к микрофону для записи голосовых сообщений",
          buttonPositive: "Разрешить",
          buttonNegative: "Отклонить",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error("Ошибка при запросе разрешений:", err);
      return false;
    }
  };

  // Проверка доступности Voice и разрешений
  const checkVoiceAvailability = async () => {
    try {
      if (Platform.OS === "android") {
        const hasPermission = await checkAndroidPermissions();
        if (!hasPermission) {
          setError("Необходимо разрешение на использование микрофона");
          return false;
        }
      }
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        setError("Распознавание речи недоступно на этом устройстве");
        return false;
      }

      return true;
    } catch (e) {
      console.error("Ошибка при проверке доступности Voice:", e);
      setError("Не удалось проверить доступность распознавания речи");
      return false;
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setRecognizedText("");
      setRecordingTime(0);
      pausedTimeRef.current = 0;

      // Проверяем доступность и разрешения
      const isAvailable = await checkVoiceAvailability();
      if (!isAvailable) {
        return;
      }

      await Voice.start("ru-RU"); // Используем русский язык
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
    } catch (e) {
      console.error("Ошибка при начале записи:", e);
      setError("Не удалось начать запись");
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();

      // Выводим результат в консоль
      console.log("Финальный распознанный текст:", recognizedText);
    } catch (e) {
      console.error("Ошибка при остановке записи:", e);
      setError("Не удалось остановить запись");
    }
  };

  const pauseRecording = () => {
    // React Native Voice не поддерживает паузу напрямую,
    // поэтому останавливаем распознавание
    Voice.stop();
    setIsPaused(true);
    pauseTimer();
  };

  const resumeRecording = async () => {
    try {
      // Возобновляем распознавание
      await Voice.start("ru-RU");
      setIsPaused(false);
      startTimer();
    } catch (e) {
      console.error("Ошибка при возобновлении записи:", e);
      setError("Не удалось возобновить запись");
    }
  };

  const resetRecording = () => {
    Voice.destroy();
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setRecognizedText("");
    setError(null);
    stopTimer();
    pausedTimeRef.current = 0;
  };

  return {
    isRecording,
    isPaused,
    recordingTime,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  };
};
