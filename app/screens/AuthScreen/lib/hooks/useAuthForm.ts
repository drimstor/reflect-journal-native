import { useLoginMutation, useRegisterMutation } from "@/src/entities";
import { useT } from "@/src/shared/lib/hooks";
import { NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { PATHS } from "../../../../../src/shared/const";
import { Variant } from "../../model/types";
import { AuthFormConfig } from "./useAuthFormConfig";

/**
 * Хук для управления формой авторизации
 * @param config - Конфигурация формы
 * @param variant - Вариант формы авторизации
 * @param snapToIndex - Функция для управления bottom sheet
 * @param setVariant - Функция для управления вариантом формы
 * @returns Объект с методами управления формой
 */
export const useAuthForm = (
  config: AuthFormConfig,
  variant: Variant,
  snapToIndex: (index: number) => void,
  setVariant: (variant: Variant) => void,
  onLogin: () => void
) => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  // Состояние формы
  const [values, setValues] = useState<Record<string, any>>(
    config.initialValues || {}
  );

  // Состояние ошибок
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Обработчик изменения поля
  const handleChange = useCallback(
    (key: string, value: any) => {
      setValues((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Сбрасываем ошибку при изменении поля
      if (errors[key]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Валидация формы
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Валидация email
    if (!values.email?.trim()) {
      newErrors.email = t("auth.validation.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
      isValid = false;
    }

    // Валидация пароля
    if (!values.password?.trim()) {
      newErrors.password = t("auth.validation.passwordRequired");
      isValid = false;
    } else if (values.password.length < 6) {
      newErrors.password = t("auth.validation.passwordTooShort");
      isValid = false;
    }

    // Дополнительные проверки для регистрации
    if (variant === "signUp") {
      if (!values.confirmPassword?.trim()) {
        newErrors.confirmPassword = t(
          "auth.validation.confirmPasswordRequired"
        );
        isValid = false;
      } else if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = t("auth.validation.passwordsDoNotMatch");
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, variant, t]);

  // Отправка формы
  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }

    try {
      if (variant === "signIn") {
        await loginMutation({
          email: values.email.toLowerCase(),
          password: values.password,
        }).unwrap();
        onLogin();
        // return setVariant("profile"); // TODO: temporary

        snapToIndex(1);
        setTimeout(() => {
          navigation.navigate(PATHS.MAIN_STACK);
        }, 300);
      }

      if (variant === "signUp") {
        await registerMutation({
          email: values.email.toLowerCase(),
          password: values.password,
        }).unwrap();
        setVariant("profile");
      }
    } catch (error) {
      console.error("Ошибка при авторизации:", error);
      // Ошибки от сервера будут обработаны в RTK Query
    }
  }, [
    values,
    variant,
    validate,
    loginMutation,
    registerMutation,
    navigation,
    snapToIndex,
    onLogin,
    setVariant,
  ]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setValues(config.initialValues || {});
    setErrors({});
  }, [config.initialValues]);

  // Инициализируем значения только при изменении конфигурации (смене варианта)
  useEffect(() => {
    setValues((prev) => {
      const currentKeys = Object.keys(prev);
      const configKeys = Object.keys(config.initialValues);

      // Если форма пустая или появились новые поля
      const hasNewFields = configKeys.some((key) => !(key in prev));
      const isEmpty = currentKeys.length === 0;

      if (isEmpty || hasNewFields) {
        // Сохраняем существующие значения и дополняем недостающие
        return {
          ...config.initialValues,
          ...prev, // Сохраняем существующие значения
        };
      }

      return prev; // Возвращаем текущие значения без изменений
    });
  }, [config.initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    isLoading: isLoginLoading || isRegisterLoading,
  };
};
