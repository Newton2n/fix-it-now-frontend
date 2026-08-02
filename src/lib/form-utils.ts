import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

// Set form field errors from API response

export function setFormErrors<T extends FieldValues>(
  errorDetails: Array<{ field?: string; message: string }> | undefined,
  setError: UseFormSetError<T>,
) {
  if (!errorDetails) return;

  errorDetails.forEach((error) => {
    if (error.field) {
      setError(error.field as Path<T>, {
        message: error.message,
      });
    }
  });
}
