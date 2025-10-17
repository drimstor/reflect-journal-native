import { SubscriptionPlan } from "@/src/entities/auth/model/types";

export interface PlanFeature {
  key: string;
}

export interface PlanConfig {
  name: string;
  features: PlanFeature[];
}

// Конфигурация планов для отображения в UI
export const PLANS_CONFIG: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    name: "Free",
    features: [
      { key: "subscription.planFeatures.free.journals" },
      { key: "subscription.planFeatures.free.entries" },
      { key: "subscription.planFeatures.free.chats" },
      { key: "subscription.planFeatures.free.messages" },
      { key: "subscription.planFeatures.free.goals" },
      { key: "subscription.planFeatures.free.summaries" },
      { key: "subscription.planFeatures.free.tests" },
    ],
  },
  premium: {
    name: "Premium",
    features: [
      { key: "subscription.planFeatures.premium.unlimited" },
      { key: "subscription.planFeatures.premium.attachments" },
      { key: "subscription.planFeatures.premium.voice" },
      { key: "subscription.planFeatures.premium.insights" },
      { key: "subscription.planFeatures.premium.premiumAI" },
      { key: "subscription.planFeatures.premium.analytics" },
    ],
  },
};

// Порядок отображения планов
export const PLAN_ORDER: SubscriptionPlan[] = ["free", "premium"];
