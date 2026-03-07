import { FC, useEffect, useMemo, useState } from "react";
import FormButton from "../../../../../components/form-elements/Form-button";
import FormInput from "../../../../../components/form-elements/Form-input";
import FormLabel from "../../../../../components/form-elements/Form-label";
import FormTextbox from "../../../../../components/form-elements/Form-textbox";
import ModalOverlay from "../../../../../components/modals/Modal-overlay";
import { useAdminUpdateAuthorCommentMutation } from "../../../../../hooks/mutations";
import { AuthorComment } from "../../../../../types/author";
import { constraints } from "../../../../../utils/constraints";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  comment: AuthorComment;
}

const AuthorCommentFormModal: FC<IProps> = ({ isOpen, onClose, comment }) => {
  const [title, setTitle] = useState<string>(comment.title);
  const [text, setText] = useState<string>(comment.text);

  useEffect(() => {
    setTitle(comment.title);
    setText(comment.text);
  }, [comment]);

  const { mutateAsync, isPending } = useAdminUpdateAuthorCommentMutation({
    onSuccess: () => {
      onClose();
    },
  });

  /**
   * Checks if there are changes in the form
   *
   * @returns {boolean} - True if there are changes, false otherwise
   */
  const hasChanges = useMemo(() => {
    return title !== comment.title || text !== comment.text;
  }, [title, comment.title, comment.text, text]);

  /**
   * Checks if the form is valid
   *
   * @returns {boolean} - True if the form is valid, false otherwise
   */
  const isFormValid = useMemo(() => {
    return (
      text.trim().length <= constraints.authorComment.maxTextLength &&
      text.trim().length >= constraints.authorComment.minTextLength &&
      title.trim().length >= constraints.authorComment.minTitleLength &&
      title.trim().length <= constraints.authorComment.maxTitleLength
    );
  }, [text, title]);

  const updateComment = async () => {
    if (!isFormValid || isPending || !hasChanges) return;

    mutateAsync({
      id: comment.id,
      data: {
        title: title.trim() !== comment.title ? title.trim() : undefined,
        text: text.trim() !== comment.text ? text.trim() : undefined,
      },
    });
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onCancel={onClose}
      isLoading={isPending}
      className="max-lg:size-full"
    >
      <div
        className={`relative rounded-xl w-full max-lg:h-full lg:w-240 border border-white/10 bg-zinc-950 transition-transform duration-300 p-6 max-h-full overflow-y-scroll`}
      >
        <div className="size-full flex flex-col gap-6">
          <h1 className="border-b border-white/10 text-3xl font-bold py-4 text-center">
            Редактирование авторского комментария
          </h1>

          <div className="grid gap-2">
            <FormLabel
              name={"Заголовок"}
              htmlFor={"comment-title-input"}
              isRequired={false}
            />
            <FormInput
              id={"comment-title-input"}
              placeholder={"Заголовок..."}
              type={"text"}
              value={title}
              setValue={setTitle}
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <FormLabel
              name={"Комментарий"}
              htmlFor={"comment-text-input"}
              isRequired={false}
            />
            <FormTextbox
              id={"comment-text-input"}
              placeholder={"Комментарий..."}
              value={text}
              setValue={setText}
              className="h-full min-h-30 lg:h-60"
            />
          </div>

          <div className="grid sm:flex gap-3 sm:justify-start">
            <div className="w-full sm:w-30">
              <FormButton
                title={"Сохранить"}
                isInvert={true}
                onClick={updateComment}
                disabled={!hasChanges || isPending || !isFormValid}
                isLoading={isPending}
              />
            </div>

            <div className="w-full sm:w-25">
              <FormButton
                title={"Назад"}
                isInvert={false}
                onClick={onClose}
                disabled={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default AuthorCommentFormModal;
