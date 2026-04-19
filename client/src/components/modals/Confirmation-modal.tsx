import { FC } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import FormButton from '../form-elements/Form-button';
import CloseSvg from '../svg/Close-svg';
import ModalOverlay from './Modal-overlay';

interface IProps {
  title: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ConfirmationModal: FC<IProps> = ({
  title,
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  return createPortal(
    <ModalOverlay isOpen={isOpen} onCancel={onCancel} isLoading={isLoading}>
      <div
        className={`relative rounded-lg px-6 pb-6 pt-8 w-[90%] lg:w-100 border border-white/10 bg-zinc-950 grid gap-6 transition-transform duration-300`}
      >
        <button
          type="button"
          aria-label={t('modals.close')}
          onClick={onCancel}
          disabled={isLoading}
          className={`absolute p-1 top-3 right-3 bg-zinc-900 rounded-full cursor-pointer text-white/60  transition-colors duration-200 ${
            isLoading ? 'opacity-50 pointer-events-none' : 'hover:text-white'
          }`}
        >
          <CloseSvg className={'size-4'} />
        </button>

        <h3 className="text-base lg:text-lg text-center font-bold">{title}</h3>

        <div className="grid gap-2">
          <FormButton
            title={t('modals.confirm')}
            isInvert={true}
            onClick={onConfirm}
            disabled={false}
            isLoading={isLoading}
          />
          <FormButton
            title={t('modals.cancel')}
            isInvert={false}
            onClick={onCancel}
            disabled={isLoading}
          />
        </div>
      </div>
    </ModalOverlay>,
    document.body
  );
};

export default ConfirmationModal;
