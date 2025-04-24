import { ValidationError } from 'class-validator';

interface FieldError {
  field: string;
  message: string;
}

export function parseFieldErrors(errors: ValidationError[]): FieldError[] {
  return errors.flatMap((error) => {
    const messages = error.constraints
      ? Object.values(error.constraints)
      : ['invalid value'];

    return messages.map((msg) => ({
      field: error.property,
      message: msg,
    }));
  });
}
