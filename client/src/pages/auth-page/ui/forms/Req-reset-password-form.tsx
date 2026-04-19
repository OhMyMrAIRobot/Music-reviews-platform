import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormButton from '../../../../components/form-elements/Form-button';
import FormInput from '../../../../components/form-elements/Form-input';
import FormLabel from '../../../../components/form-elements/Form-label';
import FormSubTitle from '../../../../components/form-elements/Form-subtitle';
import FormTitle from '../../../../components/form-elements/Form-title';
import { useRequestResetPasswordMutation } from '../../../../hooks/mutations/user/use-request-reset-password-mutation';
import { constraints } from '../../../../utils/constraints';

const ReqResetPasswordForm = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');

  const { mutateAsync: sendRequest, isPending: isLoading } =
    useRequestResetPasswordMutation({
      onSuccess: () => setEmail(''),
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
        <FormTitle title={t('authForms.requestReset.title')} />
        <FormSubTitle title={t('authForms.requestReset.subtitle')} />
      </div>
      <div className="grid gap-2">
        <FormLabel name={t('authForms.login.emailLabel')} htmlFor={'email'} />
        <FormInput
          id={'email'}
          placeholder={t('authForms.requestReset.emailPlaceholder')}
          type={'email'}
          value={email}
          setValue={setEmail}
        />
      </div>

      <FormButton
        title={
          isLoading
            ? t('authForms.requestReset.loading')
            : t('authForms.requestReset.submit')
        }
        onClick={onSubmit}
        isInvert={true}
        disabled={isLoading || !isFormValid}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ReqResetPasswordForm;
