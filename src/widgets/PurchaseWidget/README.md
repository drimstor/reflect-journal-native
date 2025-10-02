# Интеграция react-native-iap для платежей

## Обзор

Мы интегрировали библиотеку `react-native-iap` для поддержки покупок внутри приложения на Android и iOS. Система поддерживает:

- **Разовые покупки** (пожизненная премиум подписка)
- **Подписки** (месячные и годовые)
- **Восстановление покупок**
- **Валидация на сервере**

## Установленные компоненты

### 1. Сущности (`src/entities/purchases/`)
- `types.ts` - Типы для продуктов, покупок и состояния
- `config.ts` - Конфигурация продуктов и их отображения
- `services/PurchaseService.ts` - Основной сервис для работы с платежами
- `hooks/usePurchases.ts` - React хук для удобного использования

### 2. Компоненты UI (`src/features/purchases/`)
- `ProductCard/` - Карточка продукта с информацией и кнопкой покупки

### 3. Виджеты (`src/widgets/`)
- `PurchaseWidget/` - Основной виджет со списком продуктов

### 4. Экраны (`app/screens/`)
- `PurchaseScreen/` - Экран покупок с навигацией

## Конфигурация продуктов

В файле `src/entities/purchases/config.ts` настроены продукты:

```typescript
export const PRODUCT_TYPES = {
  PREMIUM_MONTHLY: 'premium_monthly',
  PREMIUM_YEARLY: 'premium_yearly', 
  PREMIUM_LIFETIME: 'premium_lifetime',
} as const;

export const PRODUCT_SKUS = {
  [PRODUCT_TYPES.PREMIUM_MONTHLY]: {
    android: 'premium_monthly_android',
    ios: 'premium_monthly_ios',
  },
  // ... остальные продукты
};
```

## Использование

### Базовое использование в компоненте:

```typescript
import { usePurchases } from '../entities/purchases/hooks/usePurchases';
import { PRODUCT_TYPES } from '../entities/purchases/config';

function MyComponent() {
  const {
    products,
    subscriptions,
    isLoading,
    error,
    purchaseProduct,
    restorePurchases,
    hasActiveSubscription,
  } = usePurchases();

  const handlePurchase = async () => {
    try {
      await purchaseProduct(PRODUCT_TYPES.PREMIUM_YEARLY);
    } catch (error) {
      console.error('Ошибка покупки:', error);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Ошибка восстановления:', error);
    }
  };

  return (
    <PurchaseWidget />
  );
}
```

## Настройка магазинов приложений

### Android (Google Play Console)

1. **Создайте продукты в Google Play Console:**
   - Откройте Google Play Console
   - Перейдите в раздел "Монетизация" → "Продукты"
   - Создайте продукты с ID:
     - `premium_monthly_android`
     - `premium_yearly_android`
     - `premium_lifetime_android`

2. **Настройте тестирование:**
   - Добавьте тестовые аккаунты
   - Загрузите тестовую версию APK
   - Протестируйте покупки

3. **Получите лицензионный ключ:**
   - Скопируйте из раздела "Настройки" → "Лицензирование"

### iOS (App Store Connect)

1. **Создайте продукты в App Store Connect:**
   - Откройте App Store Connect
   - Перейдите в "Функции" → "Покупки в приложении"
   - Создайте продукты с ID:
     - `premium_monthly_ios`
     - `premium_yearly_ios`
     - `premium_lifetime_ios`

2. **Настройте тестирование:**
   - Создайте тестовых пользователей Sandbox
   - Загрузите тестовую сборку через TestFlight
   - Протестируйте покупки

## API методы

### PurchaseService

```typescript
// Инициализация
await purchaseService.initialize();

// Получение продуктов
const products = await purchaseService.getAvailableProducts();
const subscriptions = await purchaseService.getAvailableSubscriptions();

// Покупка
await purchaseService.purchaseProduct(PRODUCT_TYPES.PREMIUM_YEARLY);

// Восстановление покупок
const purchases = await purchaseService.restorePurchases();

// Проверка активных подписок
const hasActive = await purchaseService.checkActiveSubscriptions();

// Завершение
await purchaseService.terminate();
```

### usePurchases хук

```typescript
const {
  // Состояние
  products,           // Доступные продукты
  subscriptions,      // Доступные подписки
  purchases,          // Совершенные покупки
  isLoading,          // Индикатор загрузки
  error,              // Ошибка
  isConnected,        // Статус подключения к магазину
  
  // Методы
  purchaseProduct,    // Покупка продукта
  restorePurchases,   // Восстановление покупок
  hasActiveSubscription, // Проверка активной подписки
  getProductByType,   // Получение продукта по типу
  clearError,         // Очистка ошибки
  refresh,            // Обновление данных
} = usePurchases();
```

## Валидация на сервере

Для безопасности все покупки должны валидироваться на сервере. В файле `PurchaseService.ts` есть заготовка:

```typescript
private async validatePurchaseOnServer(purchase: Purchase): Promise<void> {
  try {
    // TODO: Реализовать отправку на сервер для валидации
    const response = await api.validatePurchase(purchase);
    // Обработка ответа
  } catch (error) {
    console.error('Ошибка валидации покупки на сервере:', error);
  }
}
```

## Обработка ошибок

Система обрабатывает различные типы ошибок:

- `INIT_ERROR` - Ошибка инициализации
- `PURCHASE_ERROR` - Ошибка покупки
- `RESTORE_ERROR` - Ошибка восстановления
- `PURCHASE_PROCESSING_ERROR` - Ошибка обработки покупки

## Тестирование

### Android
1. Используйте тестовые аккаунты Google Play
2. Установите приложение через Google Play Console (Internal Testing)
3. Тестируйте покупки с тестовыми картами

### iOS
1. Используйте тестовых пользователей Sandbox
2. Установите приложение через TestFlight
3. Тестируйте покупки в режиме Sandbox

## Развертывание

### Перед публикацией:

1. **Обновите SKU продуктов** в `config.ts` на реальные ID из магазинов
2. **Реализуйте серверную валидацию** покупок
3. **Протестируйте** все сценарии покупок
4. **Настройте аналитику** для отслеживания конверсии

### Чек-лист:
- [ ] Продукты созданы в Google Play Console
- [ ] Продукты созданы в App Store Connect  
- [ ] SKU обновлены в конфигурации
- [ ] Серверная валидация реализована
- [ ] Тестирование пройдено на обеих платформах
- [ ] Аналитика настроена

## Возможные проблемы

1. **Ошибка инициализации** - Проверьте подключение к интернету и настройки магазина
2. **Продукты не загружаются** - Убедитесь что SKU корректные и продукты активны
3. **Покупка не проходит** - Проверьте тестовые аккаунты и настройки Sandbox
4. **Восстановление не работает** - Убедитесь что пользователь авторизован в магазине

## Поддержка

При возникновении проблем:
1. Проверьте логи в консоли
2. Убедитесь что все настройки магазинов корректны
3. Протестируйте на реальных устройствах
4. Обратитесь к документации react-native-iap
