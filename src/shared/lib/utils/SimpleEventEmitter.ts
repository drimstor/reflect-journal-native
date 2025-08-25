/**
 * Простой кастомный EventEmitter для React Native
 *
 * Поскольку в React Native нет встроенного модуля 'events',
 * используем собственную реализацию для подписки на события
 *
 * @example
 * ```typescript
 * const emitter = new SimpleEventEmitter();
 *
 * // Подписка на событие
 * emitter.on('dataChanged', (data) => {
 *   console.log('Данные изменились:', data);
 * });
 *
 * // Отправка события
 * emitter.emit('dataChanged', { id: 1, name: 'test' });
 *
 * // Отписка от события
 * emitter.off('dataChanged', handler);
 * ```
 */
export class SimpleEventEmitter {
  private listeners: { [key: string]: Function[] } = {};

  /**
   * Подписывается на событие
   * @param event - Название события
   * @param listener - Функция-обработчик события
   */
  on(event: string, listener: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  /**
   * Отписывается от события
   * @param event - Название события
   * @param listener - Функция-обработчик для удаления
   */
  off(event: string, listener: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (l) => l !== listener
      );
    }
  }

  /**
   * Отправляет событие всем подписчикам
   * @param event - Название события
   * @param args - Аргументы для передачи обработчикам
   */
  emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(...args));
    }
  }

  /**
   * Удаляет всех слушателей для определенного события
   * @param event - Название события
   */
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Возвращает количество слушателей для события
   * @param event - Название события
   * @returns Количество слушателей
   */
  listenerCount(event: string): number {
    return this.listeners[event]?.length || 0;
  }
}
