import { UserResponse } from "@/src/entities/auth/model/types";
import { useT } from "@/src/shared/lib/hooks/useLang";
import { timestampToMonthYearValue } from "@/src/shared/ui";
import { FormFieldConfig } from "@/src/widgets";
import { useMemo } from "react";

/**
 * Тип поля формы редактирования профиля
 */
export type ProfileFormField = FormFieldConfig;

/**
 * Конфигурация формы редактирования профиля
 */
export interface ProfileFormConfig {
  /** Заголовок формы */
  title: string;
  /** Поля формы */
  fields: ProfileFormField[];
  /** Начальные значения полей */
  initialValues: Record<string, any>;
}

/**
 * Хук для получения конфигурации формы редактирования профиля
 * @param profileData - Данные профиля пользователя
 * @returns Конфигурация формы редактирования профиля
 */
export const useProfileFormConfig = (
  profileData?: UserResponse
): ProfileFormConfig => {
  const t = useT();

  const config = useMemo(() => {
    // Опции для выбора пола
    const genderOptions = [
      { label: t("profile.gender.male"), value: "male" },
      { label: t("profile.gender.female"), value: "female" },
      { label: t("profile.gender.other"), value: "other" },
    ];

    // Поля формы профиля
    const fields: ProfileFormField[] = [
      {
        key: "name",
        type: "text",
        label: t("profile.edit.name.label"),
        placeholder: t("profile.edit.name.placeholder"),
        required: true,
      },
      {
        key: "gender",
        type: "select",
        label: t("profile.edit.gender.label"),
        placeholder: t("profile.edit.gender.placeholder"),
        options: genderOptions,
      },

      {
        key: "country",
        type: "text",
        label: t("profile.edit.country.label"),
        placeholder: t("profile.edit.country.placeholder"),
      },
      {
        key: "birth_date",
        type: "month-year-picker",
        label: t("profile.edit.birthDate.label"),
        showDay: true,
        showMonth: true,
        showYear: true,
      },
    ];

    // Начальные значения из данных профиля
    const initialValues: Record<string, any> = {};

    if (profileData) {
      fields.forEach((field) => {
        if (field.key in profileData) {
          // Специальная обработка для даты рождения
          if (field.key === "birth_date") {
            initialValues[field.key] = timestampToMonthYearValue(
              profileData.birth_date
            );
          } else {
            initialValues[field.key] =
              profileData[field.key as keyof UserResponse] || "";
          }
        } else {
          // Устанавливаем значения по умолчанию для отсутствующих полей
          if (field.key === "birth_date") {
            initialValues[field.key] = {};
          } else {
            initialValues[field.key] = "";
          }
        }
      });
    } else {
      // Если данных профиля нет, устанавливаем пустые значения
      fields.forEach((field) => {
        if (field.key === "birth_date") {
          initialValues[field.key] = {};
        } else {
          initialValues[field.key] = "";
        }
      });
    }

    return {
      title: t("profile.edit.title"),
      fields,
      initialValues,
    };
  }, [profileData, t]);

  return config;
};
