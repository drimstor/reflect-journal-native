interface BackgroundTaskOptions<T = any> {
  // Основные колбэки
  onSuccess?: (result: T) => void;
  onError?: (error: any) => void;

  // Настройки
  taskType?: string; // Для группировки задач
  metadata?: Record<string, any>; // Дополнительные данные
}

interface BackgroundTask<T = any> {
  id: string;
  type: string;
  timestamp: number;
  metadata?: Record<string, any>;
  options: BackgroundTaskOptions<T>;
}

class BackgroundTaskService {
  private activeTasks: Map<string, BackgroundTask> = new Map();
  private taskCounter = 0;

  /**
   * Создает фоновую задачу
   * @param taskFunction - Асинхронная функция, которая выполняет задачу
   * @param options - Опции для задачи (колбэки, уведомления и т.д.)
   * @returns Promise с ID задачи
   */
  async createBackgroundTask<T>(
    taskFunction: () => Promise<T>,
    options: BackgroundTaskOptions<T> = {}
  ): Promise<string> {
    const taskId = this.generateTaskId(options.taskType || "generic");

    // Создаем задачу
    const task: BackgroundTask<T> = {
      id: taskId,
      type: options.taskType || "generic",
      timestamp: Date.now(),
      metadata: options.metadata,
      options,
    };

    this.activeTasks.set(taskId, task);

    // Запускаем задачу в фоне
    this.processTask(taskId, taskFunction);

    return taskId;
  }

  /**
   * Обработка задачи в фоне
   */
  private async processTask<T>(
    taskId: string,
    taskFunction: () => Promise<T>
  ): Promise<void> {
    const task = this.activeTasks.get(taskId);
    if (!task) return;

    try {
      // Выполняем задачу
      const result = await taskFunction();

      // Вызываем колбэк успеха
      task.options.onSuccess?.(result);
    } catch (error) {
      // Вызываем колбэк ошибки
      task.options.onError?.(error);

      console.error(`Ошибка в фоновой задаче ${taskId}:`, error);
    } finally {
      this.activeTasks.delete(taskId);
    }
  }

  /**
   * Получить список активных задач
   */
  getActiveTasks(): BackgroundTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Получить активные задачи определенного типа
   */
  getActiveTasksByType(taskType: string): BackgroundTask[] {
    return this.getActiveTasks().filter((task) => task.type === taskType);
  }

  /**
   * Проверить есть ли активные задачи
   */
  hasActiveTasks(): boolean {
    return this.activeTasks.size > 0;
  }

  /**
   * Проверить есть ли активные задачи определенного типа
   */
  hasActiveTasksOfType(taskType: string): boolean {
    return this.getActiveTasksByType(taskType).length > 0;
  }

  /**
   * Получить количество активных задач
   */
  getActiveTasksCount(): number {
    return this.activeTasks.size;
  }

  /**
   * Получить количество активных задач определенного типа
   */
  getActiveTasksCountByType(taskType: string): number {
    return this.getActiveTasksByType(taskType).length;
  }

  /**
   * Отменить задачу (удаляет из списка, но не останавливает выполнение)
   */
  cancelTask(taskId: string): boolean {
    return this.activeTasks.delete(taskId);
  }

  /**
   * Отменить все задачи определенного типа
   */
  cancelTasksByType(taskType: string): number {
    const tasksToCancel = this.getActiveTasksByType(taskType);
    let canceledCount = 0;

    for (const task of tasksToCancel) {
      if (this.activeTasks.delete(task.id)) {
        canceledCount++;
      }
    }

    return canceledCount;
  }

  /**
   * Очистить завершенные задачи (для очистки памяти)
   */
  cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();

    for (const [taskId, task] of this.activeTasks.entries()) {
      if (now - task.timestamp > maxAge) {
        this.activeTasks.delete(taskId);
      }
    }
  }

  /**
   * Генерирует уникальный ID для задачи
   */
  private generateTaskId(taskType: string): string {
    this.taskCounter++;
    return `${taskType}_${Date.now()}_${this.taskCounter}_${Math.random()
      .toString(36)
      .substr(2, 6)}`;
  }
}

// Экспортируем единственный экземпляр сервиса
export const backgroundTaskService = new BackgroundTaskService();

// Экспортируем типы для удобства
export type { BackgroundTask, BackgroundTaskOptions };
