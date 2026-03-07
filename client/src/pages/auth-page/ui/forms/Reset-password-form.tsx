import { useMemo, useState } from "react";
import { useParams } from "react-router";
import FormButton from "../../../../components/form-elements/Form-button";
import FormInput from "../../../../components/form-elements/Form-input";
import FormLabel from "../../../../components/form-elements/Form-label";
import FormSubTitle from "../../../../components/form-elements/Form-subtitle";
import FormTitle from "../../../../components/form-elements/Form-title";
import { useResetPasswordMutation } from "../../../../hooks/mutations";
import { useStore } from "../../../../hooks/use-store";
import { constraints } from "../../../../utils/constraints";

/**
 * Form for resetting the password.
 */
type ResetPasswordFormState = {
  password: string;
  passwordConfirm: string;
};

const ResetPasswordForm = () => {
  const { token } = useParams();
  const { notificationStore } = useStore();

  const [formData, setFormData] = useState<ResetPasswordFormState>({
    password: "",
    passwordConfirm: "",
  });

  const { mutateAsync: reset, isPending: isLoading } =
    useResetPasswordMutation();

  /**
   * Indeicates whether the form is valid.
   *
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const isFormValid = useMemo(() => {
    return (
      formData.password.length >= constraints.user.minPasswordLength &&
      formData.password.length <= constraints.user.maxPasswordLength &&
      formData.password === formData.passwordConfirm
    );
  }, [formData]);

  /**
   * Handles the form submission.
   */
  const onSubmit = async () => {
    if (!isFormValid || isLoading) return;

    if (formData.password !== formData.passwordConfirm) {
      notificationStore.addErrorNotification("Пароли не совпадают!");
      return;
    }

    return reset({ password: formData.password, token: token! });
  };

  /**
   * Handles the input change.
   *
   * @param field - The field to update.
   * @param value - The new value.
   */
  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Renders an input field.
   *
   * @param id - The input id.
   * @param label - The input label.
   * @param type - The input type.
   * @param placeholder - The input placeholder.
   * @param description - The input description.
   *
   * @returns The rendered input field.
   */
  const renderInput = (
    id: keyof typeof formData,
    label: string,
    type: string,
    placeholder?: string,
    description?: string,
  ) => (
    <div className="grid gap-1">
      <FormLabel name={label} htmlFor={id} />
      {description && (
        <h3 className="text-sm font-medium text-white/50 select-none">
          {description}
        </h3>
      )}
      <FormInput
        id={id}
        placeholder={placeholder || ""}
        type={type}
        value={formData[id] as string}
        setValue={(value) => handleChange(id, value)}
      />
    </div>
  );

  return (
    <div className="grid gap-4 w-full sm:w-[330px]">
      <div className="grid gap-1">
        <FormTitle title={"Сброс пароля"} />
        <FormSubTitle title={"Введите новый пароль для аккаунта"} />
      </div>

      {renderInput("password", "Новый пароль", "password")}
      {renderInput("passwordConfirm", "Подтвердите пароль", "password")}

      <FormButton
        title={isLoading ? "Сброс пароля..." : "Сбросить пароль"}
        onClick={onSubmit}
        isInvert={true}
        disabled={isLoading || !isFormValid}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResetPasswordForm;
