import { addSnackbar, AppDispatch } from "../../";

export const handleError = (dispatch: AppDispatch) => (error: any) => {
  // Проверяем новый формат ошибки
  if (error.data?.error && error.data?.message) {
    dispatch(addSnackbar({ text: error.data.message, type: "error" }));
    return;
  }

  // Проверяем старый формат ошибки с detail
  if (error.data?.detail) {
    const detail = error.data.detail;
    const errorMessage = Array.isArray(detail)
      ? getErrorMessage(detail[0])
      : getErrorMessage(detail);

    dispatch(addSnackbar({ text: errorMessage, type: "error" }));
    return;
  }

  // Если это другой формат ошибки, попробуем извлечь сообщение
  if (error.data?.message) {
    dispatch(addSnackbar({ text: error.data.message, type: "error" }));
    return;
  }

  // Если формат ошибки неизвестен, показываем общее сообщение
  dispatch(addSnackbar({ text: "Something went wrong", type: "error" }));
};

const getErrorMessage = (errorDetail: any): string => {
  if (typeof errorDetail === "object") {
    return errorDetail.msg || JSON.stringify(errorDetail);
  }
  return errorDetail;
};
