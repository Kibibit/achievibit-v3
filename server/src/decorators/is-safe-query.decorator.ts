import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSafeQuery(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSafeQuery',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const unsafePatterns = /('|;|--|\/\*|\*\/|SELECT|DROP|INSERT|UNION|UPDATE|DELETE)/i;
          return typeof value === 'string' && !unsafePatterns.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Query contains potentially harmful input';
        },
      },
    });
  };
}