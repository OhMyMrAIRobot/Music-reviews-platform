import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function TitleAndTextTogether(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'TitleAndTextTogether',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as { title?: string; text?: string };
          const hasTitle =
            obj.title !== undefined && obj.title !== null && obj.title !== '';
          const hasText =
            obj.text !== undefined && obj.text !== null && obj.text !== '';
          return (hasTitle && hasText) || (!hasTitle && !hasText);
        },
        defaultMessage() {
          return 'Заполните оба поля: заголовок и текст, либо оставьте оба пустыми';
        },
      },
    });
  };
}
