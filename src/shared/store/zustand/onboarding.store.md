# Onboarding Store

Стор для управления состоянием онбординга пользователя.

## Описание

Стор управляет прогрессом прохождения онбординга, включая:
- Текущий активный шаг
- Статус завершения онбординга
- Статус получения награды

## API

### Состояние

```typescript
interface OnboardingState {
  currentStep: number;        // Текущий активный шаг (0-4)
  isCompleted: boolean;       // Завершен ли весь онбординг
  isRewardClaimed: boolean;   // Забрали ли награду
}
```

### Действия

```typescript
// Установить текущий шаг
setCurrentStep(step: number): void

// Завершить текущий шаг и перейти к следующему
completeStep(): void

// Завершить весь онбординг
completeOnboarding(): void

// Забрать награду
claimReward(): void

// Сбросить онбординг
resetOnboarding(): void
```

### Константы

```typescript
const ONBOARDING_STEPS = [
  "Создайте запись в дневнике",
  "Создайте чат", 
  "Создайте цель",
  "Создайте саммари",
  "Проанализируйте данные"
];
```

## Использование

```typescript
import { useOnboardingStore, ONBOARDING_STEPS } from '@/src/shared/store';

const MyComponent = () => {
  const {
    currentStep,
    isCompleted,
    isRewardClaimed,
    completeStep,
    claimReward
  } = useOnboardingStore();

  return (
    <OnboardingCounter
      steps={ONBOARDING_STEPS}
      currentStep={currentStep}
    />
  );
};
```

## Персистентность

Стор автоматически сохраняется в AsyncStorage с ключом `onboarding-storage`.

## Логика работы

1. **Начальное состояние**: `currentStep = 0`, `isCompleted = false`, `isRewardClaimed = false`
2. **Завершение шага**: `completeStep()` увеличивает `currentStep` на 1
3. **Завершение онбординга**: при достижении последнего шага `isCompleted = true`
4. **Получение награды**: `claimReward()` устанавливает `isRewardClaimed = true`
5. **Сброс**: `resetOnboarding()` возвращает к начальному состоянию
