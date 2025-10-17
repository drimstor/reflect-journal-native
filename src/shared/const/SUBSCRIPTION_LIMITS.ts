import { SubscriptionPlan } from "@/src/entities/auth/model/types";
import { ENTITY_NAME } from "./ENTITIES";

// Ключи для конфигурации лимитов
export const LIMIT_ENTITY_NAME = {
  GOAL_GENERATIONS: "goal_generations",
} as const;

// Типы для конфигурации лимитов
export interface LimitConfig {
  total: number; // Общее количество (-1 = безлимитно)
  perDay: number; // Количество в день (-1 = безлимитно)
  periodDays?: number; // Для саммари: максимальный период в днях (-1 = безлимитно)
}

export interface PlanLimits {
  [ENTITY_NAME.JOURNALS]: LimitConfig;
  [ENTITY_NAME.JOURNAL_ENTRIES]: LimitConfig;
  [ENTITY_NAME.CHATS]: LimitConfig;
  [ENTITY_NAME.MESSAGES]: LimitConfig;
  [ENTITY_NAME.GOALS]: LimitConfig;
  [ENTITY_NAME.GOAL_GENERATIONS]: LimitConfig;
  [ENTITY_NAME.SUMMARIES]: LimitConfig;
  [ENTITY_NAME.TESTS]: LimitConfig;
  features: {
    attachments: boolean;
    voiceRecording: boolean;
    advancedAnalytics?: boolean;
    premiumAI?: boolean;
  };
}

// Конфигурация лимитов для каждого плана
// -1 означает "без ограничений"
export const SUBSCRIPTION_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    [ENTITY_NAME.JOURNALS]: { total: 2, perDay: -1 },
    [ENTITY_NAME.JOURNAL_ENTRIES]: { total: -1, perDay: 2 },
    [ENTITY_NAME.CHATS]: { total: 2, perDay: -1 },
    [ENTITY_NAME.MESSAGES]: { total: -1, perDay: 10 },
    [ENTITY_NAME.GOALS]: { total: 3, perDay: -1 },
    [LIMIT_ENTITY_NAME.GOAL_GENERATIONS]: { total: -1, perDay: 3 },
    [ENTITY_NAME.SUMMARIES]: { total: -1, perDay: 1, periodDays: 7 },
    [ENTITY_NAME.TESTS]: { total: -1, perDay: 1 },
    features: {
      attachments: false,
      voiceRecording: false,
      advancedAnalytics: false,
    },
  },
  premium: {
    [ENTITY_NAME.JOURNALS]: { total: -1, perDay: -1 },
    [ENTITY_NAME.JOURNAL_ENTRIES]: { total: -1, perDay: -1 },
    [ENTITY_NAME.CHATS]: { total: -1, perDay: -1 },
    [ENTITY_NAME.MESSAGES]: { total: -1, perDay: -1 },
    [ENTITY_NAME.GOALS]: { total: -1, perDay: -1 },
    [LIMIT_ENTITY_NAME.GOAL_GENERATIONS]: { total: -1, perDay: -1 },
    [ENTITY_NAME.SUMMARIES]: { total: -1, perDay: -1, periodDays: -1 },
    [ENTITY_NAME.TESTS]: { total: -1, perDay: -1 },
    features: {
      attachments: true,
      voiceRecording: true,
      advancedAnalytics: true,
      premiumAI: true,
    },
  },
};

// Тип для ключей лимитов (используем названия из ENTITY_NAME)
export type LimitType =
  | typeof ENTITY_NAME.JOURNALS
  | typeof ENTITY_NAME.JOURNAL_ENTRIES
  | typeof ENTITY_NAME.CHATS
  | typeof ENTITY_NAME.MESSAGES
  | typeof ENTITY_NAME.GOALS
  | typeof LIMIT_ENTITY_NAME.GOAL_GENERATIONS
  | typeof ENTITY_NAME.SUMMARIES
  | typeof ENTITY_NAME.TESTS;
