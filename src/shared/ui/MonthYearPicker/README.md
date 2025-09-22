# MonthYearPicker

Кастомный компонент для выбора дня, месяца и года с использованием трех отдельных селектов.

## Возможности

- 🗓️ Выбор дня (1-31), месяца и года
- 🎛️ Гибкая настройка отображения селектов
- 🌍 Поддержка локализации (переводы в `date.picker`)
- 🎨 Поддержка кастомной темы
- ♿ Поддержка доступности

## Использование

### Базовый пример

```tsx
import { MonthYearPicker, MonthYearValue } from "@/src/shared/ui";

const [dateValue, setDateValue] = useState<MonthYearValue>({});

<MonthYearPicker
  label="Дата рождения"
  value={dateValue}
  onValueChange={setDateValue}
/>
```

### Только месяц и год

```tsx
<MonthYearPicker
  label="Период"
  value={dateValue}
  onValueChange={setDateValue}
  showDay={false}
  showMonth={true}
  showYear={true}
/>
```

### Только год

```tsx
<MonthYearPicker
  label="Год выпуска"
  value={dateValue}
  onValueChange={setDateValue}
  showDay={false}
  showMonth={false}
  showYear={true}
  minYear={1990}
  maxYear={2024}
/>
```

### С кастомными плейсхолдерами

```tsx
<MonthYearPicker
  label="Дата события"
  value={dateValue}
  onValueChange={setDateValue}
  placeholders={{
    day: "Выберите день",
    month: "Выберите месяц", 
    year: "Выберите год"
  }}
  helperText="Выберите дату события"
/>
```

## API

### Props

| Prop | Тип | По умолчанию | Описание |
|------|-----|--------------|----------|
| `value` | `MonthYearValue` | `{}` | Текущее значение |
| `label` | `string` | - | Метка поля |
| `helperText` | `string` | - | Вспомогательный текст |
| `backgroundColor` | `string` | - | Цвет фона селектов |
| `labelColor` | `string` | - | Цвет метки |
| `helperTextColor` | `string` | - | Цвет вспомогательного текста |
| `required` | `boolean` | `false` | Обязательное поле |
| `onValueChange` | `(value: MonthYearValue) => void` | - | Обработчик изменения |
| `enabled` | `boolean` | `true` | Включен ли компонент |
| `showDay` | `boolean` | `true` | Показывать селектор дня |
| `showMonth` | `boolean` | `true` | Показывать селектор месяца |
| `showYear` | `boolean` | `true` | Показывать селектор года |
| `minYear` | `number` | `1950` | Минимальный год |
| `maxYear` | `number` | `текущий + 10` | Максимальный год |
| `placeholders` | `object` | - | Кастомные плейсхолдеры |

### MonthYearValue

```tsx
interface MonthYearValue {
  day?: number;    // 1-31
  month?: number;  // 1-12
  year?: number;   // minYear-maxYear
}
```

## Примеры использования

### В форме создания сущности

```tsx
const [birthDate, setBirthDate] = useState<MonthYearValue>({
  day: 15,
  month: 6,
  year: 1990
});

<MonthYearPicker
  label="Дата рождения"
  value={birthDate}
  onValueChange={setBirthDate}
  required
  helperText="Укажите вашу дату рождения"
/>
```

### Для фильтрации по периодам

```tsx
const [periodStart, setPeriodStart] = useState<MonthYearValue>({});

<MonthYearPicker
  label="Начало периода"
  value={periodStart}
  onValueChange={setPeriodStart}
  showDay={false}
  placeholders={{
    month: "Месяц начала",
    year: "Год начала"
  }}
/>
```

## Утилиты для работы с датами

В UI kit доступны готовые хелперы для работы с `MonthYearValue`:

```tsx
import {
  monthYearValueToDate,
  dateToMonthYearValue,
  timestampToMonthYearValue,
  monthYearValueToTimestamp,
  isMonthYearValueEmpty,
  isMonthYearValueComplete,
  formatMonthYearValue
} from "@/src/shared/ui";

// Конвертация в Date
const date = monthYearValueToDate(birthDate);

// Конвертация из Date  
const monthYear = dateToMonthYearValue(new Date());

// Работа с timestamp (миллисекунды, int64)
const timestamp = monthYearValueToTimestamp(birthDate);
const fromTimestamp = timestampToMonthYearValue(1640995200000);

// Проверки
const isEmpty = isMonthYearValueEmpty(birthDate);
const isComplete = isMonthYearValueComplete(birthDate);

// Форматирование
const shortFormat = formatMonthYearValue(birthDate, 'short'); // "15.06.1990"
const longFormat = formatMonthYearValue(birthDate, 'long');   // "15 Июнь 1990"
```
