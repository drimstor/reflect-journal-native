import { useCallback, useEffect, useState } from "react";
import {
  BackgroundTask,
  BackgroundTaskOptions,
  backgroundTaskService,
} from "../services/BackgroundTaskService";

interface UseBackgroundTaskReturn {
  // Методы для создания задач
  createTask: <T>(
    taskFunction: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
      metadata?: Record<string, any>;
    }
  ) => Promise<string>;

  // Состояние всех задач
  allActiveTasksCount: number;
  hasAnyActiveTasks: boolean;

  // Состояние задач определенного типа
  activeTasksCount: number;
  hasActiveTasks: boolean;
  activeTasks: BackgroundTask[];

  // Утилиты
  cancelTask: (taskId: string) => boolean;
  cancelAllTasksOfType: () => number;
  cleanup: () => void;
}

/**
 * Универсальный хук для работы с фоновыми задачами
 * @param taskType - тип задач для фильтрации (опционально)
 */
export const useBackgroundTask = (
  taskType?: string
): UseBackgroundTaskReturn => {
  const [allActiveTasksCount, setAllActiveTasksCount] = useState(0);
  const [activeTasksCount, setActiveTasksCount] = useState(0);
  const [activeTasks, setActiveTasks] = useState<BackgroundTask[]>([]);

  // Обновляем состояние активных задач
  const updateTasksState = useCallback(() => {
    const allTasks = backgroundTaskService.getActiveTasks();
    const filteredTasks = taskType
      ? backgroundTaskService.getActiveTasksByType(taskType)
      : allTasks;

    setAllActiveTasksCount(allTasks.length);
    setActiveTasksCount(filteredTasks.length);
    setActiveTasks(filteredTasks);
  }, [taskType]);

  // Периодически обновляем состояние
  useEffect(() => {
    const interval = setInterval(updateTasksState, 1000);
    updateTasksState(); // Сразу обновляем при монтировании
    return () => clearInterval(interval);
  }, [updateTasksState]);

  // Создание задачи
  const createTask = useCallback(
    async <T>(
      taskFunction: () => Promise<T>,
      options?: {
        onSuccess?: (result: T) => void;
        onError?: (error: any) => void;
        metadata?: Record<string, any>;
      }
    ): Promise<string> => {
      try {
        // Устанавливаем тип задачи если передан
        const taskOptions: BackgroundTaskOptions<T> = {
          ...options,
          taskType: taskType,
        };

        const taskId = await backgroundTaskService.createBackgroundTask(
          taskFunction,
          taskOptions
        );

        // Обновляем состояние
        updateTasksState();

        return taskId;
      } catch (error) {
        console.error("Ошибка при создании фоновой задачи:", error);
        throw error;
      }
    },
    [taskType, updateTasksState]
  );

  // Отмена конкретной задачи
  const cancelTask = useCallback(
    (taskId: string): boolean => {
      const result = backgroundTaskService.cancelTask(taskId);
      updateTasksState();
      return result;
    },
    [updateTasksState]
  );

  // Отмена всех задач определенного типа
  const cancelAllTasksOfType = useCallback((): number => {
    if (!taskType) return 0;

    const canceledCount = backgroundTaskService.cancelTasksByType(taskType);
    updateTasksState();
    return canceledCount;
  }, [taskType, updateTasksState]);

  // Очистка завершенных задач
  const cleanup = useCallback(() => {
    backgroundTaskService.cleanup();
    updateTasksState();
  }, [updateTasksState]);

  return {
    createTask,
    allActiveTasksCount,
    hasAnyActiveTasks: allActiveTasksCount > 0,
    activeTasksCount,
    hasActiveTasks: activeTasksCount > 0,
    activeTasks,
    cancelTask,
    cancelAllTasksOfType,
    cleanup,
  };
};
