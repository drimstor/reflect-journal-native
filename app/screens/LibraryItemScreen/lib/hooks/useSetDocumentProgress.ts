import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { DOCUMENT_PROGRESS_PREFIX } from "@/src/entities";

interface UseSetDocumentProgressProps {
  documentId: string;
  enabled?: boolean;
}

interface UseSetDocumentProgressReturn {
  progress: number;
  isCompleted: boolean;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  isLoading: boolean;
}

export const useSetDocumentProgress = ({
  documentId,
  enabled = true,
}: UseSetDocumentProgressProps): UseSetDocumentProgressReturn => {
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldTrack, setShouldTrack] = useState<boolean>(false);

  const storageKey = `${DOCUMENT_PROGRESS_PREFIX}${documentId}`;

  // Загружаем сохраненный прогресс при инициализации
  useEffect(() => {
    const loadProgress = async () => {
      if (!enabled || !documentId) {
        setIsLoading(false);
        return;
      }

      try {
        const savedProgress = await AsyncStorage.getItem(storageKey);
        const parsedProgress = savedProgress ? parseInt(savedProgress, 10) : 0;

        setProgress(parsedProgress);

        if (parsedProgress >= 100) {
          setIsCompleted(true);
          setShouldTrack(false); // Не отслеживаем если уже завершено
        } else {
          setIsCompleted(false);
          setShouldTrack(true); // Начинаем отслеживание
        }
      } catch (error) {
        console.error("Ошибка загрузки прогресса документа:", error);
        setShouldTrack(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [documentId, enabled, storageKey]);

  // Сохраняем прогресс в AsyncStorage
  const saveProgress = useCallback(
    async (newProgress: number) => {
      try {
        await AsyncStorage.setItem(storageKey, newProgress.toString());
      } catch (error) {
        console.error("Ошибка сохранения прогресса документа:", error);
      }
    },
    [storageKey]
  );

  // Обработчик скролла
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!shouldTrack || isCompleted || !enabled) {
        return;
      }

      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      // Проверяем что есть контент для скролла
      if (contentSize.height <= layoutMeasurement.height) {
        return;
      }

      // Вычисляем прогресс в процентах
      const maxScrollOffset = contentSize.height - layoutMeasurement.height;
      const currentProgress = Math.round(
        (contentOffset.y / maxScrollOffset) * 100
      );

      // Ограничиваем значение от 0 до 100
      const normalizedProgress = Math.min(100, Math.max(0, currentProgress));

      // Обновляем прогресс только если он увеличился
      if (normalizedProgress > progress) {
        setProgress(normalizedProgress);
        saveProgress(normalizedProgress);

        // Если достигли 100%, отмечаем как завершенное
        if (normalizedProgress >= 100) {
          setIsCompleted(true);
          setShouldTrack(false);
        }
      }
    },
    [shouldTrack, isCompleted, enabled, progress, saveProgress]
  );

  return {
    progress,
    isCompleted,
    handleScroll,
    isLoading,
  };
};
