"use client";

import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<T, any, any>;
  children: React.ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  form,
  children,
}: FormFieldProps<T>) {
  const error = form.formState.errors[name];
  return (
    <div>
      <label className="block text-xs font-medium text-[#4F5C72] mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[#F25959] mt-1">
          {String(error.message ?? "Invalid value")}
        </p>
      )}
    </div>
  );
}
