import { addSnackbar, AppDispatch } from "../../";
// Типы для различных форматов ошибок
interface ErrorWithMessage {
  error: string;
  message: string;
}

interface ErrorWithDetail {
  detail: string | { msg?: string; [key: string]: any }[];
}

interface ErrorWithOnlyMessage {
  message: string;
}

interface ErrorWithOnlyError {
  error: string;
}

type ApiErrorData =
  | ErrorWithMessage
  | ErrorWithDetail
  | ErrorWithOnlyMessage
  | ErrorWithOnlyError;

interface ApiError {
  data?: ApiErrorData;
}

// Стратегии извлечения сообщений об ошибках
const errorStrategies = [
  // Приоритет 1: error + message
  (data: ApiErrorData): string | null => {
    if ("error" in data && "message" in data && data.message) {
      return data.message;
    }
    return null;
  },

  // Приоритет 2: только error
  (data: ApiErrorData): string | null => {
    if ("error" in data && !("message" in data)) {
      return data.error;
    }
    return null;
  },

  // Приоритет 3: detail (массив или строка)
  (data: ApiErrorData): string | null => {
    if ("detail" in data && data.detail) {
      const detail = data.detail;
      if (Array.isArray(detail) && detail.length > 0) {
        return extractMessageFromDetail(detail[0]);
      }
      if (typeof detail === "string") {
        return detail;
      }
    }
    return null;
  },

  // Приоритет 4: только message
  (data: ApiErrorData): string | null => {
    if ("message" in data && !("error" in data)) {
      return data.message;
    }
    return null;
  },
];

const extractMessageFromDetail = (detail: any): string => {
  if (typeof detail === "object" && detail !== null) {
    return detail.msg || JSON.stringify(detail);
  }
  return String(detail);
};

const extractErrorMessage = (error: ApiError): string => {
  if (!error.data) {
    return "Произошла неизвестная ошибка";
  }

  // Применяем стратегии по приоритету
  for (const strategy of errorStrategies) {
    const message = strategy(error.data);
    if (message) {
      return message;
    }
  }

  return "Произошла неизвестная ошибка";
};

export const handleError = (dispatch: AppDispatch) => (error: ApiError) => {
  const errorMessage = extractErrorMessage(error);

  dispatch(
    addSnackbar({
      text: errorMessage,
      type: "error",
    })
  );
};
