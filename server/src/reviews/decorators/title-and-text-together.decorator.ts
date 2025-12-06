import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function TitleAndTextTogether(validationOptions?: ValidationOptions) {
  /**
   * Class-level validator ensuring `title` and `text` are provided together.
   *
   * Use this decorator on a DTO class to enforce that either both
   * `title` and `text` are non-empty, or both are empty/omitted. This is
   * useful for requests where a review may include an optional title+text
   * pair and partial presence is not allowed.
   *
   * The decorator registers a custom `class-validator` constraint that
   * inspects the containing object for `title` and `text` properties.
   *
   * @param validationOptions optional `class-validator` options to customize
   * validation groups, message, etc.
   * @returns a property decorator function to be applied on the class
   */
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'TitleAndTextTogether',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(_, args: ValidationArguments) {
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
