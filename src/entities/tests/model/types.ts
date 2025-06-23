import { PaginationResponse } from "../../../shared/model/types";

// ============================================================================
// Базовые интерфейсы
// ============================================================================

/**
 * Структура вопроса в тесте
 * Поддерживает различные типы вопросов: multiple-choice, text, rating, etc.
 */
export interface TestQuestion {
  question: string;
  category: string;
}

/**
 * Вариант ответа для вопроса
 */
export interface TestQuestionOption {
  /** Уникальный идентификатор варианта */
  id: string;
  /** Текст варианта ответа */
  text: string;
  /** Баллы за выбор этого варианта */
  score?: number;
  /** Порядковый номер варианта */
  order?: number;
}

/**
 * Базовый интерфейс теста
 */
export interface Test {
  /** Уникальный идентификатор теста */
  id: string;
  /** Название теста */
  name: string;
  /** Описание теста */
  description: string;
  /** Основное содержание теста */
  content?: string;
  /** Тип теста: questions, personality, psychological, etc. */
  type: string;
  /** Список вопросов теста */
  questions: TestQuestion[];
  /** Системный промпт для AI анализа */
  system_prompt?: string;
  /** Команда для обработки результатов */
  command?: string;
  /** Связанные темы/теги */
  related_topics: string[];
  /** Время на прохождение теста (в минутах) */
  lead_time?: number;
  /** Отмечен ли тест как избранный */
  bookmarked: boolean;
  /** Дата создания */
  created_at: string;
}

/**
 * Результат прохождения теста
 */
export interface TestResult {
  /** Уникальный идентификатор результата */
  id: string;
  /** ID теста */
  test_id: string;
  /** ID пользователя */
  user_id: string;
  /** Ответы пользователя на вопросы */
  answers: Record<string, string>;
  /** Связанные темы/теги */
  related_topics: string[];
  /** Отмечен ли результат как избранный */
  bookmarked: boolean;
  /** Дата создания результата */
  created_at: string;
  /** Основное содержание теста */
  content?: string;
}

// ============================================================================
// API типы запросов
// ============================================================================

/**
 * Запрос на создание теста
 */
export interface CreateTestRequest {
  /** Название теста */
  title: string;
  /** Описание теста */
  description?: string;
  /** Список вопросов с вариантами ответов */
  questions: TestQuestion[];
  /** Связанные темы */
  related_topics?: string[];
  /** Добавить в закладки */
  bookmarked?: boolean;
}

/**
 * Запрос на обновление теста
 */
export interface UpdateTestRequest {
  /** Название теста */
  title?: string;
  /** Описание теста */
  description?: string;
  /** Список вопросов с вариантами ответов */
  questions?: TestQuestion[];
  /** Связанные темы */
  related_topics?: string[];
  /** Добавить в закладки */
  bookmarked?: boolean;
  /** Активность теста */
  is_active?: boolean;
}

/**
 * Запрос на создание результата теста
 */
export interface CreateTestResultRequest {
  /** ID теста */
  test_id: string;
  /** Ответы пользователя */
  answers: Record<string, string>;
  /** Связанные темы */
  related_topics?: string[];
  /** Добавить в закладки */
  bookmarked?: boolean;
}

/**
 * Запрос на обновление результата теста
 */
export interface UpdateTestResultRequest {
  /** Ответы пользователя */
  answers?: Record<string, string>;
  /** Оценка результата */
  score?: number;
  /** Текстовый результат */
  result_text?: string;
  /** Связанные темы */
  related_topics?: string[];
  /** Добавить в закладки */
  bookmarked?: boolean;
}

// ============================================================================
// API типы ответов
// ============================================================================

/**
 * Ответ со списком тестов
 */
export interface TestsResponse extends PaginationResponse<Test> {}

/**
 * Ответ со списком результатов тестов
 */
export interface TestResultsResponse extends PaginationResponse<TestResult> {}

// ============================================================================
// Фильтры
// ============================================================================

