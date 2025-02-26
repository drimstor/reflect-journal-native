import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { PATHS } from "@/src/shared/const";

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
}

export interface TextFields {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export type Variant = "signIn" | "signUp";

export interface UseSubmitProps {
  textFields: TextFields;
  variant: Variant;
  setErrors: (errors: ValidationErrors) => void;
}
