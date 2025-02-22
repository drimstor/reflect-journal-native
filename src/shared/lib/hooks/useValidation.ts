import { useState } from 'react';

export type FormValues<T> = {
  [K in Extract<keyof T, string>]: T[K];
};

export type IValidationState<T> = {
  [K in keyof T]: IValidationSchema<T[K]>;
};

interface IValidationSchema<T> {
  stateType: 'success' | 'error' | null;
  message: string | null;
  validator: (value: T, otherValues: Record<string, T>) => { stateType: 'success' | 'error'; message: string | null };
}

const useValidation = <T extends Record<string, any>>(
  validationSchema: IValidationState<T>,
  formValues: FormValues<T>,
) => {
  const [validationState, setValidationState] = useState({} as IValidationState<T>);

  const validateField = async (fieldName: string, value: T[string]) => {
    const fieldValidator = validationSchema[fieldName];

    if (!fieldValidator) {
      return null;
    }

    const { validator } = fieldValidator;

    if (validator instanceof Function) {
      const validation = validator(value, formValues);
      setValidationState((prevState: IValidationState<T>) => ({
        ...prevState,
        [fieldName]: {
          ...fieldValidator,
          stateType: validation.stateType,
          message: validation.message,
        },
      }));
      return validation.stateType;
    } else {
      console.error(`Invalid validator for field "${fieldName}"`);
      return null;
    }
  };

  const validateForm = async () => {
    const validationResults = {} as IValidationState<T>;

    for (const fieldName in validationSchema) {
      const fieldValidator = validationSchema[fieldName];
      const value = formValues[fieldName];

      if (fieldValidator.validator instanceof Function) {
        const validation = fieldValidator.validator(value, formValues);
        validationResults[fieldName] = {
          ...fieldValidator,
          stateType: validation.stateType,
          message: validation.message,
        };
      } else {
        validationResults[fieldName] = {
          ...fieldValidator,
          stateType: null,
        };
      }
    }

    setValidationState(validationResults);

    const allFieldsSuccess = Object.values(validationResults).every(field => field.stateType === 'success');

    return {
      validationResults,
      allFieldsSuccess,
    };
  };

  const resetFieldValidation = (fieldName: string) => {
    setValidationState((prevState: IValidationState<T>) => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        stateType: null,
        message: null,
      },
    }));
  };

  return {
    validationState,
    resetFieldValidation,
    validateField,
    validateForm,
  };
};

export default useValidation;
