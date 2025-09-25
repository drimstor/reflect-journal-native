export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface TextFields {
  email: string;
  password: string;
  confirmPassword: string;
}

export type Variant = "signIn" | "signUp" | "splash";

export interface UseSubmitProps {
  textFields: TextFields;
  variant: Variant;
  setErrors: (errors: ValidationErrors) => void;
  snapToIndex: (index: number) => void;
}

// Новые типы для рефакторинга
export interface AuthFormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}
