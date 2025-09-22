import { ThemeColors } from "@/src/shared/model/types";
import { PaddingLayout } from "@/src/shared/ui";
import { FormField, FormFieldConfig } from "@/src/widgets";
import React from "react";
import { formContainerStyles } from "./FormContainer.styles";

interface FormContainerProps {
  fields: FormFieldConfig[];
  values: Record<string, any>;
  errors: Record<string, string>;
  onChange: (key: string, value: any) => void;
  colors: ThemeColors;
}

export const FormContainer = ({
  fields,
  values,
  errors,
  onChange,
  colors,
}: FormContainerProps) => {
  const styles = formContainerStyles(colors);

  return (
    <PaddingLayout style={styles.container}>
      {fields.map((field) => (
        <FormField
          key={field.key}
          field={field}
          value={values[field.key]}
          error={errors[field.key]}
          onChange={onChange}
        />
      ))}
    </PaddingLayout>
  );
};
