import {
  useCreateAssistantStrategyMutation,
  useGetAssistantStrategyQuery,
  useUpdateAssistantStrategyMutation,
} from "@/src/entities/assistant/api/rtkApi";
import { useT } from "@/src/shared/lib/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createGrowthPoints } from "../../const/growthConfig";

interface UseGrowthFormReturn {
  values: {
    growth_points: string;
    growth_points_chips: string[];
  };
  isLoading: boolean;
  isSaving: boolean;
  handleChange: (key: string, value: any) => void;
  handleSubmit: () => Promise<void>;
}

export const useGrowthForm = (): UseGrowthFormReturn => {
  const t = useT();

  const [values, setValues] = useState({
    growth_points: "",
    growth_points_chips: [],
  });

  // Получаем опции чипсов
  const chipOptions = useMemo(() => createGrowthPoints(t), [t]);

  // Запросы к API
  const { data: strategy, isLoading } = useGetAssistantStrategyQuery();
  const [createStrategy, { isLoading: isCreating }] =
    useCreateAssistantStrategyMutation();
  const [updateStrategy, { isLoading: isUpdating }] =
    useUpdateAssistantStrategyMutation();

  const isSaving = isCreating || isUpdating;

  // Загружаем данные при получении ответа от сервера
  useEffect(() => {
    if (strategy) {
      const text = strategy.growth_points || "";
      const activeChips = chipOptions
        .filter((option) =>
          text.toLowerCase().includes(option.label.toLowerCase())
        )
        .map((option) => option.value);

      setValues({
        growth_points: text,
        growth_points_chips: activeChips,
      });
    }
  }, [strategy, chipOptions]);

  // Обработчик изменения полей
  const handleChange = useCallback(
    (key: string, value: any) => {
      if (key === "growth_points") {
        // Для текстового поля обновляем значение и синхронно пересчитываем активные чипсы
        const activeChips = chipOptions
          .filter((option) =>
            value.toLowerCase().includes(option.label.toLowerCase())
          )
          .map((option) => option.value);

        setValues((prev) => ({
          ...prev,
          growth_points: value,
          growth_points_chips: activeChips,
        }));
      } else if (key === "growth_points_chips") {
        // Для чипсов - добавляем/удаляем label в/из текста
        const newChips = Array.isArray(value) ? value : [];
        const addedChip = newChips.find(
          (chip) => !values.growth_points_chips.includes(chip)
        );
        const removedChip = values.growth_points_chips.find(
          (chip) => !newChips.includes(chip)
        );

        if (addedChip) {
          // Добавляем чипсу в текст
          const chipOption = chipOptions.find(
            (option) => option.value === addedChip
          );
          if (chipOption) {
            const currentText = values.growth_points.trim();
            let newText = "";

            if (currentText === "") {
              newText = `${chipOption.label}`;
            } else if (currentText.endsWith(".")) {
              newText = `${currentText} ${chipOption.label}`;
            } else {
              newText = `${currentText}. ${chipOption.label}`;
            }

            setValues((prev) => ({
              ...prev,
              growth_points: newText,
              growth_points_chips: newChips,
            }));
          }
        } else if (removedChip) {
          // Удаляем чипсу из текста
          const chipOption = chipOptions.find(
            (option) => option.value === removedChip
          );
          if (chipOption) {
            let newText = values.growth_points;

            // Удаляем различные варианты вхождения чипсы в тексте
            const patterns = [
              new RegExp(`\\.\\s*${chipOption.label}`, "gi"), // просто ". ЧипсаLabel"
              new RegExp(`${chipOption.label}`, "gi"), // просто "ЧипсаLabel"
            ];

            patterns.forEach((pattern) => {
              newText = newText.replace(pattern, "");
            });

            // Очищаем лишние пробелы и точки
            newText = newText
              .replace(/\.\s*\./g, ".") // убираем двойные точки
              .replace(/^\.\s*/, "") // убираем точку в начале
              .replace(/\s+/g, " ")
              .trim(); // убираем множественные пробелы

            setValues((prev) => ({
              ...prev,
              growth_points: newText,
              growth_points_chips: newChips,
            }));
          }
        } else {
          // Просто обновляем состояние чипсов
          setValues((prev) => ({
            ...prev,
            growth_points_chips: newChips,
          }));
        }
      } else {
        setValues((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    },
    [chipOptions, values.growth_points_chips]
  );

  // Обработчик отправки формы
  const handleSubmit = useCallback(async () => {
    const submitData = {
      growth_points: values.growth_points || "",
    };

    if (strategy) {
      // Обновляем существующую стратегию
      await updateStrategy(submitData).unwrap();
    } else {
      // Создаем новую стратегию
      await createStrategy(submitData).unwrap();
    }
  }, [values.growth_points, strategy, createStrategy, updateStrategy]);

  return {
    values,
    isLoading,
    isSaving,
    handleChange,
    handleSubmit,
  };
};
