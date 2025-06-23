import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

interface TestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>; // Объект ответов с индексами как ключами
  totalQuestions: number;
}

const STORAGE_KEY_PREFIX = "@test_progress_";

export const useTestProgress = (testId: string, totalQuestions: number) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${testId}`;

  // Загрузка прогресса из AsyncStorage
  const loadProgress = useCallback(async () => {
    try {
      const progressData = await AsyncStorage.getItem(storageKey);
      if (progressData) {
        const progress: TestProgress = JSON.parse(progressData);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        // Инициализируем объект ответов с правильными ключами
        const loadedAnswers: Record<string, string> = {};
        for (let i = 0; i < totalQuestions; i++) {
          const key = (i + 1).toString();
          loadedAnswers[key] = progress.answers[key] || "";
        }
        setAnswers(loadedAnswers);
      } else {
        // Инициализируем пустой объект ответов
        const emptyAnswers: Record<string, string> = {};
        for (let i = 0; i < totalQuestions; i++) {
          emptyAnswers[(i + 1).toString()] = "";
        }
        setAnswers(emptyAnswers);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Ошибка загрузки прогресса теста:", error);
      // Инициализируем пустой объект ответов в случае ошибки
      const emptyAnswers: Record<string, string> = {};
      for (let i = 0; i < totalQuestions; i++) {
        emptyAnswers[(i + 1).toString()] = "";
      }
      setAnswers(emptyAnswers);
      setIsLoaded(true);
    }
  }, [storageKey, totalQuestions]);

  // Сохранение прогресса в AsyncStorage
  const saveProgress = useCallback(
    async (questionIndex: number, updatedAnswers: Record<string, string>) => {
      try {
        const progress: TestProgress = {
          testId,
          currentQuestionIndex: questionIndex,
          answers: updatedAnswers,
          totalQuestions,
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(progress));
      } catch (error) {
        console.error("Ошибка сохранения прогресса теста:", error);
      }
    },
    [storageKey, testId, totalQuestions]
  );

  // Удаление прогресса из AsyncStorage
  const clearProgress = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setCurrentQuestionIndex(0);
      const emptyAnswers: Record<string, string> = {};
      for (let i = 0; i < totalQuestions; i++) {
        emptyAnswers[(i + 1).toString()] = "";
      }
      setAnswers(emptyAnswers);
    } catch (error) {
      console.error("Ошибка очистки прогресса теста:", error);
    }
  }, [storageKey, totalQuestions]);

  // Обновление ответа на вопрос
  const updateAnswer = useCallback(
    (questionIndex: number, answer: string) => {
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        newAnswers[(questionIndex + 1).toString()] = answer;
        // Сохраняем в AsyncStorage
        saveProgress(currentQuestionIndex, newAnswers);
        return newAnswers;
      });
    },
    [currentQuestionIndex, saveProgress]
  );

  // Переход к следующему вопросу
  const goToNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    saveProgress(nextIndex, answers);
  }, [currentQuestionIndex, answers, saveProgress]);

  // Переход к предыдущему вопросу
  const goToPreviousQuestion = useCallback(() => {
    const prevIndex = Math.max(0, currentQuestionIndex - 1);
    setCurrentQuestionIndex(prevIndex);
    saveProgress(prevIndex, answers);
  }, [currentQuestionIndex, answers, saveProgress]);

  // Загружаем прогресс при первом запуске
  useEffect(() => {
    if (totalQuestions > 0) {
      loadProgress();
    }
  }, [loadProgress, totalQuestions]);

  return {
    currentQuestionIndex,
    answers,
    isLoaded,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    clearProgress,
    getCurrentAnswer: () =>
      answers[(currentQuestionIndex + 1).toString()] || "",
    isCurrentAnswerEmpty: () =>
      !answers[(currentQuestionIndex + 1).toString()]?.trim(),
    isFirstQuestion: currentQuestionIndex === 0,
    isLastQuestion: currentQuestionIndex === totalQuestions - 1,
  };
};
