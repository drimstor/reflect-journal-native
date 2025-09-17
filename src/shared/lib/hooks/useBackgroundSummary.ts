import { summaryApi } from "@/src/entities/summary/api/summaryApi";
import { CreateSummaryRequest } from "@/src/entities/summary/model/types";
import { addSnackbar, store, useAppDispatch } from "@/src/shared/store";
import { useCallback } from "react";
import { SnackbarType } from "../../ui/Snackbar/Snackbar";
import { useBackgroundTask } from "./useBackgroundTask";
import { useT } from "./useLang";
import { useNotifications } from "./useNotifications";

interface UseBackgroundSummaryReturn {
  // Методы
  createSummaryInBackground: (
    request: CreateSummaryRequest,
    options?: {
      onSuccess?: (summary: any) => void;
      onError?: (error: any) => void;
      showImmediateToast?: boolean;
    }
  ) => Promise<string>;

  // Состояние активных задач
  activeTasksCount: number;
  hasActiveTasks: boolean;

  // Утилиты
  cancelTask: (taskId: string) => boolean;
  cleanup: () => void;
}

/**
 * Хук для создания саммари в фоновом режиме
 * Использует универсальный BackgroundTaskService
 */
export const useBackgroundSummary = (): UseBackgroundSummaryReturn => {
  const t = useT();
  const { sendNotification } = useNotifications();
  const { createTask, activeTasksCount, hasActiveTasks, cancelTask, cleanup } =
    useBackgroundTask("summary");

  const dispatch = useAppDispatch();
  const addSnackbarHandler = useCallback(
    (text: string, type: SnackbarType) => {
      dispatch(addSnackbar({ text, type: type }));
    },
    [dispatch]
  );

  // Создание саммари в фоне
  const createSummaryInBackground = useCallback(
    async (
      request: CreateSummaryRequest,
      options?: {
        onSuccess?: (summary: any) => void;
        onError?: (error: any) => void;
        showImmediateToast?: boolean;
      }
    ): Promise<string> => {
      const { onSuccess, onError, showImmediateToast = true } = options || {};

      // Показываем стартовое уведомление
      if (showImmediateToast) {
        await sendNotification(
          t("notifications.summary.creating.title"),
          t("notifications.summary.creating.body"),
          {
            type: "summary_started",
            timestamp: Date.now(),
          }
        );
        addSnackbarHandler(
          t("notifications.summary.creating.title"),
          "success"
        );
      }

      // Создаем задачу для API запроса
      const taskFunction = async () => {
        return await store
          .dispatch(summaryApi.endpoints.createSummary.initiate(request))
          .unwrap();
      };

      // Настройки задачи с колбэками
      const taskOptions = {
        onSuccess: async (result: any) => {
          // Отправляем уведомление об успехе
          await sendNotification(
            t("notifications.summary.created.title"),
            t("notifications.summary.created.body"),
            {
              type: "summary_created",
              summaryId: result.id,
            }
          );
          addSnackbarHandler(
            t("notifications.summary.created.title"),
            "success"
          );

          // Вызываем пользовательский колбэк
          onSuccess?.(result);
        },
        onError: async (error: any) => {
          // Отправляем уведомление об ошибке
          await sendNotification(
            t("notifications.summary.error.title"),
            t("notifications.summary.error.body"),
            {
              type: "summary_error",
              error: error instanceof Error ? error.message : "Unknown error",
            }
          );
          addSnackbarHandler(t("notifications.summary.error.title"), "error");

          // Вызываем пользовательский колбэк
          onError?.(error);
        },
        metadata: { request },
      };

      return await createTask(taskFunction, taskOptions);
    },
    [createTask, t, sendNotification]
  );

  return {
    createSummaryInBackground,
    activeTasksCount,
    hasActiveTasks,
    cancelTask,
    cleanup,
  };
};
