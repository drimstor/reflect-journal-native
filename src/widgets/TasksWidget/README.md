# TasksWidget - Фильтрация целей

## Обзор
Компонент TasksWidget обеспечивает отображение и фильтрацию целей пользователя по статусам выполнения.

## Логика определения статусов

### Статусы целей
- `complete` - цель полностью завершена
- `in_progress` - цель в процессе выполнения  
- `to_do` - цель еще не начата

### Алгоритм определения статуса
1. **Complete**: `goal.is_completed === true`
2. **To Do**: `goal.is_completed === false` И все элементы `checklist` имеют `is_completed === false`
3. **In Progress**: `goal.is_completed === false` И есть хотя бы один элемент `checklist` с `is_completed === true`

## Функции

### `getGoalStatus(goal: Goal): GoalStatus`
Определяет статус одной цели на основе её состояния и состояния чеклиста.

**Параметры:**
- `goal`: объект цели типа `Goal`

**Возвращает:** статус цели типа `GoalStatus`

### `filterGoalsByStatus(goals: Goal[], status: GoalStatus): Goal[]`
Фильтрует массив целей по заданному статусу.

**Параметры:**
- `goals`: массив целей
- `status`: статус для фильтрации

**Возвращает:** отфильтрованный массив целей

### `getGoalStatusCounts(goals: Goal[])`
Подсчитывает количество целей для каждого статуса.

**Параметры:**
- `goals`: массив целей

**Возвращает:** объект с количеством целей по статусам
```typescript
{
  to_do: number,
  in_progress: number,
  complete: number
}
```

## Структура данных

### Goal
```typescript
interface Goal {
  id: string;
  user_id: string;
  name: string;
  checklist: ChecklistItem[];
  created_at: string;
  updated_at: string;
  related_entities: RelatedEntity[];
  related_topics: string[];
  is_completed: boolean;
  bookmarked: boolean;
}
```

### ChecklistItem
```typescript
interface ChecklistItem {
  id: string;
  title: string;
  is_completed: boolean;
  completed_at: string | null;
}
```

## Использование

```typescript
import { 
  filterGoalsByStatus, 
  getGoalStatusCounts,
  getGoalStatus 
} from './lib/helpers/goalFilters';

// Фильтрация целей
const filteredGoals = filterGoalsByStatus(goals, 'in_progress');

// Подсчет статусов
const counts = getGoalStatusCounts(goals);

// Определение статуса одной цели
const status = getGoalStatus(goal);
``` 