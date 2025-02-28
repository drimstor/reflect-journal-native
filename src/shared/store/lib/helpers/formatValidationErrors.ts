interface ValidationError {
  input?: Record<string, any>;
  loc?: string[];
  msg?: string;
  type?: string;
  detail?: ValidationError[];
  message?: string;
}

export const formatValidationErrors = (
  error: ValidationError | ValidationError[] | any
): string => {
  if (!error) return "Произошла неизвестная ошибка";

  // Если это массив ошибок
  if (Array.isArray(error)) {
    return error.map((err) => formatValidationErrors(err)).join("\n");
  }

  // Если есть detail с массивом ошибок
  if (error.detail && Array.isArray(error.detail)) {
    return formatValidationErrors(error.detail);
  }

  // Если есть прямое сообщение об ошибке
  if (error.message) {
    return error.message;
  }

  // Обработка ошибок валидации
  if (error.loc && error.msg) {
    const field = error.loc[error.loc.length - 1];

    if (error.type === "missing") {
      return `Поле '${field}' является обязательным`;
    }

    return `Ошибка в поле '${field}': ${error.msg}`;
  }

  // Если ничего не подошло
  return "Произошла неизвестная ошибка";
};
