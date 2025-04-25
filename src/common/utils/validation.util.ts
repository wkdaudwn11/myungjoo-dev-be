import { ValidationError } from 'class-validator';

import { ErrorCode } from '@/common/constants/error-code.enum';
import { LangType } from '@/common/constants/lang-type.enum';
import { CustomException } from '@/common/exceptions/custom.exception';

interface FieldError {
  field: string;
  message: string;
}

export const parseFieldErrors = (errors: ValidationError[]): FieldError[] =>
  errors.flatMap((error) => {
    const messages = error.constraints
      ? Object.values(error.constraints)
      : ['invalid value'];

    return messages.map((msg) => ({
      field: error.property,
      message: msg,
    }));
  });

export const validateLang = (lang: string) => {
  const allowedValues = Object.values(LangType).join(', ');

  if (!Object.values(LangType).includes(lang as LangType)) {
    throw new CustomException(
      `lang must be one of the following values: ${allowedValues}`,
      ErrorCode.VALIDATION_ERROR,
      {
        fieldErrors: [
          {
            field: 'lang',
            message: `lang must be one of the following values: ${allowedValues}`,
          },
        ],
      },
    );
  }
};
