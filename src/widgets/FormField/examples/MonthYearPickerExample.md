# Использование MonthYearPicker в FormField

## Примеры конфигурации

### Полный датапикер (день, месяц, год)

```tsx
const birthDateField: FormFieldConfig = {
  key: "birthDate",
  type: "month-year-picker",
  label: "Дата рождения",
  required: true,
  showDay: true,
  showMonth: true, 
  showYear: true,
  minYear: 1950,
  maxYear: 2010,
  monthYearPlaceholders: {
    day: "День",
    month: "Месяц рождения",
    year: "Год рождения"
  }
};
```

### Только месяц и год

```tsx
const startPeriodField: FormFieldConfig = {
  key: "startPeriod",
  type: "month-year-picker",
  label: "Начало периода",
  showDay: false,
  showMonth: true,
  showYear: true,
  minYear: 2020,
  maxYear: 2030,
  monthYearPlaceholders: {
    month: "Месяц начала",
    year: "Год начала"
  }
};
```

### Только год

```tsx
const graduationYearField: FormFieldConfig = {
  key: "graduationYear", 
  type: "month-year-picker",
  label: "Год окончания",
  showDay: false,
  showMonth: false,
  showYear: true,
  minYear: 1990,
  maxYear: 2030,
  monthYearPlaceholders: {
    year: "Выберите год окончания"
  }
};
```

## Использование в форме

```tsx
import { FormField } from "@/src/widgets/FormField/FormField";
import type { MonthYearValue } from "@/src/shared/ui";

const [formData, setFormData] = useState({
  birthDate: {} as MonthYearValue,
  startPeriod: {} as MonthYearValue,
  graduationYear: {} as MonthYearValue,
});

const handleFieldChange = (key: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [key]: value
  }));
};

// В рендере
<FormField
  field={birthDateField}
  value={formData.birthDate}
  onChange={handleFieldChange}
/>
```

## Обработка данных

Компонент возвращает объект типа `MonthYearValue`:

```tsx
interface MonthYearValue {
  day?: number;    // 1-31
  month?: number;  // 1-12  
  year?: number;   // minYear-maxYear
}

// Пример значения:
{
  day: 15,
  month: 6,    // Июнь
  year: 1990
}
```

## Валидация

```tsx
const validateBirthDate = (value: MonthYearValue): string | undefined => {
  if (!value.day || !value.month || !value.year) {
    return "Заполните все поля даты рождения";
  }
  
  const currentYear = new Date().getFullYear();
  if (value.year > currentYear - 18) {
    return "Возраст должен быть не менее 18 лет";
  }
  
  return undefined;
};

// Использование
const error = validateBirthDate(formData.birthDate);

<FormField
  field={birthDateField}
  value={formData.birthDate}
  error={error}
  onChange={handleFieldChange}
/>
```

## Преобразование в Date

```tsx
const monthYearToDate = (value: MonthYearValue): Date | null => {
  if (!value.month || !value.year) return null;
  
  const day = value.day || 1;
  return new Date(value.year, value.month - 1, day);
};

const dateToMonthYear = (date: Date): MonthYearValue => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};
```
