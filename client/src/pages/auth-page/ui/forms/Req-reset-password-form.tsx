import { useMemo, useState } from "react";
import FormButton from "../../../../components/form-elements/Form-button";
import FormInput from "../../../../components/form-elements/Form-input";
import FormLabel from "../../../../components/form-elements/Form-label";
import FormSubTitle from "../../../../components/form-elements/Form-subtitle";
import FormTitle from "../../../../components/form-elements/Form-title";
import { useRequestResetPasswordMutation } from "../../../../hooks/mutations/user/use-request-reset-password-mutation";
import { constraints } from "../../../../utils/constraints";

const ReqResetPasswordForm = () => {
  const [email, setEmail] = useState<string>("");

  const { mutateAsync: sendRequest, isPending: isLoading } =
    useRequestResetPasswordMutation({
      onSuccess: () => setEmail(""),
    });

  /**
   * Indicates whether the form is valid.
   *
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const isFormValid = useMemo(() => {
    return (
      email.trim().length > constraints.user.minEmailLength &&
      email.trim().length <= constraints.user.maxEmailLength
    );
  }, [email]);

  /**
   * Handles the form submission.
   */
  const onSubmit = async () => {
    if (isLoading || !isFormValid) return;

    return sendRequest({ email: email.trim() });
  };

  return (
    <div className="grid w-full sm:w-[330px] gap-4">
      <div className="grid gap-1">
        <FormTitle title={"Забыли пароль?"} />
        <FormSubTitle
          title={
            "Введите ваш адрес электронной почты для восстановления пароля"
          }
        />
      </div>
      <div className="grid gap-2">
        <FormLabel name={"Email"} htmlFor={"email"} />
        <FormInput
          id={"email"}
          placeholder={"mail@example.com"}
          type={"email"}
          value={email}
          setValue={setEmail}
        />
      </div>

      <FormButton
        title={isLoading ? "Отправка..." : "Отправить письмо с инструкциями"}
        onClick={onSubmit}
        isInvert={true}
        disabled={isLoading || !isFormValid}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReqResetPasswordForm;
