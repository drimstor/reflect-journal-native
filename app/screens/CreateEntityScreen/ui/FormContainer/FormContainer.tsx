import React from "react";
import { PaddingLayout } from "@/src/shared/ui";
import { FormField } from "@/src/widgets";
import { ThemeColors } from "@/src/shared/model/types";
import { formContainerStyles } from "./FormContainer.styles";

interface FormContainerProps {
  fields: FormField[];
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
