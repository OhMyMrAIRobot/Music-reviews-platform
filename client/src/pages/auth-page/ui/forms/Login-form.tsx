import { useMemo, useState } from "react";
import FormButton from "../../../../components/form-elements/Form-button";
import FormInput from "../../../../components/form-elements/Form-input";
import FormLabel from "../../../../components/form-elements/Form-label";
import FormSubTitle from "../../../../components/form-elements/Form-subtitle";
import FormTitle from "../../../../components/form-elements/Form-title";
import PreventableLink from "../../../../components/utils/Preventable-link";
import { useLoginMutation } from "../../../../hooks/mutations";
import useNavigationPath from "../../../../hooks/use-navigation-path";
import { constraints } from "../../../../utils/constraints";

const LoginForm = () => {
  const { navigateToRegistration, navigateToRequestReset } =
    useNavigationPath();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { mutateAsync: login, isPending: isLoading } = useLoginMutation();

  /**
   * Indicates whether the form is valid.
   *
   * @return {boolean} True if the form is valid, false otherwise.
   */
  const isFormValid = useMemo(() => {
    return (
      email.trim().length >= constraints.user.minEmailLength &&
      email.trim().length <= constraints.user.maxEmailLength &&
      password.length >= constraints.user.minPasswordLength &&
      password.length <= constraints.user.maxPasswordLength
    );
  }, [email, password]);

  /**
   * Handles the form submission.
   */
  const handleSubmit = async () => {
    if (isLoading || !isFormValid) return;

    return login({ email: email.trim(), password });
  };

  return (
    <div className="grid w-full sm:w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <FormTitle title={"Вход"} />
        <FormSubTitle title={"Введите свои данные для входа в аккаунт"} />
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <FormLabel name={"Email"} htmlFor={"AuthEmail"} />

          <FormInput
            id={"AuthEmail"}
            placeholder={"Ваш email"}
            type={"email"}
            value={email}
            setValue={setEmail}
          />
        </div>

        <div className="grid gap-2">
          <div className="flex justify-between items-center select-none">
            <FormLabel name={"Пароль"} htmlFor={"AuthPassword"} />

            <PreventableLink
              to={navigateToRequestReset}
              prevent={isLoading}
              className={`text-sm cursor-pointer font-bold hover:underline underline-offset-4 ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              Забыли пароль?
            </PreventableLink>
          </div>

          <FormInput
            id={"AuthPassword"}
            placeholder={"Ваш пароль"}
            type={"password"}
            value={password}
            setValue={setPassword}
          />
        </div>

        <div className="grid gap-2">
          <FormButton
            title={isLoading ? "Загрузка..." : "Войти"}
            onClick={handleSubmit}
            isInvert={true}
            disabled={isLoading || !isFormValid}
            isLoading={isLoading}
          />

          <PreventableLink to={navigateToRegistration} prevent={isLoading}>
            <FormButton
              title={"Зарегистрироваться"}
              isInvert={false}
              disabled={isLoading}
            />
          </PreventableLink>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
