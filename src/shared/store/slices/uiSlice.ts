import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISnackbar, SnackbarType } from "../../ui/Snackbar/Snackbar";
import { RootState } from "../store";

export interface IModal<T = any> {
  name: string;
  data?: T;
}

interface UIState {
  snackbars: ISnackbar[];
  modals: IModal[];
}

const initialState: UIState = {
  snackbars: [],
  modals: [],
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addSnackbar: (
      state,
      action: PayloadAction<{ text: string; type: SnackbarType }>
    ) => {
      const newSnackbar: ISnackbar = {
        id: Date.now(),
        text: action.payload.text,
        type: action.payload.type,
      };
      state.snackbars.push(newSnackbar);
    },
    removeSnackbar: (state, action: PayloadAction<number>) => {
      state.snackbars = state.snackbars.filter(
        (snackbar) => snackbar.id !== action.payload
      );
    },
    clearAllSnackbars: (state) => {
      state.snackbars = [];
    },
    addModal: (state, action: PayloadAction<IModal>) => {
      state.modals.push(action.payload);
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(
        (modal) => modal.name !== action.payload
      );
    },
    clearAllModals: (state) => {
      state.modals = [];
    },
  },
});

export const {
  addSnackbar,
  removeSnackbar,
  addModal,
  removeModal,
  clearAllModals,
  clearAllSnackbars,
} = uiSlice.actions;

export const selectSnackbars = (state: RootState) => state.ui.snackbars;
export const selectModals = (state: RootState) => state.ui.modals;