/**
 * Фильтры для поиска тестов
 */
export interface TestFilters {
  /** Фильтр по дате создания (с) */
  created_at_from?: string;
  /** Фильтр по дате создания (до) */
  created_at_to?: string;
  /** Фильтр по дате обновления (с) */
  updated_at_from?: string;
  /** Фильтр по дате обновления (до) */
  updated_at_to?: string;
  /** Поиск по названию */
  title?: string;
  /** Фильтр по связанным темам */
  related_topics?: string[];
  /** Фильтр по закладкам */
  bookmarked?: boolean;
  /** Фильтр по активности */
  is_active?: boolean;
  /** Фильтр по типу теста */
  type?: string;
}

/**
 * Фильтры для поиска результатов тестов
 */
export interface TestResultFilters {
  /** Фильтр по дате создания (с) */
  created_at_from?: string;
  /** Фильтр по дате создания (до) */
  created_at_to?: string;
  /** Фильтр по дате обновления (с) */
  updated_at_from?: string;
  /** Фильтр по дате обновления (до) */
  updated_at_to?: string;
  /** Фильтр по ID теста */
  test_id?: string;
  /** Минимальная оценка */
  score_min?: number;
  /** Максимальная оценка */
  score_max?: number;
  /** Фильтр по связанным темам */
  related_topics?: string[];
  /** Фильтр по закладкам */
  bookmarked?: boolean;
}

// ============================================================================
// Типы для UI компонентов
// ============================================================================

/**
 * Данные для отображения прогресса прохождения теста
 */
export interface TestProgress {
  /** Текущий номер вопроса */
  current_question: number;
  /** Общее количество вопросов */
  total_questions: number;
  /** Процент завершения */
  completion_percentage: number;
  /** Отвеченные вопросы */
  answered_questions: string[];
  /** Пропущенные вопросы */
  skipped_questions: string[];
}

/**
 * Состояние ответа на вопрос
 */
export interface TestAnswerState {
  /** ID вопроса */
  question_id: string;
  /** Значение ответа */
  value: any;
  /** Является ли ответ валидным */
  is_valid: boolean;
  /** Время ответа на вопрос (в секундах) */
  answer_time?: number;
}

/**
 * Тип для работы с результатами теста в UI
 */
export interface TestResultDisplay extends TestResult {
  /** Информация о тесте */
  test?: Pick<Test, "name" | "description" | "type">;
}

// ============================================================================
// Утилитарные типы
// ============================================================================

/**
 * Тип для различных вариантов сортировки тестов
 */
export type TestSortField = "name" | "created_at" | "updated_at";

/**
 * Тип для различных вариантов сортировки результатов тестов
 */
export type TestResultSortField = "created_at" | "updated_at" | "score";

/**
 * Статус прохождения теста
 */
export type TestStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "abandoned";

/**
 * Типы локализации для многоязычной поддержки
 */
export interface LocalizedText {
  /** Русский текст */
  ru: string;
  /** Английский текст */
  en: string;
}

/**
 * Интерфейс для локализованного теста
 */
export interface LocalizedTest
  extends Omit<Test, "name" | "description" | "questions"> {
  /** Локализованное название */
  name: LocalizedText | string;
  /** Локализованное описание */
  description: LocalizedText | string;
  /** Локализованные вопросы */
  questions: LocalizedTestQuestion[];
}

/**
 * Интерфейс для локализованного вопроса
 */
export interface LocalizedTestQuestion
  extends Omit<TestQuestion, "text" | "options"> {
  /** Локализованный текст вопроса */
  text: LocalizedText | string;
  /** Локализованные варианты ответов */
  options?: LocalizedTestQuestionOption[];
}

/**
 * Интерфейс для локализованного варианта ответа
 */
export interface LocalizedTestQuestionOption
  extends Omit<TestQuestionOption, "text"> {
  /** Локализованный текст варианта */
  text: LocalizedText | string;
}
