import { useT } from "@/src/shared/lib/hooks";
import { FormFieldConfig } from "@/src/widgets/FormField/FormField";
import { useMemo } from "react";
import { Variant } from "../../model/types";

/**
 * Конфигурация формы авторизации
 */
export interface AuthFormConfig {
  /** Заголовок формы */
  title: string;
  /** Поля формы */
  fields: FormFieldConfig[];
  /** Начальные значения полей */
  initialValues: Record<string, any>;
  /** Текст кнопки отправки */
  submitText: string;
}

/**
 * Хук для получения конфигурации формы авторизации в зависимости от варианта
 * @param variant - Вариант формы авторизации
 * @returns Конфигурация формы авторизации
 */
export const useAuthFormConfig = (variant: Variant): AuthFormConfig => {
  const t = useT();

  // Мемоизируем конфигурацию для каждого варианта
  const config = useMemo((): AuthFormConfig => {
    let fields: FormFieldConfig[] = [];
    let title = "";
    let submitText = "";
    const initialValues: Record<string, any> = {};

    switch (variant) {
      case "signIn":
        title = t("auth.signIn.title");
        submitText = t("auth.signIn.submit");
        fields = [
          {
            key: "email",
            type: "text",
            label: t("auth.email.label"),
            placeholder: t("auth.email.placeholder"),
            required: true,
          },
          {
            key: "password",
            type: "text",
            label: t("auth.password.label"),
            placeholder: t("auth.password.placeholder"),
            required: true,
            secureTextEntry: true,
          },
        ];
        initialValues.email = "aa@aa.aa";
        initialValues.password = "123456";
        break;

      case "signUp":
        title = t("auth.signUp.title");
        submitText = t("auth.signUp.submit");
        fields = [
          {
            key: "email",
            type: "text",
            label: t("auth.email.label"),
            placeholder: t("auth.email.placeholder"),
            required: true,
          },
          {
            key: "password",
            type: "text",
            label: t("auth.password.label"),
            placeholder: t("auth.password.placeholder"),
            required: true,
            secureTextEntry: true,
          },
          {
            key: "confirmPassword",
            type: "text",
            label: t("auth.confirmPassword.label"),
            placeholder: t("auth.confirmPassword.placeholder"),
            required: true,
            secureTextEntry: true,
          },
        ];
        initialValues.email = "";
        initialValues.password = "";
        initialValues.confirmPassword = "";
        break;

      case "growthPoints":
        title = t("settings.growthSettings");
        break;

      case "assistant":
        title = t("settings.assistantSettings");
        break;

      case "profile":
        title = t("settings.profile");
        break;

      default:
        title = t("auth.splash.title");
        submitText = t("auth.splash.submit");
        fields = [];
        break;
    }

    return {
      title,
      fields,
      initialValues,
      submitText,
    };
  }, [variant, t]);

  return config;
};
