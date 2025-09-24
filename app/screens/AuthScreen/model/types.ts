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
}
