import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { DOCUMENT_PROGRESS_PREFIX } from "@/src/entities";

interface DocumentProgress {
  [documentId: string]: number;
}

export const useGetDocumentsProgress = (documents: any[]) => {
  const [progressData, setProgressData] = useState<DocumentProgress>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDocumentsProgress = useCallback(async () => {
    if (!documents || documents.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      // Получаем ключи всех сохраненных прогрессов документов
      const allKeys = await AsyncStorage.getAllKeys();
      const progressKeys = allKeys.filter((key) =>
        key.startsWith(DOCUMENT_PROGRESS_PREFIX)
      );

      if (progressKeys.length === 0) {
        setIsLoading(false);
        return;
      }

      // Получаем все значения прогресса
      const progressValues = await AsyncStorage.multiGet(progressKeys);

      // Формируем объект с прогрессами
      const progressMap: DocumentProgress = {};

      progressValues.forEach(([key, value]) => {
        const documentId = key.replace(DOCUMENT_PROGRESS_PREFIX, "");
        const progress = value ? parseInt(value, 10) : 0;

        // Добавляем только если документ есть в текущем списке
        if (documents.some((doc) => doc.id === documentId)) {
          progressMap[documentId] = progress;
        }
      });

      setProgressData(progressMap);
    } catch (error) {
      console.error("Ошибка загрузки прогресса документов:", error);
      setProgressData({});
    } finally {
      setIsLoading(false);
    }
  }, [documents]);

  // Загружаем прогресс при изменении списка документов
  useEffect(() => {
    loadDocumentsProgress();
  }, [loadDocumentsProgress]);

  // Обновляем прогресс при фокусировке экрана (когда пользователь возвращается)
  useFocusEffect(
    useCallback(() => {
      if (documents && documents.length > 0) {
        loadDocumentsProgress();
      }
    }, [loadDocumentsProgress, documents])
  );

  // Функция для получения прогресса конкретного документа
  const getDocumentProgress = (documentId: string): number => {
    return progressData[documentId] || 0;
  };

  return {
    progressData,
    getDocumentProgress,
    isLoading,
  };
};
