import { addSnackbar, AppDispatch } from "../../";

export const handleError = (dispatch: AppDispatch) => (error: any) => {
  if (!error.data?.detail) return;
  const detail = error.data.detail;

  const errorMessage = Array.isArray(detail)
    ? getErrorMessage(detail[0])
    : getErrorMessage(detail);

  dispatch(addSnackbar({ text: errorMessage, type: "error" }));
};

const getErrorMessage = (errorDetail: any): string => {
  if (typeof errorDetail === "object") {
    return errorDetail.msg || JSON.stringify(errorDetail);
  }
  return errorDetail;
};
