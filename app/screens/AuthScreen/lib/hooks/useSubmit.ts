import { useLoginMutation, useRegisterMutation } from "@/src/entities";
import { PATHS } from "@/src/shared/const";
import { useT } from "@/src/shared/lib/hooks";
import { NavigationProps } from "@/src/shared/model/types";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { Keyboard } from "react-native";
import { initialValues } from "../../const/static";
import {
  TextFields,
  UseSubmitProps,
  ValidationErrors,
} from "../../model/types";

export const useSubmit = ({
  textFields,
  variant,
  setErrors,
}: UseSubmitProps) => {
  const t = useT();
  const navigation = useNavigation<NavigationProps>();
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Валидация email
    if (!textFields.email.trim()) {
      newErrors.email = t("auth.validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(textFields.email)) {
      newErrors.email = t("auth.validation.emailInvalid");
    }

    // Валидация пароля
    if (!textFields.password.trim()) {
      newErrors.password = t("auth.validation.passwordRequired");
    } else if (textFields.password.length < 6) {
      newErrors.password = t("auth.validation.passwordTooShort");
    }

    // Дополнительные проверки для регистрации
    if (variant === "signUp") {
      // Валидация имени
      if (!textFields.name.trim()) {
        newErrors.name = t("auth.validation.nameRequired");
      }

      // Валидация подтверждения пароля
      if (!textFields.confirmPassword.trim()) {
        newErrors.confirmPassword = t(
          "auth.validation.confirmPasswordRequired"
        );
      } else if (textFields.password !== textFields.confirmPassword) {
        newErrors.confirmPassword = t("auth.validation.passwordsDoNotMatch");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------- //

  const handleSubmit = () => {
    if (!validate()) return;

    if (variant === "signIn") {
      loginMutation({
        email: textFields.email,
        password: textFields.password,
      })
        .unwrap()
        .then(() => {
          navigation.navigate(PATHS.MAIN_STACK);
        });
    }

    if (variant === "signUp") {
      registerMutation({
        email: textFields.email,
        password: textFields.password,
        name: textFields.name,
      })
        .unwrap()
        .then(() => {
          navigation.navigate(PATHS.MAIN_STACK);
        });
    }
  };

  // ---------------------- //

  const prevTextFieldsRef = useRef<TextFields>(initialValues);

  // Отслеживаем изменения в полях для определения автозаполнения
  useEffect(() => {
    // Проверяем, было ли автозаполнение (быстрое изменение нескольких полей)
    const wasAutoFilled =
      textFields.email !== prevTextFieldsRef.current.email &&
      textFields.email !== "" &&
      textFields.password !== prevTextFieldsRef.current.password &&
      textFields.password !== "";

    if (wasAutoFilled) {
      // Закрываем клавиатуру при автозаполнении
      Keyboard.dismiss();
    }

    // Обновляем предыдущие значения
    prevTextFieldsRef.current = textFields;
  }, [textFields]);

  return { handleSubmit, isAuthLoading: isLoginLoading || isRegisterLoading };
};
